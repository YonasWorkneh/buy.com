"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@buy.com",
      link: "mailto:support@buy.com",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Shopping Street, City, State 12345",
      link: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-6PM EST",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Underlines */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="flex items-center justify-center mb-12 md:mb-16 gap-3 md:gap-4"
          >
            {/* Left Underline */}
            <motion.div
              variants={underlineVariants}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-[2px] bg-[#1a1a1a] flex-1 max-w-[60px] md:max-w-[100px] origin-left"
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] px-4 md:px-8 text-center whitespace-nowrap"
            >
              Contact Us
            </motion.h1>
            {/* Right Underline */}
            <motion.div
              variants={underlineVariants}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-[2px] bg-[#1a1a1a] flex-1 max-w-[60px] md:max-w-[100px] origin-right"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-lg md:text-xl text-[#4a4a4a] mb-12 max-w-2xl mx-auto"
          >
            Have a question or need assistance? We&apos;d love to hear from you.
            Send us a message and we&apos;ll respond as soon as possible.
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
              className="space-y-6"
            >
              <motion.h2
                variants={itemVariants}
                className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8"
              >
                Get in Touch
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-[#4a4a4a] mb-8"
              >
                We&apos;re here to help! Reach out to us through any of the
                following channels, or fill out the form and we&apos;ll get back
                to you.
              </motion.p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.a
                      key={index}
                      href={info.link}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors group"
                    >
                      <div className="p-3 rounded-full bg-[#1a1a1a] text-white group-hover:bg-[#2a2a2a] transition-colors shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a] mb-1">
                          {info.title}
                        </h3>
                        <p className="text-[#4a4a4a]">{info.content}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
              <motion.h2
                variants={itemVariants}
                className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8"
              >
                Send us a Message
              </motion.h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#1a1a1a] mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#1a1a1a]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#1a1a1a] mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#1a1a1a]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[#1a1a1a] mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#1a1a1a]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#1a1a1a] mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-[#1a1a1a]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 bg-[#1a1a1a] text-white rounded-full text-lg font-medium hover:bg-[#2a2a2a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

