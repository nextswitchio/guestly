"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import FileUpload from "@/components/ui/FileUpload";
import Modal from "@/components/ui/Modal";
import Tabs from "@/components/ui/Tabs";
import Icon from "@/components/ui/Icon";
import RundownBuilder from "@/components/organiser/RundownBuilder";
import TimelineVisualization from "@/components/organiser/TimelineVisualization";

type RundownItem = {
  id: string;
  time: string;
  duration: number;
  activity: string;
  description?: string;
  responsible?: string;
  location?: string;
};

type Doc = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  type: "charter" | "rundown" | "contract" | "permit" | "insurance" | "invoice" | "receipt" | "other";
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  rundownItems?: Array<{
    id: string;
    time: string;
    duration: number;
    activity: string;
    description?: string;
    responsible?: string;
    location?: string;
  }>;
};

const DOCUMENT_TYPES = [
  { value: "charter", label: "Charter", icon: "document" },
  { value: "rundown", label: "Rundown", icon: "calendar" },
  { value: "contract", label: "Contract", icon: "document" },
  { value: "permit", label: "Permit", icon: "ticket" },
  { value: "insurance", label: "Insurance", icon: "shield" },
  { value: "invoice", label: "Invoice", icon: "document" },
  { value: "receipt", label: "Receipt", icon: "document" },
  { value: "other", label: "Other", icon: "document" },
] as const;

export default function DocumentsTab({ eventId }: { eventId: string }) {
  const [docs, setDocs] = React.useState<Doc[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [charterModalOpen, setCharterModalOpen] = React.useState(false);
  const [rundownModalOpen, setRundownModalOpen] = React.useState(false);
  const [previewDoc, setPreviewDoc] = React.useState<Doc | null>(null);
  const [selectedType, setSelectedType] = React.useState<string>("all");

  // Charter form state
  const [title, setTitle] = React.useState("");
  const [objectives, setObjectives] = React.useState("");
  const [scope, setScope] = React.useState("");
  const [stakeholders, setStakeholders] = React.useState("");
  const [risks, setRisks] = React.useState("");

  // Rundown form state
  const [rundownTitle, setRundownTitle] = React.useState("");
  const [rundownItems, setRundownItems] = React.useState<RundownItem[]>([]);
  const [rundownView, setRundownView] = React.useState<"builder" | "timeline">("builder");

  // Upload form state
  const [uploadTitle, setUploadTitle] = React.useState("");
  const [uploadType, setUploadType] = React.useState<Doc["type"]>("other");
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([]);

  async function load() {
    const res = await fetch(`/api/events/${eventId}/documents`);
    const data = await res.json();
    if (res.ok) setDocs(data.data as Doc[]);
  }

  React.useEffect(() => {
    void load();
  }, [eventId]);

  async function generateCharter(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/documents/charter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || undefined,
          objectives: objectives || undefined,
          scope: scope || undefined,
          stakeholders: stakeholders || undefined,
          risks: risks || undefined,
        }),
      });
      if (res.ok) {
        setTitle("");
        setObjectives("");
        setScope("");
        setStakeholders("");
        setRisks("");
        setCharterModalOpen(false);
        await load();
      }
    } finally {
      setLoading(false);
    }
  }

  async function saveRundown(e: React.FormEvent) {
    e.preventDefault();
    
    if (rundownItems.length === 0) {
      alert("Please add at least one schedule item");
      return;
    }

    if (rundownItems.some(item => !item.activity)) {
      alert("All schedule items must have an activity name");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/documents/rundown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: rundownTitle || undefined,
          rundownItems,
        }),
      });
      if (res.ok) {
        setRundownTitle("");
        setRundownItems([]);
        setRundownModalOpen(false);
        await load();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (uploadFiles.length === 0) return;

    setLoading(true);
    try {
      const file = uploadFiles[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];

        const res = await fetch(`/api/events/${eventId}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: uploadTitle || file.name,
            type: uploadType,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            fileData: base64,
          }),
        });

        if (res.ok) {
          setUploadTitle("");
          setUploadType("other");
          setUploadFiles([]);
          setUploadModalOpen(false);
          await load();
        }
      };

      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const res = await fetch(`/api/events/${eventId}/documents?docId=${docId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await load();
    }
  }

  function handleDownload(doc: Doc) {
    window.open(`/api/events/${eventId}/documents/${doc.id}/download`, "_blank");
  }

  function handleExportPDF(doc: Doc) {
    // Open the PDF export route which returns HTML that can be printed
    const exportWindow = window.open(
      `/api/events/${eventId}/documents/${doc.id}/export-pdf`,
      "_blank"
    );
    
    // Trigger print dialog after content loads
    if (exportWindow) {
      exportWindow.addEventListener("load", () => {
        setTimeout(() => {
          exportWindow.print();
        }, 500);
      });
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  function getDocumentIcon(type: Doc["type"]) {
    return DOCUMENT_TYPES.find((t) => t.value === type)?.icon || "document";
  }

  function getDocumentLabel(type: Doc["type"]) {
    return DOCUMENT_TYPES.find((t) => t.value === type)?.label || "Other";
  }

  const filteredDocs =
    selectedType === "all" ? docs : docs.filter((d) => d.type === selectedType);

  const docsByType = DOCUMENT_TYPES.map((type) => ({
    ...type,
    count: docs.filter((d) => d.type === type.value).length,
  }));

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Event Documents</h3>
            <p className="text-sm text-foreground-muted mt-1">
              Upload and organize important event documents
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setCharterModalOpen(true)}
              size="sm"
            >
              Generate Charter
            </Button>
            <Button
              variant="secondary"
              onClick={() => setRundownModalOpen(true)}
              size="sm"
            >
              Create Rundown
            </Button>
            <Button onClick={() => setUploadModalOpen(true)} size="sm">
              Upload Document
            </Button>
          </div>
        </div>
      </Card>

      {/* Document Type Filter */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedType === "all"
                ? "bg-primary-500 text-white"
                : "bg-surface-hover text-foreground-muted hover:bg-surface-border"
            }`}
          >
            All ({docs.length})
          </button>
          {docsByType.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                selectedType === type.value
                  ? "bg-primary-500 text-white"
                  : "bg-surface-hover text-foreground-muted hover:bg-surface-border"
              }`}
            >
              <Icon name={type.icon as any} size={14} /> {type.label} ({type.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name={getDocumentIcon(doc.type) as any} size={32} className="text-neutral-400" />
                  <div>
                    <div className="text-sm font-semibold text-foreground line-clamp-1">
                      {doc.title}
                    </div>
                    <div className="text-xs text-foreground-muted">
                      {getDocumentLabel(doc.type)}
                    </div>
                  </div>
                </div>
              </div>

              {doc.fileName && (
                <div className="text-xs text-foreground-muted mb-2">
                  {doc.fileName}
                  {doc.fileSize && ` • ${formatFileSize(doc.fileSize)}`}
                </div>
              )}

              <div className="text-xs text-foreground-muted mb-3">
                {new Date(doc.createdAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                {doc.content && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1"
                  >
                    Preview
                  </Button>
                )}
                {(doc.type === "charter" || doc.type === "rundown") && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExportPDF(doc)}
                    className="flex-1"
                  >
                    Export PDF
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  className="flex-1"
                >
                  Download
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="document"
          title={
            selectedType === "all"
              ? "No documents yet"
              : `No ${getDocumentLabel(selectedType as Doc["type"]).toLowerCase()} documents`
          }
          description="Upload event documents or generate charters to keep your team organized."
          tips={[
            "Upload contracts, permits, and insurance documents",
            "Generate event charters to clarify objectives",
            "Organize documents by type for easy access",
          ]}
        />
      )}

      {/* Upload Modal */}
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Document"
        size="lg"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Title"
            placeholder="Enter document title"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.currentTarget.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Document Type
            </label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value as Doc["type"])}
              className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <FileUpload
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            maxSize={10 * 1024 * 1024} // 10MB
            maxFiles={1}
            onChange={setUploadFiles}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadFiles.length === 0}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Charter Generation Modal */}
      <Modal
        open={charterModalOpen}
        onClose={() => setCharterModalOpen(false)}
        title="Generate Event Charter"
        size="lg"
      >
        <form onSubmit={generateCharter} className="space-y-4">
          <Input
            placeholder="Document title (optional)"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-surface-border bg-surface-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            placeholder="Objectives"
            value={objectives}
            onChange={(e) => setObjectives(e.currentTarget.value)}
          />
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-surface-border bg-surface-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            placeholder="Scope"
            value={scope}
            onChange={(e) => setScope(e.currentTarget.value)}
          />
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-surface-border bg-surface-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            placeholder="Stakeholders"
            value={stakeholders}
            onChange={(e) => setStakeholders(e.currentTarget.value)}
          />
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-surface-border bg-surface-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            placeholder="Risks and mitigations"
            value={risks}
            onChange={(e) => setRisks(e.currentTarget.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCharterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Charter"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || "Document Preview"}
        size="xl"
      >
        {previewDoc && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={getDocumentIcon(previewDoc.type) as any} size={32} className="text-neutral-400" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {previewDoc.title}
                  </div>
                  <div className="text-xs text-foreground-muted">
                    {getDocumentLabel(previewDoc.type)} •{" "}
                    {new Date(previewDoc.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {(previewDoc.type === "charter" || previewDoc.type === "rundown") && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExportPDF(previewDoc)}
                  >
                    Export PDF
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(previewDoc)}
                >
                  Download
                </Button>
              </div>
            </div>
            
            {previewDoc.type === "rundown" && previewDoc.rundownItems ? (
              <TimelineVisualization items={previewDoc.rundownItems} />
            ) : (
              <div className="border border-surface-border rounded-lg p-4 bg-surface-card max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                  {previewDoc.content}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Rundown Creation Modal */}
      <Modal
        open={rundownModalOpen}
        onClose={() => setRundownModalOpen(false)}
        title="Create Event Rundown"
        size="xl"
      >
        <form onSubmit={saveRundown} className="space-y-4">
          <Input
            label="Rundown Title"
            placeholder="e.g., Event Day Schedule"
            value={rundownTitle}
            onChange={(e) => setRundownTitle(e.currentTarget.value)}
          />

          <Tabs
            tabs={[
              {
                id: "builder",
                label: "Schedule Builder",
                content: (
                  <div className="py-4">
                    <RundownBuilder items={rundownItems} onChange={setRundownItems} />
                  </div>
                ),
              },
              {
                id: "timeline",
                label: "Timeline Preview",
                content: (
                  <div className="py-4">
                    <TimelineVisualization items={rundownItems} />
                  </div>
                ),
              },
            ]}
            defaultTabId="builder"
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-surface-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRundownModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || rundownItems.length === 0}>
              {loading ? "Saving..." : "Save Rundown"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
