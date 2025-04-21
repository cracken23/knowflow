"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Company Name */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                priority
              />
              <span className="text-xl font-semibold text-gray-800">KnowFlow</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              Services
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
