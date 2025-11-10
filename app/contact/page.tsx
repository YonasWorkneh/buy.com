"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

type TextFieldKey = "name" | "phone" | "email" | "subject";

const formFields: Array<{
  id: TextFieldKey;
  label: string;
  type: string;
  placeholder: string;
}> = [
  {
    id: "name",
    label: "Name *",
    type: "text",
    placeholder: "Your full name",
  },
  {
    id: "phone",
    label: "Phone number",
    type: "tel",
    placeholder: "+1 (555) 123-4567",
  },
  {
    id: "email",
    label: "Email *",
    type: "email",
    placeholder: "you@buy.com",
  },
  {
    id: "subject",
    label: "Subject *",
    type: "text",
    placeholder: "How can we help?",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      alert("Please acknowledge our policies before submitting.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Contact form submitted:", formData);
    setIsSubmitting(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
      agree: false,
    });
    alert("Thanks for reaching out. Our concierge team will respond shortly.");
  };

  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl py-16 lg:grid-cols-2 lg:px-0">
        {/* Left column */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-[#f5f1e8] px-10 py-16 text-[#1a1a1a]"
        >
          <div className="space-y-12">
            <section>
              <p className="text-xs uppercase tracking-[0.4em] text-[#8c7a57]">
                Address
              </p>
              <div className="mt-4 space-y-1 text-lg font-medium">
                <p>BUY.com Studio</p>
                <p>90 Commerce Way</p>
                <p>Brooklyn, NY 11201</p>
              </div>
              <Link
                href="https://maps.google.com?q=90+Commerce+Way+Brooklyn+NY+11201"
                target="_blank"
                className="mt-4 inline-block text-xs uppercase tracking-[0.3em] text-[#8c7a57]"
              >
                Google Maps
              </Link>
            </section>

            <section className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#8c7a57]">
                  Contacts
                </p>
                <div className="mt-4 space-y-2 text-lg font-medium">
                  <div>
                    <a href="tel:+16465558890" className="hover:underline">
                      +1 (646) 555-8890
                    </a>
                    <p className="text-xs uppercase tracking-wide text-[#4a4a4a]">
                      Client concierge
                    </p>
                  </div>
                  <div>
                    <a href="tel:+16465558891" className="hover:underline">
                      +1 (646) 555-8891
                    </a>
                    <p className="text-xs uppercase tracking-wide text-[#4a4a4a]">
                      Priority support
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#8c7a57]">
                  Email
                </p>
                <div className="mt-4 space-y-1 text-lg font-medium">
                  <a href="mailto:hello@buy.com" className="hover:underline">
                    hello@buy.com
                  </a>
                  <p className="text-xs uppercase tracking-wide text-[#4a4a4a]">
                    We reply within one business day
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.aside>

        {/* Right column */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white px-10 py-16"
        >
          <div className="max-w-xl">
            <h1 className="text-xl font-semibold text-[#1a1a1a] uppercase tracking-[0.4em] ">
              Contact Us
            </h1>
            <p className="mt-4 text-sm text-[#4a4a4a] leading-relaxed">
              Tell us how we can support your shopping experience. Complete the
              form and a member of our concierge team will reach out shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={field.id}
                  className="text-xs uppercase tracking-[0.2em] text-[#4a4a4a]"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required={field.label.includes("*")}
                  placeholder={field.placeholder}
                  className="w-full border-b border-[#d8d5ce] pb-3 text-sm text-[#1a1a1a] focus:border-[#8c7a57] focus:outline-none"
                />
              </div>
            ))}

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-xs uppercase tracking-[0.2em] text-[#4a4a4a]"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Share the details of your request…"
                className="w-full border-b border-[#d8d5ce] pb-3 text-sm text-[#1a1a1a] focus:border-[#8c7a57] focus:outline-none resize-none"
              />
            </div>

            <label className="flex items-start gap-3 text-xs text-[#4a4a4a]">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 h-4 w-4 border border-[#d8d5ce] text-[#1a1a1a] focus:ring-[#8c7a57]"
              />
              <span>
                I have reviewed the{" "}
                <Link href="#" className="underline">
                  Terms & Policies
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border cursor-pointer border-[#1a1a1a] bg-[#1a1a1a] py-4 text-sm uppercase tracking-[0.4em] text-white transition hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Submit Message"}
            </button>
          </form>
        </motion.section>
      </div>
    </section>
  );
}
