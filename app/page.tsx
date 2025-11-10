"use client";

import Image from "next/image";
import { Handbag, Smartphone, Sofa } from "lucide-react";
import { motion } from "framer-motion";

const reviewImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
];

const categories = [
  { icon: Smartphone, label: "Electronics" },
  { icon: Handbag, label: "Fashion" },
  { icon: Sofa, label: "Home" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-tight mb-6 max-w-4xl"
        >
          Shop. Smile. Repeat
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-lg md:text-xl text-[#4a4a4a] mb-8 max-w-2xl"
        >
          Our products are carefully curated, quality-assured & delivered fresh
          to your door daily.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-[#1a1a1a] text-white rounded-full text-lg font-medium hover:bg-[#2a2a2a] transition-colors mb-16 cursor-pointer"
        >
          Shop Now
        </motion.button>

        {/* Social Proof and Categories */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
          {/* Social Proof */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex -space-x-3">
              {reviewImages.map((src, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                >
                  <Image
                    src={src}
                    alt="Customer"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
            <motion.span
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="text-[#1a1a1a] font-medium underline"
            >
              10.8K+ reviews
            </motion.span>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-3">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full border border-zinc-200 overflow-hidden flex items-center justify-center cursor-pointer"
                  >
                    <Icon className="text-zinc-900" size={20} />
                  </motion.div>
                );
              })}
            </div>
            <motion.span
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="text-[#1a1a1a] font-medium text-sm md:text-base"
            >
              Electronics, Fashion, Home & More
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* Product Image Grid Section */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0"
          >
            {/* Left Image - Most rotation to the right */}
            <motion.div
              variants={imageVariants}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, zIndex: 40 }}
              className="relative w-full md:w-[450px] h-[300px] md:h-[350px] scale-[0.8] rounded-[30px] overflow-hidden shadow-lg z-10 transform md:rotate-12 transition-transform duration-300"
            >
              <Image
                src="/images/woman-browse.jpg"
                alt="Product"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Center Image - Moderate rotation to the right */}
            <motion.div
              variants={imageVariants}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, zIndex: 40 }}
              className="relative w-full md:w-[380px] h-[450px] md:h-[500px] rounded-[20px] overflow-hidden shadow-xl z-20 transform md:-rotate-8 transition-transform duration-300"
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
                alt="Product"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Right Image - Smallest rotation to the right */}
            <motion.div
              variants={imageVariants}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, zIndex: 40 }}
              className="relative w-full md:w-[400px] h-[300px] md:h-[350px] scale-[0.7] rounded-[30px] overflow-hidden shadow-lg z-30 transform md:-rotate-18 transition-transform duration-300 border-5 border-[#Ede8d0] ml-[-80px]"
            >
              <Image
                src="/images/woman-happy.jpg"
                alt="Product"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
