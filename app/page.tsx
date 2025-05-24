'use client';
import React, { useState } from 'react';
import { Send, MessageSquare, Lock, Zap, BarChart2, Globe, CheckCircle, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [plans, setPlans] = useState('pro');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would send the email to your backend
    setSubmitted(true);
    setEmail('');
  };

  const handlePlansClick = (plans: string) => {
    setPlans(plans);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <MessageSquare className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">WhatsConnect</span>
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="block pl-3 pr-4 py-2 text-base font-medium bg-green-500 text-white hover:bg-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-10 pb-20 lg:pt-20 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Powerful WhatsApp</span>
                <span className="block text-green-500">Business Gateway</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500">
                Connect with your customers seamlessly through WhatsApp. Our API gateway makes integrating WhatsApp messaging into your business applications simple and effective.
              </p>
              <div className="mt-10">
                <form onSubmit={handleSubmit} className="sm:flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-5 py-3 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:max-w-xs"
                  />
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Get Started <Send className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </form>
                {submitted && (
                  <p className="mt-3 text-sm text-green-600">Thanks! We&apos;ll be in touch soon.</p>
                )}
              </div>
              <div className="mt-8 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="ml-2 text-sm text-gray-500">No credit card required</p>
                <CheckCircle className="ml-6 h-5 w-5 text-green-500" />
                <p className="ml-2 text-sm text-gray-500">Free 14-day trial</p>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden shadow-xl">
                <div className="px-4 py-8 sm:px-10 bg-gray-50 rounded-t-lg">
                  <div className="flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="ml-4 text-xl font-semibold text-gray-800">WhatsApp Integration Demo</span>
                  </div>
                </div>
                <div className="px-4 py-6 bg-white sm:p-6 border-t border-gray-200">
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="ml-3 bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-gray-900">Hello! I&apos;m interested in your product.</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-green-500 rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-white">Thanks for reaching out! How can we help you today?</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="ml-3 bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-gray-900">I&apos;d like to know about your pricing plans.</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-green-500 rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-white">We offer several plans starting at $29/month. Would you like me to send you our full pricing details?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our WhatsApp Gateway
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to connect with your customers through WhatsApp
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-green-100 rounded-lg p-3 inline-block">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Simple Integration</h3>
                <p className="mt-2 text-gray-500">
                  Easy to integrate with your existing applications through our RESTful API and comprehensive SDKs.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-green-100 rounded-lg p-3 inline-block">
                  <Lock className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Messaging</h3>
                <p className="mt-2 text-gray-500">
                  End-to-end encryption ensures your business communications remain private and secure.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-green-100 rounded-lg p-3 inline-block">
                  <BarChart2 className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Advanced Analytics</h3>
                <p className="mt-2 text-gray-500">
                  Track message delivery, read receipts, and customer engagement metrics in real-time.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-green-100 rounded-lg p-3 inline-block">
                  <Globe className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Global Reach</h3>
                <p className="mt-2 text-gray-500">
                  Connect with customers in over 180 countries with multilingual support and local compliance.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-green-100 rounded-lg p-3 inline-block">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Media Support</h3>
                <p className="mt-2 text-gray-500">
                  Send and receive images, videos, documents, and location data through our API.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-green-100 rounded-lg p-3 inline-block">
                  <Send className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Automated Messaging</h3>
                <p className="mt-2 text-gray-500">
                  Create automated workflows and chatbots to handle common customer inquiries efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Choose the plan that&apos;s right for your business
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {/* Starter Plan */}
            <div className={`rounded-lg shadow-lg overflow-hidden ${plans === 'starter' ? 'border-2 border-green-500' : ''}`} onClick={() => handlePlansClick("starter")}>
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Starter</h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">$29</span>
                    <span className="ml-1 text-xl font-medium">/month</span>
                  </div>
                  <p className="mt-5 text-lg text-gray-500">
                    Perfect for small businesses just getting started with WhatsApp.
                  </p>
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">1,000 messages/month</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Basic analytics</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">1 WhatsApp number</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Email support</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <a
                    href="#contact"
                    className="block w-full text-center rounded-md border border-transparent bg-green-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-green-600"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className={`rounded-lg shadow-lg overflow-hidden ${plans == 'pro' ? 'border-2 border-green-500' : ''}`} onClick={() => handlePlansClick("pro")}>
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Pro</h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">$89</span>
                    <span className="ml-1 text-xl font-medium">/month</span>
                  </div>
                  <p className="mt-5 text-lg text-gray-500">
                    For growing businesses with increasing messaging needs.
                  </p>
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">10,000 messages/month</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Advanced analytics</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">3 WhatsApp numbers</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Priority support</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Chatbot builder</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <a
                    href="#contact"
                    className="block w-full text-center rounded-md border border-transparent bg-green-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-green-600"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className={`rounded-lg shadow-lg overflow-hidden ${plans == 'enterprise' ? 'border-2 border-green-500' : ''}`} onClick={() => handlePlansClick('enterprise')}>
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Enterprise</h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">Custom</span>
                  </div>
                  <p className="mt-5 text-lg text-gray-500">
                    For large organizations with custom requirements.
                  </p>
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Unlimited messages</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Custom analytics dashboard</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Unlimited WhatsApp numbers</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">24/7 dedicated support</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Advanced integrations</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-gray-700">Custom development</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <a
                    href="#contact"
                    className="block w-full text-center rounded-md border border-transparent bg-green-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-green-600"
                  >
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to know about our WhatsApp Gateway
            </p>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg divide-y divide-gray-200">
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900">What is a WhatsApp Business API Gateway?</h3>
              <p className="mt-2 text-gray-600">
                A WhatsApp Business API Gateway is a platform that allows businesses to integrate WhatsApp messaging capabilities into their systems, enabling automated and personalized communication with customers through WhatsApp.
              </p>
            </div>
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900">Do I need technical knowledge to use your service?</h3>
              <p className="mt-2 text-gray-600">
                While our API is designed for developers, we provide comprehensive documentation, SDKs, and no-code tools that make it accessible even for non-technical users. Our support team is also available to help with integration.
              </p>
            </div>
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900">Is WhatsApp Business API officially approved by WhatsApp?</h3>
              <p className="mt-2 text-gray-600">
                Yes, our service is an official WhatsApp Business Solution Provider. We comply with all WhatsApp policies and guidelines to ensure a legitimate and reliable service.
              </p>
            </div>
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900">Can I send bulk messages with your service?</h3>
              <p className="mt-2 text-gray-600">
                Yes, our platform supports bulk messaging while adhering to WhatsApp&apos;s policies. However, messages must comply with WhatsApp&apos;s guidelines regarding spam and user consent.
              </p>
            </div>
            <div className="px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900">How secure is the WhatsApp Business API?</h3>
              <p className="mt-2 text-gray-600">
                WhatsApp provides end-to-end encryption for all messages. Additionally, our platform implements industry-standard security measures to protect your data and communications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Join thousands of businesses already using our WhatsApp Gateway
            </p>
          </div>

          <div className="mt-12 max-w-lg mx-auto">
            <form className="grid grid-cols-1 gap-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Contact Sales
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by Businesses Worldwide
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              See what our customers say about our WhatsApp Gateway
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600">Marketing Director, TechCorp</p>
                </div>
              </div>
              <div className="mt-4 text-gray-600">
                &quot;WhatsConnect has transformed our customer engagement strategy. The API is incredibly easy to integrate, and we&apos;ve seen a 40% increase in response rates compared to email.&quot;
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Michael Rodriguez</h4>
                  <p className="text-gray-600">CTO, GrowthX</p>
                </div>
              </div>
              <div className="mt-4 text-gray-600">
                &quot;As a developer, I appreciate how well-documented the API is. We were able to integrate WhatsConnect into our systems in just a few days. The support team was exceptional when we had questions.&quot;
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Jennifer Chen</h4>
                  <p className="text-gray-600">Customer Success, RetailPlus</p>
                </div>
              </div>
              <div className="mt-4 text-gray-600">
                &quot;Our customer satisfaction scores have increased dramatically since implementing WhatsConnect. Being able to communicate with customers on their preferred platform has made all the difference.&quot;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Seamless Integration
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Integrate with your favorite tools and platforms
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="col-span-1 flex justify-center items-center py-8 px-8 bg-gray-50">
                  <div className="h-12 w-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to boost your customer engagement?</span>
            <span className="block text-green-200">Start your 14-day free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
              >
                Get Started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-400" />
                <span className="ml-2 text-xl font-bold text-white">WhatsConnect</span>
              </div>
              <p className="mt-4 text-gray-300">
                The most powerful WhatsApp Business API gateway for your business needs.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#features" className="text-base text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-base text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2025 WhatsConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
