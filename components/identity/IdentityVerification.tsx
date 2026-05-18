'use client';

import { useState, useRef } from 'react';
import { Shield, Upload, CheckCircle, AlertCircle, Clock, X, FileText, Camera, Loader2 } from 'lucide-react';

export type IdentityDocType = 'passport' | 'drivers_license' | 'national_id' | 'voters_card' | 'residence_permit';
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';
export type UserRole = 'organiser' | 'vendor' | 'affiliate';

export interface IdentityData {
  id?: string;
  docType: IdentityDocType;
  docNumber: string;
  legalFirstName: string;
  legalLastName: string;
  dateOfBirth: string;
  nationality: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  selfieUrl?: string;
  status?: VerificationStatus;
  rejectionReason?: string;
  submittedAt?: string;
}

interface IdentityVerificationProps {
  userId: string;
  role: UserRole;
  existingData?: IdentityData | null;
  onSubmit: (data: IdentityData) => Promise<void>;
}

const docTypes: { value: IdentityDocType; label: string; requiresBack: boolean }[] = [
  { value: 'passport', label: 'International Passport', requiresBack: false },
  { value: 'drivers_license', label: "Driver's License", requiresBack: true },
  { value: 'national_id', label: 'National ID Card', requiresBack: true },
  { value: 'voters_card', label: "Voter's Card", requiresBack: true },
  { value: 'residence_permit', label: 'Residence Permit', requiresBack: true },
];

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string; message: string }> = {
  verified: {
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'text-green-700',
    bg: 'bg-green-100',
    label: 'Verified',
    message: 'Your identity has been verified successfully.',
  },
  pending: {
    icon: <Clock className="h-5 w-5" />,
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    label: 'Pending Review',
    message: 'Your documents are being reviewed. This usually takes 24-48 hours.',
  },
  under_review: {
    icon: <Clock className="h-5 w-5" />,
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    label: 'Under Review',
    message: 'Our team is currently reviewing your documents.',
  },
  rejected: {
    icon: <AlertCircle className="h-5 w-5" />,
    color: 'text-red-700',
    bg: 'bg-red-100',
    label: 'Rejected',
    message: 'Your documents were rejected. Please resubmit with correct information.',
  },
};

export default function IdentityVerification({ userId, role, existingData, onSubmit }: IdentityVerificationProps) {
  const [formData, setFormData] = useState<IdentityData>(
    existingData || {
      docType: 'national_id',
      docNumber: '',
      legalFirstName: '',
      legalLastName: '',
      dateOfBirth: '',
      nationality: 'Nigerian',
      documentFrontUrl: '',
      documentBackUrl: '',
      selfieUrl: '',
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [frontPreview, setFrontPreview] = useState<string | null>(existingData?.documentFrontUrl || null);
  const [backPreview, setBackPreview] = useState<string | null>(existingData?.documentBackUrl || null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(existingData?.selfieUrl || null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const isVerified = existingData?.status === 'verified';
  const isPending = existingData?.status === 'pending' || existingData?.status === 'under_review';
  const isRejected = existingData?.status === 'rejected';
  const showForm = !isVerified && !isPending;
  const requiresBack = docTypes.find(d => d.value === formData.docType)?.requiresBack ?? true;

  const handleFileChange = (file: File | undefined, field: 'documentFrontUrl' | 'documentBackUrl' | 'selfieUrl', setPreview: (v: string | null) => void) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, [field]: result }));
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.legalFirstName.trim() || !formData.legalLastName.trim()) {
      setError('Please enter your full legal name');
      return;
    }
    if (!formData.docNumber.trim()) {
      setError('Please enter your identity document number');
      return;
    }
    if (!formData.dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }
    if (!formData.documentFrontUrl) {
      setError('Please upload the front of your identity document');
      return;
    }
    if (requiresBack && !formData.documentBackUrl) {
      setError('Please upload the back of your identity document');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification');
    } finally {
      setSubmitting(false);
    }
  };

  if (isVerified) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Identity Verified</h3>
            <p className="text-sm text-green-700 mt-1">
              Your identity has been verified successfully. Document: {docTypes.find(d => d.value === existingData.docType)?.label}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-green-600">
              <span className="px-2 py-1 bg-green-100 rounded-lg">Name: {existingData.legalFirstName} {existingData.legalLastName}</span>
              <span className="px-2 py-1 bg-green-100 rounded-lg">ID: {existingData.docNumber}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    const status = statusConfig[existingData!.status!];
    return (
      <div className={`rounded-2xl border p-6 ${status.bg.replace('100', '200')} ${status.bg}`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${status.bg} ${status.color}`}>
            {status.icon}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${status.color}`}>{status.label}</h3>
            <p className={`text-sm mt-1 ${status.color}`}>{status.message}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs opacity-75">
              <span className="px-2 py-1 bg-white/50 rounded-lg">Document: {docTypes.find(d => d.value === existingData.docType)?.label}</span>
              <span className="px-2 py-1 bg-white/50 rounded-lg">Submitted: {new Date(existingData.submittedAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
          <Shield className="h-5 w-5 text-lime" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {isRejected ? 'Resubmit Identity Verification' : 'Identity Verification'}
          </h3>
          <p className="text-sm text-neutral-500">
            {isRejected
              ? 'Your previous submission was rejected. Please correct the information and resubmit.'
              : 'Upload a valid government-issued ID to verify your identity'}
          </p>
        </div>
      </div>

      {isRejected && existingData?.rejectionReason && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Reason for rejection:</p>
              <p className="text-sm text-red-700 mt-1">{existingData.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Document Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {docTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, docType: type.value }))}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  formData.docType === type.value
                    ? 'border-lime bg-lime/5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <p className="text-sm font-medium text-neutral-900">{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Legal Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Legal First Name</label>
            <input
              type="text"
              value={formData.legalFirstName}
              onChange={(e) => setFormData(prev => ({ ...prev, legalFirstName: e.target.value }))}
              placeholder="As shown on your ID"
              className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Legal Last Name</label>
            <input
              type="text"
              value={formData.legalLastName}
              onChange={(e) => setFormData(prev => ({ ...prev, legalLastName: e.target.value }))}
              placeholder="As shown on your ID"
              className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
            />
          </div>
        </div>

        {/* Document Number & DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Document Number</label>
            <input
              type="text"
              value={formData.docNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, docNumber: e.target.value }))}
              placeholder="ID number on your document"
              className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
            />
          </div>
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nationality</label>
          <select
            value={formData.nationality}
            onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
            className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
          >
            <option value="Nigerian">Nigerian</option>
            <option value="Ghanaian">Ghanaian</option>
            <option value="Kenyan">Kenyan</option>
            <option value="South African">South African</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Document Upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Document Photos</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Front */}
            <div>
              <p className="text-xs text-neutral-500 mb-2">Front of Document *</p>
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0], 'documentFrontUrl', setFrontPreview)}
                className="hidden"
              />
              {frontPreview ? (
                <div className="relative rounded-xl border border-neutral-200 overflow-hidden">
                  <img src={frontPreview} alt="Document front" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setFrontPreview(null); setFormData(prev => ({ ...prev, documentFrontUrl: '' })); }}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => frontInputRef.current?.click()}
                  className="w-full h-40 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 hover:border-lime hover:bg-lime/5 transition-colors"
                >
                  <FileText className="h-8 w-8 text-neutral-400" />
                  <span className="text-sm text-neutral-500">Upload Front</span>
                </button>
              )}
            </div>

            {/* Back */}
            {requiresBack && (
              <div>
                <p className="text-xs text-neutral-500 mb-2">Back of Document *</p>
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0], 'documentBackUrl', setBackPreview)}
                  className="hidden"
                />
                {backPreview ? (
                  <div className="relative rounded-xl border border-neutral-200 overflow-hidden">
                    <img src={backPreview} alt="Document back" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setBackPreview(null); setFormData(prev => ({ ...prev, documentBackUrl: '' })); }}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => backInputRef.current?.click()}
                    className="w-full h-40 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 hover:border-lime hover:bg-lime/5 transition-colors"
                  >
                    <FileText className="h-8 w-8 text-neutral-400" />
                    <span className="text-sm text-neutral-500">Upload Back</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selfie (optional) */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Selfie with ID <span className="text-neutral-400 font-normal">(optional but recommended)</span>
          </label>
          <input
            ref={selfieInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0], 'selfieUrl', setSelfiePreview)}
            className="hidden"
          />
          {selfiePreview ? (
            <div className="relative rounded-xl border border-neutral-200 overflow-hidden w-40">
              <img src={selfiePreview} alt="Selfie" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => { setSelfiePreview(null); setFormData(prev => ({ ...prev, selfieUrl: '' })); }}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => selfieInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Camera className="h-4 w-4" /> Take Selfie
            </button>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-lime px-6 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> {isRejected ? 'Resubmit' : 'Submit for Verification'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
