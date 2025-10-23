"use client";

import { Globe, Twitter, Github, Linkedin, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700  mt-10 md:shadow-stone-500">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-sm font-semibold mb-3">ABOUT</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact us
              </a>
            </li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div>
          <h3 className="text-sm font-semibold mb-3">RESOURCES</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                How 3F works?
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Help & support
              </a>
            </li>
          </ul>
        </div>

        {/* CONTRIBUTING */}
        <div>
          <h3 className="text-sm font-semibold mb-3">CONTRIBUTING</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Brand & Organizations
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Pricing
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 py-4 text-sm text-gray-500">
          {/* Language Selector */}
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4" />
            <span>English (100%)</span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">
              Trust & safety
            </a>
            <a href="#" className="hover:underline">
              Terms of use
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-purple-600">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-purple-600">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-purple-600">
              <MessageCircle className="w-4 h-4" /> {/* Discord-style icon */}
            </a>
            <a href="#" className="hover:text-purple-600">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-purple-600">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
