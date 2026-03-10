'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function AffiliateHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Join the Guestly Affiliate Program
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Earn commissions by promoting Africa's leading event platform. 
          Share events, drive ticket sales, and get rewarded for every successful referral.
        </p>
        <div className="flex gap-4 justify-center">
          <Button href="/affiliate/register" size="lg">
            <Icon name="rocket" className="w-5 h-5 mr-2" />
            Become an Affiliate
          </Button>
          <Button href="/affiliate/login" variant="outline" size="lg">
            Affiliate Login
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Why Join Our Affiliate Program?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="currency-dollar" className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Competitive Commissions</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Earn up to 15% commission on every ticket sale from your referrals
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="chart" className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your performance with detailed analytics and insights
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="wallet" className="w-8 h-8 text-warning-600 dark:text-warning-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fast Payouts</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Request payouts anytime with a minimum balance of $50
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Register for free and get approved within 24 hours
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Get Your Links</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate unique affiliate links for any event
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Promote Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share links on social media, blogs, or your website
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Earn Commissions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get paid for every ticket sold through your links
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              $500K+
            </div>
            <p className="text-gray-600 dark:text-gray-400">Paid to Affiliates</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              1,000+
            </div>
            <p className="text-gray-600 dark:text-gray-400">Active Affiliates</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              15%
            </div>
            <p className="text-gray-600 dark:text-gray-400">Average Commission</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of affiliates promoting the best events across Africa
          </p>
          <Button href="/affiliate/register" variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>
          Already an affiliate?{' '}
          <Link href="/affiliate/login" className="text-primary-600 dark:text-primary-400 hover:underline">
            Login here
          </Link>
        </p>
      </footer>
    </div>
  );
}
