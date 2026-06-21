import { Card } from '@/components/ui/Card';

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing or using Guestly, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform. We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.',
    },
    {
      title: 'User Accounts',
      content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use. Accounts are granted to individuals only; sharing credentials is prohibited.',
    },
    {
      title: 'Event Listings & Ticketing',
      content: 'Organisers are responsible for the accuracy of event information listed on Guestly. We reserve the right to remove listings that violate our policies. Ticket purchases are final unless the event is cancelled. Refund policies are set by organisers and displayed at checkout.',
    },
    {
      title: 'Payments & Fees',
      content: 'All payments are processed securely through our platform. Guestly charges a service fee on ticket sales and vendor transactions. Fees are clearly displayed before purchase. We use third-party payment processors and are not liable for their errors or outages.',
    },
    {
      title: 'Prohibited Activities',
      content: 'Users may not: (a) use the platform for fraudulent purposes; (b) harass, abuse, or harm others; (c) distribute malware or engage in hacking; (d) violate any applicable laws; (e) resell tickets at prices exceeding face value unless authorized; (f) impersonate another person or entity.',
    },
    {
      title: 'Intellectual Property',
      content: 'The Guestly platform, including its design, logo, and software, is protected by copyright and trademark laws. Content posted by users remains their property, but by posting, you grant Guestly a license to display it on the platform.',
    },
    {
      title: 'Limitation of Liability',
      content: 'Guestly is provided "as is" without warranties of any kind. We are not liable for damages arising from: event cancellations, user misconduct, service interruptions, or third-party actions. Our total liability is limited to the fees paid in the transaction giving rise to the claim.',
    },
    {
      title: 'Termination',
      content: 'We may suspend or terminate accounts that violate these terms or engage in harmful behavior. Terminated users lose access to their account and any pending transactions may be cancelled. You may delete your account at any time through settings.',
    },
    {
      title: 'Governing Law',
      content: 'These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved through binding arbitration in Lagos, Nigeria. Users from other jurisdictions agree to submit to the personal jurisdiction of Nigerian courts.',
    },
    {
      title: 'Contact',
      content: 'For questions about these terms, contact our legal team at legal@guestly.com or visit our Support page for assistance.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto">
            These terms govern your use of the Guestly platform. Please read them carefully.
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
