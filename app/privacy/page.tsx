import { Card } from '@/components/ui/Card';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly: name, email, phone number, payment information, and profile details. We also automatically collect usage data including IP address, browser type, device information, and pages visited. For location-based features, we may collect geolocation data with your consent.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use your information to: process transactions and ticket purchases; send event notifications and updates; personalise your experience; improve our platform; comply with legal obligations; detect and prevent fraud; and communicate with you about our services.',
    },
    {
      title: 'Data Sharing & Disclosure',
      content: 'We share information with: event organisers (attendee names and emails for check-in); payment processors (necessary for transaction processing); service providers (analytics, hosting, customer support). We do not sell your personal information to third parties. We may disclose information if required by law.',
    },
    {
      title: 'Data Security',
      content: 'We implement industry-standard security measures including encryption in transit and at rest, regular security audits, and access controls. However, no method of electronic storage is 100% secure. We encourage users to enable two-factor authentication and use strong passwords.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to: access your personal data; correct inaccurate data; request deletion of your data; restrict or object to processing; data portability; withdraw consent at any time. To exercise these rights, visit your account settings or contact our support team.',
    },
    {
      title: 'Cookies & Tracking',
      content: 'We use cookies and similar technologies for: essential platform functionality; analytics and performance measurement; personalisation of content; marketing and advertising. You can manage cookie preferences through your browser settings. Disabling cookies may affect platform functionality.',
    },
    {
      title: 'Data Retention',
      content: 'We retain your data for as long as your account is active or as needed to provide services. After account deletion, we retain certain data for legal compliance, fraud prevention, and record-keeping purposes for up to 90 days, after which it is anonymised or deleted.',
    },
    {
      title: 'Third-Party Services',
      content: 'Our platform integrates with third-party services for payments, maps, and analytics. These services have their own privacy policies governing data handling. We encourage you to review their policies. We are not responsible for the practices of third-party services.',
    },
    {
      title: 'International Data Transfers',
      content: 'Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place through standard contractual clauses and data processing agreements to protect your information.',
    },
    {
      title: 'Changes to This Policy',
      content: 'We may update this privacy policy from time to time. Material changes will be notified via email or platform notification. Continued use of Guestly after changes constitutes acceptance of the updated policy.',
    },
    {
      title: 'Contact Us',
      content: 'For privacy-related inquiries, contact our Data Protection Officer at privacy@guestly.com. You also have the right to lodge a complaint with your local data protection authority.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto">
            How we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-slate-400 mt-4">Last updated: May 2026</p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h2>
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
