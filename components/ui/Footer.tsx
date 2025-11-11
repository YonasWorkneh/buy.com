"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: index * 0.08,
    },
  }),
};

const socialVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (index: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      delay: index * 0.08,
    },
  }),
};

export default function Footer() {
  const quickLinks = [
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ];

  const supportLinks = [
    { label: "FAQ", href: "#" },
    { label: "Shipping", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  const socialIcons = [Facebook, Instagram, Twitter, Mail];

  return (
    <footer className="w-full bg-[#1a1a1a] text-white mt-auto">
      <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16 space-y-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {/* Brand Section */}
          <motion.div
            variants={blockVariants}
            className="col-span-1 md:col-span-2 space-y-6"
          >
            <Link href="/" className="text-2xl font-bold mb-4 inline-block">
              <span className="font-bold">BUY</span>
              <span className="font-normal">.com</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Our products are carefully curated, quality-assured & delivered
              fresh to your door daily.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((Icon, index) => (
                <motion.a
                  key={index}
                  custom={index}
                  variants={socialVariants}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={Icon.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={blockVariants} className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  variants={listItemVariants}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={blockVariants} className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  variants={listItemVariants}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={blockVariants}
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BUY.com. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            {[
              { label: "Terms of Service", href: "#" },
              { label: "Privacy Policy", href: "#" },
            ].map((link, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={listItemVariants}
              >
                <Link
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
