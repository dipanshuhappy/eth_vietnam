import { Github, Twitter, Mail } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] border-t border-primary/20 text-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-primary-800">
              Trust Protocol
            </h3>
            <p className="text-sm sm:text-base text-primary-700 max-w-xs">
              Decentralized reputation layer for Web3
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-lg font-semibold text-primary-800">Protocol</h4>
            <nav className="flex flex-col space-y-1 sm:space-y-2">
              <Link 
                href="#" 
                className="text-sm sm:text-base text-primary-700 hover:text-primary-900 transition-colors hover:underline"
              >
                Documentation
              </Link>
              <Link 
                href="#" 
                className="text-sm sm:text-base text-primary-700 hover:text-primary-900 transition-colors hover:underline"
              >
                Governance
              </Link>
              <Link 
                href="#" 
                className="text-sm sm:text-base text-primary-700 hover:text-primary-900 transition-colors hover:underline"
              >
                Blog
              </Link>
            </nav>
          </div>

          {/* Community */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-lg font-semibold text-primary-800">Community</h4>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <motion.a 
                href="https://github.com/the-trustprotocol" 
                target="_blank"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-white/20 rounded-full hover:bg-primary-100 transition-all border border-primary-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6 text-primary-800" />
              </motion.a>
              <motion.a 
                href="https://x.com/_trustprotocol" 
                target="_blank"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-white/20 rounded-full hover:bg-primary-100 transition-all border border-primary-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-primary-800" />
              </motion.a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-lg font-semibold text-primary-800">Stay Updated</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/30 border border-primary-300 rounded-lg px-4 py-2 text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-800 placeholder-primary-600"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-300 my-6 sm:my-8" />

        {/* Copyright */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 text-sm text-primary-700">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} Trust Protocol. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <Link 
              href="/privacy" 
              className="hover:text-primary-900 transition-colors hover:underline text-sm sm:text-base"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-primary-900 transition-colors hover:underline text-sm sm:text-base"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}