"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click on the Sign Up button on the top right of the homepage. Fill out the required information, verify your email, and you’re ready to start exploring!",
    },
    {
      question: "I forgot my password. What should I do?",
      answer:
        "Go to the login page and click on 'Forgot password?'. Enter your email address, and we’ll send you a link to reset your password securely.",
    },
    {
      question: "How can I edit my profile?",
      answer:
        "Once you’re logged in, navigate to your profile page and click the edit icon. You can update your information, add images, and customize your bio anytime.",
    },
    {
      question: "Who can see my profile?",
      answer:
        "Your profile visibility depends on your privacy settings. By default, only registered members can view your profile, but you can change this in your account preferences.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4B2EFF] to-[#7A5CFA] text-white py-20 rounded-b-[40px] shadow-md text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
        <p className="text-lg md:text-xl font-light opacity-90">
          Find answers, get assistance, or reach out to our team.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-md px-8 md:px-16 py-12 mt-16 mb-24">
        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-[#270F94] text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex justify-between items-center w-full text-left"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="text-[#644FC1]" />
                  ) : (
                    <ChevronDown className="text-[#644FC1]" />
                  )}
                </button>

                {openIndex === index && (
                  <p className="mt-4 text-gray-600 text-sm md:text-base">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact / Support Section */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#270F94] mb-6">
            Still Need Help?
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Can’t find what you’re looking for? Our support team is here to
            assist you. Reach out through any of the following methods and we’ll
            get back to you as soon as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <div className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition w-64">
              <Mail className="w-8 h-8 text-[#644FC1] mb-3" />
              <h3 className="text-lg font-semibold text-[#270F94] mb-1">
                Email Support
              </h3>
              <p className="text-gray-500 text-sm">support@yourapp.com</p>
            </div>

            <div className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition w-64">
              <MessageSquare className="w-8 h-8 text-[#644FC1] mb-3" />
              <h3 className="text-lg font-semibold text-[#270F94] mb-1">
                Live Chat
              </h3>
              <p className="text-gray-500 text-sm">
                Chat with us 
              </p>
            </div>

            <div className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition w-64">
              <Phone className="w-8 h-8 text-[#644FC1] mb-3" />
              <h3 className="text-lg font-semibold text-[#270F94] mb-1">
                Call Us
              </h3>
              <p className="text-gray-500 text-sm">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
