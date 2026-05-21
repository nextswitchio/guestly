'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

interface EmailBlock {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'divider' | 'footer';
  content: string;
  styles?: Record<string, string>;
}

import type { EmailTemplate } from './EmailTemplateLibrary';

interface EmailTemplateBuilderProps {
  organizerId: string;
  initialTemplate?: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
}

export function EmailTemplateBuilder({ organizerId, initialTemplate, onSave, onCancel }: EmailTemplateBuilderProps) {
  const [templateName, setTemplateName] = useState(initialTemplate?.name || '');
  const [subject, setSubject] = useState(initialTemplate?.subject || '');
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialTemplate?.blocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const blockTypes = [
    { type: 'header' as const, icon: 'document' as const, label: 'Header' },
    { type: 'text' as const, icon: 'edit' as const, label: 'Text' },
    { type: 'image' as const, icon: 'camera' as const, label: 'Image' },
    { type: 'button' as const, icon: 'target' as const, label: 'Button' },
    { type: 'divider' as const, icon: 'minus' as const, label: 'Divider' },
    { type: 'footer' as const, icon: 'clipboard' as const, label: 'Footer' },
  ];

  const addBlock = (type: EmailBlock['type']) => {
    const newBlock: EmailBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: {},
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const getDefaultContent = (type: EmailBlock['type']): string => {
    switch (type) {
      case 'header':
        return 'Your Event Title';
      case 'text':
        return 'Add your email content here...';
      case 'image':
        return 'https://via.placeholder.com/600x300';
      case 'button':
        return 'Buy Tickets';
      case 'divider':
        return '';
      case 'footer':
        return '© 2024 Guestly. All rights reserved.';
      default:
        return '';
    }
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, content } : block));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const handleSave = () => {
    if (!templateName.trim() || !subject.trim()) {
      alert('Please provide template name and subject');
      return;
    }
    onSave({
      id: initialTemplate?.id || '',
      name: templateName,
      subject,
      category: initialTemplate?.category || 'announcement',
      thumbnail: initialTemplate?.thumbnail || '',
      description: initialTemplate?.description || '',
      blocks,
      createdAt: initialTemplate?.createdAt || Date.now(),
      isCustom: initialTemplate?.isCustom ?? true,
    });
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Toolbar */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Template Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Template Name</label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Event Announcement"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject Line</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Don't miss {{event_name}}!"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Add Blocks</h3>
          <div className="grid grid-cols-2 gap-2">
            {blockTypes.map(({ type, icon, label }) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addBlock(type)}
                className="flex items-center gap-2"
              >
                <Icon name={icon} className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </Card>

        {selectedBlock && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Edit Block</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                {selectedBlock.type === 'text' || selectedBlock.type === 'header' || selectedBlock.type === 'footer' ? (
                  <textarea
                    value={selectedBlock.content}
                    onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
                    placeholder="Enter content..."
                  />
                ) : selectedBlock.type === 'image' ? (
                  <Input
                    value={selectedBlock.content}
                    onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
                    placeholder="Image URL"
                  />
                ) : selectedBlock.type === 'button' ? (
                  <Input
                    value={selectedBlock.content}
                    onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
                    placeholder="Button text"
                  />
                ) : null}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Canvas */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Email Preview</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Template
              </Button>
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-2xl min-h-[600px]">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
              {/* Email Header */}
              <div className="bg-lime text-white p-4">
                <div className="text-sm font-medium">Subject: {subject || 'Your subject line'}</div>
              </div>

              {/* Email Body */}
              <div className="p-6 space-y-4">
                {blocks.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <Icon name="megaphone" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Add blocks to start building your email</p>
                  </div>
                ) : (
                  blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={`relative group ${selectedBlockId === block.id ? 'ring-2 ring-lime rounded' : ''}`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      {/* Block Controls */}
                      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        {index > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                            className="bg-white p-1 rounded shadow hover:bg-neutral-50"
                          >
                            <Icon name="chevron-up" className="w-4 h-4" />
                          </button>
                        )}
                        {index < blocks.length - 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                            className="bg-white p-1 rounded shadow hover:bg-neutral-50"
                          >
                            <Icon name="chevron-down" className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                          className="bg-red-500 text-white p-1 rounded shadow hover:bg-red-600"
                        >
                          <Icon name="x" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Block Content */}
                      {block.type === 'header' && (
                        <h1 className="text-3xl font-bold text-neutral-900">
                          {block.content}
                        </h1>
                      )}
                      {block.type === 'text' && (
                        <p className="text-neutral-700 whitespace-pre-wrap">
                          {block.content}
                        </p>
                      )}
                      {block.type === 'image' && (
                        <img
                          src={block.content}
                          alt="Email content"
                          className="w-full rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/600x300?text=Image';
                          }}
                        />
                      )}
                      {block.type === 'button' && (
                        <div className="text-center">
                          <button className="bg-lime text-dark px-6 py-3 rounded-2xl font-semibold hover:bg-lime/80">
                            {block.content}
                          </button>
                        </div>
                      )}
                      {block.type === 'divider' && (
                        <hr className="border-neutral-200" />
                      )}
                      {block.type === 'footer' && (
                        <p className="text-sm text-neutral-500 text-center">
                          {block.content}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
