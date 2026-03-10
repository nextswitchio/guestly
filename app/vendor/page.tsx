'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function VendorHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Grow Your Business with Guestly
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Connect with event organizers across Africa. Offer your services, 
          manage bookings, and grow your vendor business on Africa's leading event platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Button href="/vendor/register" size="lg">
            <Icon name="rocket" className="w-5 h-5 mr-2" />
            Become a Vendor
          </Button>
          <Button href="/vendor/login" variant="outline" size="lg">
            Vendor Login
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Why Partner with Guestly?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-navy-100 dark:bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="users" className="w-8 h-8 text-navy-600 dark:text-navy-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Access to Organizers</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with thousands of event organizers looking for quality vendors
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="calendar" className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Manage Bookings</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Streamline your booking process with our vendor management tools
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="chart" className="w-8 h-8 text-warning-600 dark:text-warning-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Grow Your Revenue</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track performance and grow your business with detailed analytics
            </p>
          </Card>
        </div>
      </section>

      {/* Vendor Categories */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Vendor Categories
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: 'camera', name: 'Photography & Videography' },
              { icon: 'music', name: 'Entertainment & DJs' },
              { icon: 'palette', name: 'Decoration & Design' },
              { icon: 'package', name: 'Catering & Food' },
              { icon: 'location', name: 'Venues & Spaces' },
              { icon: 'megaphone', name: 'Marketing & PR' },
              { icon: 'users', name: 'Event Staff' },
              { icon: 'sparkles', name: 'Other Services' },
            ].map((category, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
                <Icon name={category.icon as any} className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                <p className="text-sm font-medium">{category.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-navy-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2">Create Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign up and create your vendor profile with services and pricing
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-navy-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2">Get Discovered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organizers find you through our vendor marketplace
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-navy-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2">Receive Bookings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Accept booking requests and manage your calendar
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-navy-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              4
            </div>
            <h3 className="font-semibold mb-2">Deliver & Earn</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provide your services and receive secure payments
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-navy-600 dark:bg-navy-700 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <p className="text-navy-100">Events Serviced</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-navy-100">Active Vendors</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <p className="text-navy-100">Vendor Earnings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Flexible Subscription Plans
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose a plan that fits your business needs
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-2">Basic</h3>
            <div className="text-3xl font-bold mb-4">$29<span className="text-lg text-gray-600 dark:text-gray-400">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Profile listing</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Up to 10 bookings/month</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Basic analytics</span>
              </li>
            </ul>
            <Button href="/vendor/register" variant="outline" className="w-full">
              Get Started
            </Button>
          </Card>

          <Card className="p-6 border-2 border-primary-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Popular
            </div>
            <h3 className="text-xl font-bold mb-2">Professional</h3>
            <div className="text-3xl font-bold mb-4">$79<span className="text-lg text-gray-600 dark:text-gray-400">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Featured listing</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Unlimited bookings</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Advanced analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            <Button href="/vendor/register" className="w-full">
              Get Started
            </Button>
          </Card>

          <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <div className="text-3xl font-bold mb-4">Custom</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">API access</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="w-5 h-5 text-success-500 mt-0.5" />
                <span className="text-sm">Custom integrations</span>
              </li>
            </ul>
            <Button href="/vendor/register" variant="outline" className="w-full">
              Contact Sales
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy-600 to-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of vendors serving events across Lagos, Abuja, Accra, and Nairobi
          </p>
          <Button href="/vendor/register" size="lg" className="bg-white text-navy-600 hover:bg-gray-100">
            Start Your Vendor Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>
          Already a vendor?{' '}
          <Link href="/vendor/login" className="text-primary-600 dark:text-primary-400 hover:underline">
            Login here
          </Link>
        </p>
      </footer>
    </div>
  );
}
