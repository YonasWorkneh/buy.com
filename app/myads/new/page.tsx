"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CreateProductPayload,
  getProductCategories,
} from "@/lib/services/products";
import {
  addListing,
  getListingById,
  type MyListingRecord,
} from "@/lib/db/myListings";
import useCreateProduct from "@/app/hooks/useCreateProduct";
import useUpdateProduct from "@/app/hooks/useUpdateProduct";
import { useRouter, useSearchParams } from "next/navigation";

type FormState = {
  title: string;
  description: string;
  price: string;
  stock: string;
  discount: string;
  discountType: string;
  category: string;
  images: string[];
};
const DRAFT_STORAGE_KEY = "buy-com-add-product-draft";
const createDefaultFormState = (): FormState => ({
  title: "",
  description: "",
  price: "",
  stock: "",
  discount: "",
  discountType: "",
  category: "",
  images: [],
});

export default function AddProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editIdParam = searchParams.get("editId");
  const editId = editIdParam ? Number(editIdParam) : null;
  const [editingListing, setEditingListing] = useState<MyListingRecord | null>(
    null
  );
  const [formState, setFormState] = useState<FormState>(() => {
    if (typeof window === "undefined") {
      return createDefaultFormState();
    }
    const draft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!draft) {
      return createDefaultFormState();
    }

    try {
      const parsed = JSON.parse(draft) as FormState;
      return parsed;
    } catch (error) {
      console.error("Failed to parse draft", error);
      return createDefaultFormState();
    }
  });
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPrefilling, setIsPrefilling] = useState(false);

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getProductCategories,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (!editId) {
      return;
    }
    startTransition(() => setIsPrefilling(true));
    getListingById(editId)
      .then((record) => {
        if (!record) {
          toast.error("We couldn't find that listing locally.");
          router.replace("/myads/new");
          return;
        }
        setEditingListing(record);
        setFormState({
          title: record.title ?? "",
          description: record.description ?? "",
          price: record.price ? String(record.price) : "",
          stock: record.stock ? String(record.stock) : "",
          discount: record.discountPercentage
            ? String(record.discountPercentage)
            : "",
          discountType: record.discountType ?? "",
          category: record.category ?? "",
          images: record.images ?? [],
        });
        setPrimaryImageIndex(0);
      })
      .catch((error) => {
        console.error("Failed to load listing for edit", error);
        toast.error("Unable to load listing for editing.");
      })
      .finally(() => startTransition(() => setIsPrefilling(false)));
  }, [editId, router]);

  const createProductMutation = useCreateProduct({
    onSuccess: async (response) => {
      toast.success("Product added successfully!");
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
      try {
        const parsedPrice = Number(formState.price) || 0;
        const parsedDiscount = Number(formState.discount) || 0;
        const parsedStock = Number(formState.stock) || 0;
        const record: MyListingRecord = {
          id: response.id,
          title: response.title ?? formState.title,
          description: response.description ?? formState.description,
          category: response.category ?? formState.category,
          price:
            typeof response.price === "number" ? response.price : parsedPrice,
          discountPercentage: parsedDiscount,
          discountType: formState.discountType || undefined,
          stock:
            typeof response.stock === "number" ? response.stock : parsedStock,
          thumbnail:
            formState.images[primaryImageIndex] ??
            response.thumbnail ??
            response.images?.[0],
          images:
            formState.images.length > 0
              ? formState.images
              : response.images ?? [],
          remoteId: response.id,
          createdAt: new Date().toISOString(),
          source: "api",
          raw: response,
        };
        await addListing(record);
      } catch (error) {
        console.error("Failed to persist listing", error);
        toast.error(
          "Saved to server, but we couldn't store it locally. Please refresh."
        );
      }
      setFormState(createDefaultFormState());
      setPrimaryImageIndex(0);
      router.push("/myads");
    },
    onError: (err) => {
      console.error("Failed to create product", err);
      toast.error("Unable to add product. Please try again.");
    },
  });

  const updateProductMutation = useUpdateProduct({
    onSuccess: async (response, variables) => {
      toast.success("Product updated successfully!");
      try {
        const parsedPrice = Number(formState.price) || 0;
        const parsedDiscount = Number(formState.discount) || 0;
        const parsedStock = Number(formState.stock) || 0;
        const record: MyListingRecord = {
          id: editingListing?.id ?? variables.id,
          title: response.title ?? formState.title,
          description: response.description ?? formState.description,
          category: response.category ?? formState.category,
          price:
            typeof response.price === "number" ? response.price : parsedPrice,
          discountPercentage: parsedDiscount,
          discountType: formState.discountType || undefined,
          stock:
            typeof response.stock === "number" ? response.stock : parsedStock,
          thumbnail:
            formState.images[primaryImageIndex] ??
            response.thumbnail ??
            response.images?.[0],
          images: formState.images,
          remoteId: editingListing?.remoteId ?? variables.id,
          createdAt: editingListing?.createdAt ?? new Date().toISOString(),
          source: "api",
          raw: response,
        };
        await addListing(record, { allowReplace: true });
      } catch (error) {
        console.error("Failed to persist updated listing", error);
        toast.error("Updated remotely, but failed to store locally.");
      }
      router.push("/myads");
    },
    onError: (err) => {
      console.error("Failed to update product", err);
      toast.error("Unable to update product. Please try again.");
    },
  });

  const activeMutation = editId ? updateProductMutation : createProductMutation;

  const isSubmitDisabled =
    !formState.title ||
    !formState.description ||
    !formState.category ||
    formState.images.length === 0 ||
    activeMutation.isPending ||
    isPrefilling;

  const primaryImage = useMemo(
    () => formState.images[primaryImageIndex] ?? "",
    [formState.images, primaryImageIndex]
  );

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const fileArray = Array.from(files);
    try {
      const converted = await Promise.all(fileArray.map(fileToDataUrl));
      const hadImages = formState.images.length > 0;
      setFormState((prev) => ({
        ...prev,
        images: [...prev.images, ...converted],
      }));
      if (!hadImages && converted.length > 0) {
        setPrimaryImageIndex(0);
      }
      event.target.value = "";
    } catch (error) {
      console.error("Failed to read files", error);
      toast.error("We couldn't process the selected files.");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormState((prev) => {
      const nextImages = prev.images.filter((_, idx) => idx !== index);
      setPrimaryImageIndex((current) => {
        if (nextImages.length === 0) {
          return 0;
        }
        if (current === index) {
          return 0;
        }
        if (current > index) {
          return current - 1;
        }
        return Math.min(current, nextImages.length - 1);
      });
      return {
        ...prev,
        images: nextImages,
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateProductPayload = {
      title: formState.title,
      description: formState.description,
      price: Number(formState.price) || 0,
      discountPercentage: Number(formState.discount) || 0,
      stock: Number(formState.stock) || 0,
      category: formState.category,
      discountType: formState.discountType,
    };

    if (editId) {
      const remoteId = editingListing?.remoteId ?? editingListing?.id ?? editId;
      if (!remoteId) {
        toast.error("Missing product identifier for update.");
        return;
      }
      updateProductMutation.mutate({
        id: remoteId,
        payload,
      });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  return (
    <section className="w-full px-6 py-12 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1a1a1a]">
              {editId ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              {editId
                ? "Update the product details and save your changes."
                : "Complete the product details below to publish a new item to your storefront."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              form="add-product-form"
              className={`rounded-full bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] ${
                isSubmitDisabled ? "cursor-not-allowed opacity-70" : ""
              }`}
              disabled={isSubmitDisabled || isPrefilling}
            >
              {activeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              {editId ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </header>

        <form
          id="add-product-form"
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-2"
        >
          <div className="space-y-6">
            <div className="rounded-3xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                General Information
              </h2>
              <p className="mt-1 text-sm text-[#4a4a4a]">
                Provide the basics about this product.
              </p>
              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Product Name
                  </span>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(event) =>
                      handleFieldChange("title", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
                    placeholder="Enter product name"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Description
                  </span>
                  <textarea
                    rows={4}
                    value={formState.description}
                    onChange={(event) =>
                      handleFieldChange("description", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
                    placeholder="Describe the product details, materials, and selling points"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Pricing & Stock
              </h2>
              <p className="mt-1 text-sm text-[#4a4a4a]">
                Set pricing, inventory count, and promotions.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Price
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.price}
                    onChange={(event) =>
                      handleFieldChange("price", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
                    placeholder="e.g. 79.99"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Stock
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={formState.stock}
                    onChange={(event) =>
                      handleFieldChange("stock", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Category</h2>
              <p className="mt-1 text-sm text-[#4a4a4a]">
                Choose the most relevant category from DummyJSON catalog.
              </p>
              <div className="mt-4">
                {isLoadingCategories ? (
                  <div className="rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-sm text-[#4a4a4a]">
                    Loading categories...
                  </div>
                ) : (
                  <Select
                    value={formState.category}
                    onValueChange={(value) =>
                      handleFieldChange("category", value)
                    }
                  >
                    <SelectTrigger className="w-full rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-left text-sm text-[#1a1a1a] shadow-none focus:border-[#9182d9] focus:outline-none">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          <span className="capitalize pl-5">
                            {category.replace(/-/g, " ")}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Upload Images
              </h2>
              <p className="mt-1 text-sm text-[#4a4a4a]">
                Upload product photography directly from your device.
              </p>

              <div className="mt-6 space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#d8d5ce] bg-[#faf6ef] p-4">
                  {primaryImage ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                      <Image
                        src={primaryImage}
                        alt="Primary product preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm text-[#4a4a4a] cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="h-8 w-8 text-[#1a1a1a]" />
                      Click here or drag and drop images to upload.
                    </div>
                  )}
                </div>

                {formState.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formState.images.map((src, index) => {
                      const isActive = index === primaryImageIndex;
                      return (
                        <div
                          key={src}
                          className={`relative h-20 w-20 overflow-hidden rounded-xl border ${
                            isActive ? "border-[#1a1a1a]" : "border-transparent"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIndex(index)}
                            className="absolute inset-0"
                            aria-label="Select as primary"
                          >
                            <Image
                              src={src}
                              alt={`Product thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute right-1 top-1 rounded-full bg-white/80 px-2 py-0.5 text-xs text-[#1a1a1a]"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-[#d8d5ce] bg-[#faf6ef] text-[#1a1a1a] transition hover:border-[#1a1a1a] cursor-pointer"
                      aria-label="Add another image"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1a1a46] text-2xl leading-none">
                        +
                      </span>
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileSelection}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
