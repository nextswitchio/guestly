'use client';
import { BookOpen, CheckCircle, MessageCircle, Phone, Upload } from 'lucide-react';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/ToastProvider';

export default function SupportPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // In a real app, this would send to a support API
    setTimeout(() => {
      setSubmitted(true);
      setSending(false);
      addToast('Message sent! We\'ll get back to you within 24 hours.', { type: 'success' });
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }, 1000);
  };

  const faqs = [
    {
      question: 'How do I purchase tickets?',
      answer: 'Browse events, select your desired event, choose ticket types, and proceed to checkout. We accept multiple payment methods including cards, mobile money, and crypto.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'Refund policies vary by event. Check the event details page for specific refund information. Generally, refunds are available up to 48 hours before the event.',
    },
    {
      question: 'How do I access virtual events?',
      answer: 'After purchasing a ticket, you\'ll receive access details via email. On the event day, visit the event page and click "Virtual Lobby" to join.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, mobile money (M-Pesa, MTN Mobile Money), bank transfers, and cryptocurrency payments.',
    },
    {
      question: 'How do I become an organizer?',
      answer: 'Sign up for an organizer account, complete your profile, and start creating events. Our team will review and approve your account within 24 hours.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Get support for your Guestly experience
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">BookOpen</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse our comprehensive guides and tutorials
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl"><MessageCircle className="h-4 w-4 inline-block" /></span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chat with our support team in real-time
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl"><Phone className="h-4 w-4 inline-block" /></span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Call Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              +234 800 123 4567 (Mon-Fri, 9am-6pm WAT)
            </p>
          </Card>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          
          {submitted ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block"><CheckCircle className="h-4 w-4 inline-block" /></span>
              <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <Input
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="What do you need help with?"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue or question in detail..."
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[150px]"
                />
              </div>

              <Button type="submit" loading={sending} className="w-full md:w-auto">
                <span className="mr-2"><Upload className="h-4 w-4 inline-block" /></span>
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
