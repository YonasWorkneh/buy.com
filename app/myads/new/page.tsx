"use client";

import { type FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CheckCircle2, Loader2, Plus, Save, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { getProductCategories } from "@/lib/services/products";

type FormState = {
  title: string;
  description: string;
  sizes: string[];
  gender: string;
  price: string;
  stock: string;
  discount: string;
  discountType: string;
  category: string;
  images: string[];
};

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDER_OPTIONS = ["Men", "Women", "Unisex"];
const DRAFT_STORAGE_KEY = "buy-com-add-product-draft";
const createDefaultFormState = (): FormState => ({
  title: "",
  description: "",
  sizes: [],
  gender: "",
  price: "",
  stock: "",
  discount: "",
  discountType: "",
  category: "",
  images: [],
});

export default function AddProductPage() {
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
  const [newImageUrl, setNewImageUrl] = useState("");

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getProductCategories,
    staleTime: 1000 * 60 * 60,
  });

  const addProductMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: formState.title,
        description: formState.description,
        price: Number(formState.price) || 0,
        discountPercentage: Number(formState.discount) || 0,
        stock: Number(formState.stock) || 0,
        category: formState.category,
        thumbnail:
          formState.images[primaryImageIndex] ?? formState.images[0] ?? "",
        images: formState.images,
        tags: formState.sizes,
        meta: {
          gender: formState.gender,
          discountType: formState.discountType,
        },
      };

      const { data } = await api.post("/products/add", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Product added successfully!");
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
      setFormState(createDefaultFormState());
      setPrimaryImageIndex(0);
      setNewImageUrl("");
    },
    onError: () => {
      toast.error("Unable to add product. Please try again.");
    },
  });

  const isSubmitDisabled =
    !formState.title ||
    !formState.description ||
    !formState.category ||
    formState.images.length === 0 ||
    addProductMutation.isPending;

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

  const toggleSize = (size: string) => {
    setFormState((prev) => {
      const exists = prev.sizes.includes(size);
      const nextSizes = exists
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size];
      return {
        ...prev,
        sizes: nextSizes,
      };
    });
  };

  const handleAddImage = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) {
      toast.error("Please provide an image URL.");
      return;
    }

    let added = false;
    setFormState((prev) => {
      if (prev.images.includes(trimmed)) {
        toast.error("This image is already added.");
        return prev;
      }
      const nextImages = [...prev.images, trimmed];
      if (nextImages.length === 1) {
        setPrimaryImageIndex(0);
      }
      added = true;
      return {
        ...prev,
        images: nextImages,
      };
    });
    if (added) {
      setNewImageUrl("");
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

  const handleSaveDraft = () => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formState));
    toast.success("Draft saved locally.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addProductMutation.mutate();
  };

  return (
    <section className="w-full px-6 py-12 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1a1a1a]">
              Add New Product
            </h1>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              Complete the product details below to publish a new item to your
              storefront.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              form="add-product-form"
              className={`rounded-full bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] ${
                isSubmitDisabled ? "cursor-not-allowed" : ""
              }`}
            >
              {addProductMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Add Product
            </Button>
          </div>
        </header>

        <form
          id="add-product-form"
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-2"
        >
          <div className="space-y-6">
            <div className="rounded-3xl p-6 shadow-sm">
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

            <div className="rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Pricing & Stock
              </h2>
              <p className="mt-1 text-sm text-[#4a4a4a]">
                Set pricing, inventory count, and promotions.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Base Price
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
                </label>
                <label className="block">
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
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Discount %
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formState.discount}
                    onChange={(event) =>
                      handleFieldChange("discount", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
                    placeholder="e.g. 10"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Discount Type
                  </span>
                  <input
                    type="text"
                    value={formState.discountType}
                    onChange={(event) =>
                      handleFieldChange("discountType", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
                    placeholder="e.g. Spring Sale"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Upload Images
              </h2>
              <p className="mt-1 text-sm text-[#4a4a4a]">
                Add a primary image and supporting gallery shots.
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
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm text-[#4a4a4a]">
                      <UploadCloud className="h-8 w-8 text-[#1a1a1a]" />
                      Add at least one image URL to preview it here.
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
                  </div>
                )}

                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(event) => setNewImageUrl(event.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-[#d8d5ce] bg-[#faf6ef] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] cursor-pointer"
                    onClick={handleAddImage}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-6 shadow-sm">
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
        </form>
      </div>
    </section>
  );
}
