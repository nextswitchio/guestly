'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Plus, Edit, Trash2, Folder, Eye, EyeOff } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  is_active: boolean;
  post_count: number;
  seo_title: string;
  seo_description: string;
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#84cc16');
  const [icon, setIcon] = useState('📁');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blog/categories?include_inactive=true', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setColor('#84cc16');
    setIcon('📁');
    setOrder(0);
    setIsActive(true);
    setSeoTitle('');
    setSeoDescription('');
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setColor(category.color || '#84cc16');
    setIcon(category.icon || '📁');
    setOrder(category.order);
    setIsActive(category.is_active);
    setSeoTitle(category.seo_title || '');
    setSeoDescription(category.seo_description || '');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      alert('Name and slug are required');
      return;
    }

    const payload = {
      name,
      slug,
      description,
      color,
      icon,
      order,
      is_active: isActive,
      seo_title: seoTitle,
      seo_description: seoDescription,
    };

    try {
      const url = editingCategory
        ? `/api/admin/blog/categories/${editingCategory.id}`
        : '/api/admin/blog/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        loadCategories();
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to save category');
      }
    } catch (err) {
      alert('Failed to save category');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/blog/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        loadCategories();
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to delete category');
      }
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const generateSlug = () => {
    const generated = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generated);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Categories</h1>
          <p className="text-slate-600">
            Organize your blog posts with categories
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Card className="p-8 text-center col-span-full">
            <div className="animate-spin w-8 h-8 border-4 border-lime border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-600">Loading categories...</p>
          </Card>
        ) : categories.length === 0 ? (
          <Card className="p-8 text-center col-span-full">
            <Folder className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No categories yet</p>
            <Button onClick={() => setShowModal(true)}>Create First Category</Button>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-slate-500">{category.post_count} posts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {category.is_active ? (
                    <span title="Active" aria-label="Active">
                      <Eye className="w-4 h-4 text-green-600" aria-hidden="true" />
                    </span>
                  ) : (
                    <span title="Inactive" aria-label="Inactive">
                      <EyeOff className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    </span>
                  )}
                </div>
              </div>

              {category.description && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => handleEdit(category)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(category.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                    onBlur={generateSlug}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <div className="flex gap-2">
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="category-slug"
                    />
                    <Button onClick={generateSlug} variant="outline" size="sm">
                      Generate
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this category"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                    <Input
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="📁"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Order</label>
                    <Input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-8">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-lime focus:ring-lime"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Active
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-medium mb-4">SEO Settings</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">SEO Title</label>
                      <Input
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder={name || 'Category SEO title'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">SEO Description</label>
                      <textarea
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="SEO meta description"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button onClick={handleSave} className="flex-1">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
