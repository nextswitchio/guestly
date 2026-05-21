"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface AnnouncementCreationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function AnnouncementCreationForm({ onSubmit, onCancel }: AnnouncementCreationFormProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    targetType: 'all' as 'all' | 'attendee' | 'organiser' | 'vendor',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    scheduledAt: '',
    expiresAt: '',
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).getTime() : undefined,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).getTime() : undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get minimum datetime for scheduling (current time + 5 minutes)
  const minScheduleTime = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Announcement Title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter announcement title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Content
        </label>
        <Textarea
          value={formData.content}
          onChange={(e) => updateField('content', e.target.value)}
          placeholder="Enter announcement content..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Target Audience
          </label>
          <select
            value={formData.targetType}
            onChange={(e) => updateField('targetType', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white text-slate-900"
            required
          >
            <option value="all">All Users</option>
            <option value="attendee">Attendees Only</option>
            <option value="organiser">Organisers Only</option>
            <option value="vendor">Vendors Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Priority Level
          </label>
          <select
            value={formData.priority}
            onChange={(e) => updateField('priority', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white text-slate-900"
            required
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Schedule For Later (Optional)
          </label>
          <input
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => updateField('scheduledAt', e.target.value)}
            min={minScheduleTime}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white text-slate-900"
          />
          <p className="text-xs text-slate-500 mt-1">
            Leave empty to publish immediately
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Expires At (Optional)
          </label>
          <input
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => updateField('expiresAt', e.target.value)}
            min={minScheduleTime}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white text-slate-900"
          />
          <p className="text-xs text-slate-500 mt-1">
            Leave empty for no expiration
          </p>
        </div>
      </div>

      {/* Preview Section */}
      {(formData.title || formData.content) && (
        <div className="border border-neutral-200 rounded-lg p-4 bg-white">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Preview</h4>
          <div className="space-y-2">
            {formData.title && (
              <h5 className="font-semibold text-slate-900">{formData.title}</h5>
            )}
            {formData.content && (
              <p className="text-sm text-slate-500 whitespace-pre-wrap">
                {formData.content}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                formData.priority === 'urgent'
                  ? 'bg-danger-100 text-danger-700'
                  : formData.priority === 'high'
                  ? 'bg-warning-100 text-warning-700'
                  : 'bg-neutral-100 text-neutral-700'
              }`}>
                {formData.priority} priority
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                {formData.targetType === 'all' ? 'All Users' : formData.targetType}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={!formData.title || !formData.content}
        >
          {formData.scheduledAt ? 'Schedule Announcement' : 'Publish Announcement'}
        </Button>
      </div>
    </form>
  );
}