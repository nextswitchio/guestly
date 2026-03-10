'use client';

import AffiliateRegistration from '@/components/marketing/AffiliateRegistration';
import Link from 'next/link';

export default function AffiliateRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <Link href="/" className="text-primary-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Become an Affiliate Partner</h1>
          <p className="text-gray-600 mb-8">
            Earn commission by promoting events on Guestly
          </p>
          
          <AffiliateRegistration />
        </div>
      </div>
    </div>
  );
}
