"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import { useUserContext } from '@/app/context/Userinfo';
import UserIcon from '@/components/UserIcon';
import { motion } from "framer-motion";
import img from '../../public/logo.png';

function Navbar() {
  const { data: session } = useSession();
  const { contextisLoggedIn, contextsetIsLoggedIn, contextsetName, contextsetEmail } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (session) {
      contextsetIsLoggedIn(true);
      contextsetEmail(session.user.email);
      contextsetName(session.user.name);
    }
  }, [session]);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/Gallery" },
    { label: "About", href: "/About" },
    { label: "Lobby", href: "/Lobby" },
  ];

  const Logout = () => {
    localStorage.setItem('authToken', "-");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="glass mx-4 mt-4 rounded-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-10 w-10 overflow-hidden"
              >
                <img src={img.src} alt="Logo" className="h-full w-full object-cover" />
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-electric-blue hover:text-neon-cyan transition-colors"
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    className="relative group"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-neon-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {session || contextisLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="neon-btn text-sm"
                    onClick={() => signOut() && Logout()}
                  >
                    Logout
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="hover-glow rounded-full"
                  >
                    <UserIcon />
                  </motion.div>
                </div>
              ) : (
                <Link href="/Login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="neon-btn text-sm"
                  >
                    Login
                  </motion.button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="glass p-2 rounded-lg hover:bg-deep-indigo/20"
                >
                  <svg
                    className="h-6 w-6 text-electric-blue"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4"
            >
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-electric-blue hover:text-neon-cyan px-4 py-2 rounded-lg hover:bg-deep-indigo/20 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
