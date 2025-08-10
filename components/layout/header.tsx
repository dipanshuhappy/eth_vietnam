"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X, Trophy } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] w-full h-16">
      <div className="container mx-auto px-4 sm:px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image 
              src="/unn_finance.webp" 
              width={40} 
              height={40} 
              alt="Trust Protocol"
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <Link 
              href="/" 
              className="text-xl sm:text-2xl font-serif font-bold tracking-tighter text-primary"
            >
              TRUST
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {/* <Link
              href="/leaderboard"
              className="text-sm xl:text-base font-medium text-primary-foreground hover:underline hover:text-primary transition-colors flex items-center gap-1"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link> */}
            {[
              { href: "https://drive.google.com/file/d/1M1AUNLmCvXPADI_5Ld7QKYN2WImuDJWJ/view?usp=sharing", label: "Whitepaper" },
              { href: "https://t.me/+e2_TcJOoNO80MzA9", label: "Telegram" },
              { href: "https://x.com/_trustprotocol", label: "Twitter" },
              { href: "https://github.com/the-trustprotocol", label: "Github" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm xl:text-base font-medium text-primary-foreground hover:underline hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ConnectButton 
                accountStatus={{ 
                  smallScreen: 'avatar',
                  largeScreen: 'address' 
                }}
                chainStatus="icon"
              />
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu} 
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`
        fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-300
        ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `} onClick={toggleMenu}>
        <nav className={`
          absolute right-0 top-16 w-full max-w-xs h-[calc(100vh-4rem)]
          bg-gradient-to-b from-[#cdffd8] to-[#94b9ff] backdrop-blur-xl
          transform transition-transform duration-300 ease-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col p-4 gap-2
          border-l border-white/20 shadow-xl
        `}>
          <div className="flex flex-col gap-2">
            {/* <Link
              href="/leaderboard"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-primary font-medium"
              onClick={toggleMenu}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-base">Leaderboard</span>
            </Link> */}
            {[
              { href: "https://www.overleaf.com/read/zyhmdxynwxgt#a050e6", icon: "📄", label: "Whitepaper" },
              { href: "https://t.me/+e2_TcJOoNO80MzA9", icon: "💬", label: "Telegram" },
              { href: "https://x.com/_trustprotocol", icon: "🐦", label: "Twitter" },
              { href: "https://github.com/the-trustprotocol", icon: "📚", label: "Github" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-primary font-medium"
                onClick={toggleMenu}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-base">{item.label}</span>
              </a>
            ))}
          </div>
          
          <div className="mt-4 border-t border-white/20 pt-4">
            <div className="sm:hidden">
              <ConnectButton 
                accountStatus="avatar"
                chainStatus="icon"
                showBalance={false}
              />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}