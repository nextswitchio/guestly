"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatDate, formatCurrency } from '@/lib/utils';

// Types for Verification
type VerificationStatus = "pending" | "submitted" | "under_review" | "approved" | "rejected" | "expired";
type VerificationType = "identity" | "business" | "premium";
type DocumentType = "passport" | "driver_license" | "national_id" | "business_registration" | "utility_bill";

interface VerificationRequest {
  id: string;
  user_id: string;
  verification_type: VerificationType;
  status: VerificationStatus;
  documents: VerificationDocument[];
  fee: number;
  fee_paid: boolean;
  payment_reference: string | null;
  reason: string | null;
  reviewer_id: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface VerificationDocument {
  id: string;
  verification_request_id: string;
  document_type: DocumentType;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  status: "pending" | "verified" | "rejected";
  rejection_reason: string | null;
  verified_at: string | null;
  created_at: string;
}

interface VerificationRequirement {
  type: VerificationType;
  name: string;
  description: string;
  required_documents: DocumentType[];
  min_required?: number; // Minimum number of documents required (default: all)
  fee: number;
  validity_period_days: number;
  benefits: string[];
}

interface PaymentOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const VERIFICATION_TYPES: VerificationRequirement[] = [
  {
    type: "identity",
    name: "Identity Verification",
    description: "Verify your identity by uploading one government-issued ID",
    required_documents: ["passport", "driver_license", "national_id"],
    min_required: 1, // User must upload at least one of the required documents
    fee: 2000,
    validity_period_days: 365,
    benefits: [
      "Access to premium event features",
      "Increased trust badge on profile",
      "Priority customer support",
      "Higher ticket sales limits",
    ],
  },
  {
    type: "business",
    name: "Business Verification",
    description: "Verify your business to unlock all vendor and organizer features",
    required_documents: ["business_registration", "utility_bill"],
    fee: 10000,
    validity_period_days: 365,
    benefits: [
      "Full vendor marketplace access",
      "Business profile verification badge",
      "Access to B2B features",
      "Higher transaction limits",
      "Custom branding options",
    ],
  },
  {
    type: "premium",
    name: "Premium Verification",
    description: "Enhanced verification for maximum trust and features",
    required_documents: ["passport", "business_registration", "utility_bill"],
    fee: 25000,
    validity_period_days: 730,
    benefits: [
      "All identity and business benefits",
      "Featured placement priority",
      "Dedicated account manager",
      "Early access to new features",
      "Custom integrations",
      "API access",
    ],
  },
];

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: "Passport",
  driver_license: "Driver's License",
  national_id: "National ID Card",
  business_registration: "Business Registration",
  utility_bill: "Utility Bill",
};

const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  passport: "Valid international passport",
  driver_license: "Government-issued driver's license",
  national_id: "National identification card",
  business_registration: "Official business registration document (CAC)",
  utility_bill: "Recent utility bill (not older than 3 months)",
};

const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  passport: "book-open",
  driver_license: "document",
  national_id: "document",
  business_registration: "file-text",
  utility_bill: "file",
};

const STATUS_COLORS: Record<VerificationStatus, string> = {
  pending: "bg-neutral-100 text-neutral-600",
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-600",
};

const STATUS_ICONS: Record<VerificationStatus, string> = {
  pending: "clock",
  submitted: "check-circle",
  under_review: "loader",
  approved: "shield-check",
  rejected: "x-circle",
  expired: "alert-circle",
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: "wallet", name: "Wallet Balance", icon: "wallet", description: "Pay from your Guestly wallet" },
  { id: "card", name: "Credit/Debit Card", icon: "credit-card", description: "Visa, Mastercard, Verve" },
  { id: "bank_transfer", name: "Bank Transfer", icon: "credit-card", description: "Direct bank transfer" },
  { id: "mobile_money", name: "Mobile Money", icon: "smartphone", description: "MTN, Airtel, Glo, 9mobile" },
];

// File Upload Component
function DocumentUpload({ 
  documentType, 
  onUpload, 
  uploadedFile,
  disabled
}: { 
  documentType: DocumentType;
  onUpload: (file: File | null) => void;
  uploadedFile: VerificationDocument | null;
  disabled: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      setError("No file selected");
      return;
    }
    
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, and PDF files are allowed");
      return;
    }
    
    setError(null);
    onUpload(file);
    
    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    maxFiles: 1,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
  });

  const removeFile = () => {
    setPreview(null);
    onUpload(null as any);
  };

  if (uploadedFile) {
    return (
      <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon name={DOCUMENT_TYPE_ICONS[documentType]} size={16} className="text-primary-600" />
            <span className="font-medium text-neutral-900">{uploadedFile.file_name}</span>
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
              Uploaded
            </span>
          </div>
          {!disabled && (
            <button
              onClick={removeFile}
              className="p-1 text-neutral-500 hover:text-red-500 rounded-lg hover:bg-red-50"
            >
              <Icon name="trash-2" size={16} />
            </button>
          )}
        </div>
        <p className="text-xs text-neutral-500 mb-2">
          {DOCUMENT_TYPE_DESCRIPTIONS[documentType]}
        </p>
        {preview && (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded-lg" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-primary-500 bg-primary-50" : "border-neutral-300 bg-neutral-50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />
      <Icon name={DOCUMENT_TYPE_ICONS[documentType]} size={48} className="text-neutral-400 mx-auto mb-4" />
      <h4 className="font-semibold text-neutral-900 mb-2">{DOCUMENT_TYPE_LABELS[documentType]}</h4>
      <p className="text-sm text-neutral-500 mb-2">{DOCUMENT_TYPE_DESCRIPTIONS[documentType]}</p>
      <p className="text-xs text-neutral-400">
        {isDragActive ? "Drop the file here" : "Drag & drop file here or click to browse"}
      </p>
      <p className="text-xs text-neutral-400 mt-1">Max size: 5MB | Formats: JPEG, PNG, PDF</p>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}

// Verification Type Selection Component
function VerificationTypeSelection({ 
  selectedType,
  onSelect
}: { 
  selectedType: VerificationType | null;
  onSelect: (type: VerificationType) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-neutral-900">Select Verification Type</h3>
      <p className="text-neutral-500">Choose the verification level that matches your needs</p>
      
      <div className="grid gap-4 md:grid-cols-3">
        {VERIFICATION_TYPES.map((type) => (
          <Card
            key={type.type}
            onClick={() => onSelect(type.type)}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedType === type.type ? "border-2 border-primary-500 bg-primary-50" : "border border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-neutral-900">{type.name}</h4>
              {selectedType === type.type && (
                <Icon name="check-circle" size={24} className="text-primary-600" />
              )}
            </div>
            <p className="text-sm text-neutral-500 mb-4">{type.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-neutral-900">{formatCurrency(type.fee)}</span>
              <span className="text-sm text-neutral-500">One-time fee</span>
            </div>
            
            <ul className="space-y-2">
              {type.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Icon name="check" size={16} className="text-green-600" />
                  {benefit}
                </li>
              ))}
              {type.benefits.length > 3 && (
                <li className="text-sm text-neutral-500">+{type.benefits.length - 3} more benefits</li>
              )}
            </ul>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(type.type);
              }}
              className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${
                selectedType === type.type
                  ? "bg-primary-600 text-white"
                  : "bg-white text-primary-600 border border-primary-600"
              }`}
            >
              Select {type.name}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Document Requirements Component
function DocumentRequirements({ 
  verificationType,
  onDocumentsReady,
  files,
  setFiles
}: { 
  verificationType: VerificationType | null;
  onDocumentsReady: (ready: boolean) => void;
  files: Record<DocumentType, File | null>;
  setFiles: React.Dispatch<React.SetStateAction<Record<DocumentType, File | null>>>;
}) {
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<DocumentType, VerificationDocument | null>>({} as Record<DocumentType, VerificationDocument | null>);

  const type = VERIFICATION_TYPES.find((t) => t.type === verificationType);
  
  if (!type) {
    return (
      <div className="text-center py-8">
        <Icon name="alert-circle" size={48} className="text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900">Select a verification type first</h3>
      </div>
    );
  }

  const handleUpload = (documentType: DocumentType) => (file: File | null) => {
    setFiles((prev) => ({ ...prev, [documentType]: file }));
    if (file === null) {
      setUploadedDocuments((prev) => ({ ...prev, [documentType]: null }));
    }
  };

  // Check if enough documents are uploaded
  // If min_required is set, use that; otherwise require all
  const uploadedCount = type.required_documents.filter(
    (docType) => files[docType] !== undefined && files[docType] !== null
  ).length;
  const minRequired = type.min_required || type.required_documents.length;
  const allRequiredUploaded = uploadedCount >= minRequired;

  useEffect(() => {
    onDocumentsReady(allRequiredUploaded);
  }, [allRequiredUploaded, onDocumentsReady]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-neutral-900">Required Documents</h3>
        <p className="text-neutral-500">
          {type.min_required && type.min_required < type.required_documents.length
            ? `Upload at least ${type.min_required} of the following documents`
            : "Upload the following documents"}
          to complete your verification
        </p>
      </div>

      <div className="grid gap-4">
        {type.required_documents.map((documentType) => (
          <div key={documentType} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name={DOCUMENT_TYPE_ICONS[documentType]} size={16} className="text-primary-600" />
              <h4 className="font-medium text-neutral-900">{DOCUMENT_TYPE_LABELS[documentType]}</h4>
              <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                Required
              </span>
            </div>
            <DocumentUpload
              documentType={documentType}
              onUpload={handleUpload(documentType)}
              uploadedFile={uploadedDocuments[documentType] || null}
              disabled={false}
            />
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start gap-3">
          <Icon name="info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Document Guidelines</h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>All documents must be valid and not expired</li>
              <li>Photo IDs must be clear and readable</li>
              <li>Business documents must be officially registered</li>
              <li>Utility bills must be recent (within 3 months)</li>
              <li>File format: JPEG, PNG, or PDF (max 5MB each)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment Form Component
function PaymentForm({ 
  amount,
  onPaymentSuccess,
  onCancel
}: { 
  amount: number;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentOption | null>(PAYMENT_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    try {
      // In production, this would call the actual payment API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onPaymentSuccess();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-neutral-900">Payment Information</h3>
        <p className="text-neutral-500">Complete your payment to submit verification</p>
      </div>

      <div className="grid gap-4">
        <div className="p-4 bg-neutral-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">Amount Due</span>
            <span className="text-2xl font-bold text-neutral-900">{formatCurrency(amount)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Payment Method
          </label>
          <div className="grid gap-2">
            {PAYMENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedMethod(option)}
                className={`w-full p-4 text-left border rounded-xl transition-colors ${
                  selectedMethod?.id === option.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name={option.icon} size={20} className="text-primary-600" />
                  <div>
                    <h4 className="font-medium text-neutral-900">{option.name}</h4>
                    <p className="text-sm text-neutral-500">{option.description}</p>
                  </div>
                  {selectedMethod?.id === option.id && (
                    <Icon name="check-circle" size={20} className="text-primary-600 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : `Pay ${formatCurrency(amount)}`}
        </Button>
      </div>
    </form>
  );
}

// Verification Status Component
function VerificationStatus({ 
  request,
  onStartNew
}: { 
  request: VerificationRequest;
  onStartNew: () => void;
}) {
  const type = VERIFICATION_TYPES.find((t) => t.type === request.verification_type);
  const isExpired = request.expires_at && new Date(request.expires_at) < new Date();
  const isApproved = request.status === "approved";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 "
          style={{ backgroundColor: `${isApproved ? "var(--color-green-100)" : "var(--color-neutral-100)"}` }}
        >
          <Icon 
            name={STATUS_ICONS[request.status]} 
            size={48} 
            className={isApproved ? "text-green-600" : "text-neutral-600"}
          />
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {isApproved ? "Verified!" : `Status: ${request.status.replace('_', ' ').toUpperCase()}`}
        </h2>
        
        {isApproved && (
          <p className="text-green-600 text-lg font-medium mb-4">
            Your {type?.name || "verification"} has been approved
          </p>
        )}
        
        {request.status === "rejected" && request.reason && (
          <div className="p-4 bg-red-50 rounded-xl mb-4">
            <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
            <p className="text-red-700">{request.reason}</p>
          </div>
        )}
      </div>

      {/* Status Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">Verification Type</span>
            <span className="font-medium text-neutral-900">{type?.name || request.verification_type}</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">Status</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              STATUS_COLORS[request.status]
            }`}>
              {request.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">Submitted</span>
            <span className="font-medium text-neutral-900">{formatDate(request.created_at)}</span>
          </div>
        </Card>
        
        {request.updated_at && request.updated_at !== request.created_at && (
          <Card className="p-4">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Last Updated</span>
              <span className="font-medium text-neutral-900">{formatDate(request.updated_at)}</span>
            </div>
          </Card>
        )}
        
        {request.status === "approved" && request.expires_at && (
          <Card className="p-4 md:col-span-2">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Expires</span>
              <span className={`font-medium ${isExpired ? "text-red-600" : "text-neutral-900"}`}>
                {formatDate(request.expires_at)}
                {isExpired && " (Expired)"}
              </span>
            </div>
          </Card>
        )}
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">Submitted Documents</h3>
        <div className="grid gap-4">
          {request.documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 border border-neutral-200 rounded-xl">
              <Icon name={DOCUMENT_TYPE_ICONS[doc.document_type]} size={24} className="text-primary-600" />
              <div className="flex-1">
                <h4 className="font-medium text-neutral-900">{DOCUMENT_TYPE_LABELS[doc.document_type]}</h4>
                <p className="text-sm text-neutral-500">{doc.file_name}</p>
              </div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                doc.status === "verified" ? "bg-green-100 text-green-700" :
                doc.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-neutral-100 text-neutral-600"
              }`}>
                {doc.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {request.status === "rejected" || (isApproved && isExpired) ? (
        <div className="flex gap-4">
          <Button onClick={onStartNew} className="flex-1">
            <Icon name="refresh-cw" size={16} />
            {isApproved && isExpired ? "Renew Verification" : "Try Again"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default function VerificationPage() {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"select" | "documents" | "payment" | "complete">("select");
  const [selectedType, setSelectedType] = useState<VerificationType | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [files, setFiles] = useState<Record<DocumentType, File | null>>({} as Record<DocumentType, File | null>);
  const [isDocumentsReady, setIsDocumentsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchVerificationRequests() {
      setLoading(true);
      try {
        const response = await fetch("/api/verification/my-requests");
        if (response.ok) {
          const data = await response.json();
          setVerificationRequests(data.requests || []);
          
          // If there's an active or pending request, show its status
          const activeRequest = data.requests.find(
            (r: VerificationRequest) => r.status === "pending" || r.status === "submitted" || r.status === "under_review"
          );
          const approvedRequest = data.requests.find(
            (r: VerificationRequest) => r.status === "approved"
          );
          
          if (activeRequest) {
            setSelectedRequest(activeRequest);
          } else if (approvedRequest) {
            setSelectedRequest(approvedRequest);
          }
        }
      } catch (error) {
        console.error("Failed to fetch verification requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVerificationRequests();
  }, []);

  // Check if user has an approved, non-expired verification
  const hasActiveVerification = verificationRequests.some(
    (r) => r.status === "approved" && r.expires_at && new Date(r.expires_at) >= new Date()
  );

  const hasPendingRequest = verificationRequests.some(
    (r) => r.status === "pending" || r.status === "submitted" || r.status === "under_review"
  );

  const handleSelectType = (type: VerificationType) => {
    setSelectedType(type);
    setStep("documents");
  };

  const handleDocumentsReady = (ready: boolean) => {
    setIsDocumentsReady(ready);
  };

  const handlePaymentSuccess = async () => {
    // Submit verification request with documents and process payment
    setIsSubmitting(true);
    try {
      const type = VERIFICATION_TYPES.find((t) => t.type === selectedType);
      if (!type) throw new Error("Verification type not found");
      
      // Collect uploaded files
      const uploadedFiles = type.required_documents
        .filter((docType) => files[docType] !== undefined && files[docType] !== null)
        .map((docType) => ({ type: docType, file: files[docType]! }));
      
      if (uploadedFiles.length === 0) {
        throw new Error("No documents uploaded");
      }
      
      // Map frontend type to backend type
      const backendTypeMap: Record<VerificationType, string> = {
        identity: "INDIVIDUAL",
        business: "BUSINESS",
        premium: "INFLUENCER",
      };
      const backendLevelMap: Record<VerificationType, string> = {
        identity: "BASIC",
        business: "STANDARD",
        premium: "PREMIUM",
      };
      // Map frontend document types to backend document types
      const backendDocTypeMap: Record<DocumentType, string> = {
        passport: "PASSPORT",
        driver_license: "DRIVERS_LICENSE",
        national_id: "GOVERNMENT_ID",
        business_registration: "CAC",
        utility_bill: "UTILITY_BILL",
      };
      
      // Step 1: Create verification request (without documents first)
      const createResponse = await fetch("/api/verification/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verification_type: selectedType ? (backendTypeMap[selectedType] || selectedType.toUpperCase()) : "",
          verification_level: selectedType ? (backendLevelMap[selectedType] || "BASIC") : "BASIC",
          payment_method: "wallet",
        }),
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || "Failed to create verification request");
      }
      
      const requestData = await createResponse.json();
      const requestId = requestData.id;
      
      // Step 2: Upload documents with the request ID
      const documentUploadPromises = uploadedFiles.map(async ({ type: docType, file }) => {
        const formData = new FormData();
        formData.append("request_id", requestId);
        formData.append("document_type", backendDocTypeMap[docType] || docType.toUpperCase());
        formData.append("file", file);
        
        const uploadResponse = await fetch("/api/verification/documents/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(`Failed to upload ${DOCUMENT_TYPE_LABELS[docType]}: ${errorData.error || "Unknown error"}`);
        }
        
        return uploadResponse.json();
      });
      
      await Promise.all(documentUploadPromises);
      
      // Step 3: Submit the verification request (mark as submitted)
      const submitResponse = await fetch(`/api/verification/requests/${requestId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.error || "Failed to submit verification");
      }
      
      setStep("complete");
      // Refresh requests
      const requestsResponse = await fetch("/api/verification/my-requests");
      if (requestsResponse.ok) {
        const data = await requestsResponse.json();
        setVerificationRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to submit verification request:", error);
      alert(error instanceof Error ? error.message : "Failed to submit verification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNew = () => {
    setSelectedRequest(null);
    setSelectedType(null);
    setStep("select");
  };

  const selectedTypeData = VERIFICATION_TYPES.find((t) => t.type === selectedType);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-neutral-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show status if there's an active request
  if (selectedRequest && (hasPendingRequest || hasActiveVerification)) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="text-sm text-neutral-500 hover:text-neutral-700">
            <Icon name="arrow-left" size={16} /> Back to Settings
          </Link>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Verification Status</h1>
          <p className="text-slate-500 mt-1">Check the status of your verification request</p>
        </div>

        <VerificationStatus
          request={selectedRequest}
          onStartNew={handleStartNew}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/settings" className="text-sm text-neutral-500 hover:text-neutral-700">
          <Icon name="arrow-left" size={16} /> Back to Settings
        </Link>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Get Verified</h1>
        <p className="text-slate-500 mt-1">Verify your identity or business to unlock premium features</p>
      </div>

      {/* Progress Steps */}
      {step !== "select" && (
        <div className="flex items-center justify-between">
          {["Type", "Documents", "Payment", "Complete"].map((label, index) => {
            const stepIndex = ["select", "documents", "payment", "complete"].indexOf(step);
            const isCurrent = index === stepIndex;
            const isCompleted = index < stepIndex;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      isCompleted ? "bg-primary-500 text-white" :
                      isCurrent ? "bg-primary-500 text-white border-2 border-primary-500" :
                      "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {isCompleted ? <Icon name="check" size={20} /> : index + 1}
                  </div>
                  <span className={`text-xs mt-2 ${isCurrent ? "font-semibold text-primary-600" : "text-neutral-500"}`}>
                    {label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`w-full h-1 mx-2 rounded ${isCompleted ? "bg-primary-500" : "bg-neutral-200"}`} 
                    style={{ minWidth: "60px" }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {step === "select" && (
          <VerificationTypeSelection
            selectedType={selectedType}
            onSelect={handleSelectType}
          />
        )}

        {step === "documents" && selectedType && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Upload Documents</h2>
                <p className="text-neutral-500">
                  {selectedTypeData?.name} requires the following documents
                </p>
              </div>
              <Button variant="secondary" onClick={() => setStep("select")}>
                <Icon name="arrow-left" size={16} />
                Change Type
              </Button>
            </div>

            <DocumentRequirements
              verificationType={selectedType}
              onDocumentsReady={handleDocumentsReady}
              files={files}
              setFiles={setFiles}
            />

            <div className="flex gap-4 justify-end">
              <Button variant="secondary" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button
                onClick={() => setStep("payment")}
                disabled={!isDocumentsReady}
              >
                Continue to Payment
                <Icon name="arrow-right" size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && selectedType && selectedTypeData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Complete Payment</h2>
                <p className="text-neutral-500">
                  Pay the verification fee to submit your request
                </p>
              </div>
              <Button variant="secondary" onClick={() => setStep("documents")}>
                <Icon name="arrow-left" size={16} />
                Back
              </Button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl mb-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Verification Type</span>
                  <span className="font-medium text-neutral-900">{selectedTypeData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Validity</span>
                  <span className="font-medium text-neutral-900">
                    {selectedTypeData.validity_period_days} days
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200">
                  <span className="text-lg font-semibold text-neutral-900">Total</span>
                  <span className="text-lg font-bold text-neutral-900">
                    {formatCurrency(selectedTypeData.fee)}
                  </span>
                </div>
              </div>
            </div>

            <PaymentForm
              amount={selectedTypeData.fee}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={() => setStep("documents")}
            />
          </div>
        )}

        {step === "complete" && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <Icon name="check-circle" size={48} className="text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-green-900 mb-4">Verification Submitted!</h2>
            <p className="text-lg text-neutral-600 max-w-md mx-auto">
              Your verification request has been submitted successfully. You will receive an email 
              notification once it has been reviewed.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 max-w-md mx-auto">
              <Card className="p-4 text-left">
                <div className="flex items-center gap-3">
                  <Icon name="clock" size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-neutral-500">Review Time</p>
                    <p className="font-medium text-neutral-900">1-3 business days</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 text-left">
                <div className="flex items-center gap-3">
                  <Icon name="mail" size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-neutral-500">Notification</p>
                    <p className="font-medium text-neutral-900">Email notification</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex gap-4 mt-8">
              <Button onClick={() => setStep("select")}>
                Submit Another Request
              </Button>
              <Link href={typeof window !== "undefined" && window.location.pathname.startsWith("/attendee") ? "/attendee" : "/dashboard"}>
                <Button variant="secondary">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
