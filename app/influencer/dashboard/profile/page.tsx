"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import CloudinaryUploadField from "@/components/ui/CloudinaryUploadField";
import { User, Save, Edit3, RefreshCw, Globe, MapPin, Link } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function InfluencerProfilePage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    category: "Influencer",
    locationCity: "",
    locationCountry: "",
    socialInstagram: "",
    socialTwitter: "",
    socialFacebook: "",
    socialLinkedin: "",
    website: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setAvatar(d.profile.avatar || "");
          setForm({
            displayName: d.profile.display_name || "",
            bio: d.profile.bio || "",
            category: "Influencer",
            locationCity: d.profile.location_city || "",
            locationCountry: d.profile.location_country || "",
            socialInstagram: d.profile.social_instagram || "",
            socialTwitter: d.profile.social_twitter || "",
            socialFacebook: d.profile.social_facebook || "",
            socialLinkedin: d.profile.social_linkedin || "",
            website: d.profile.website || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const profilePayload: any = {
        display_name: form.displayName,
        bio: form.bio,
        location_city: form.locationCity,
        location_country: form.locationCountry,
        social_instagram: form.socialInstagram || undefined,
        social_twitter: form.socialTwitter || undefined,
        social_facebook: form.socialFacebook || undefined,
        social_linkedin: form.socialLinkedin || undefined,
        website: form.website || undefined,
      };

      const marketplacePayload: any = {
        category: form.category,
        bio: form.bio,
        location_city: form.locationCity,
        location_country: form.locationCountry,
        social_links: Object.fromEntries(
          Object.entries({
            instagram: form.socialInstagram,
            twitter: form.socialTwitter,
            facebook: form.socialFacebook,
            linkedin: form.socialLinkedin,
            website: form.website,
          }).filter(([, v]) => v)
        ),
      };

      const [profileRes, marketRes] = await Promise.all([
        fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...profilePayload, avatar }),
        }),
        fetch("/api/marketplace/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(marketplacePayload),
        }),
      ]);

      if (profileRes.ok || marketRes.ok) {
        addToast("Profile saved successfully!", { type: "success" });
        setEditMode(false);
      } else {
        addToast("Failed to save profile", { type: "error" });
      }
    } catch {
      addToast("Failed to save profile", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-gray-300" /></div>;
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Influencer Profile</h1>
          <p className="text-gray-500 mt-1">Manage your public profile and social presence</p>
        </div>
        {!editMode && (
          <Button onClick={() => setEditMode(true)}>
            <Edit3 className="w-4 h-4 mr-2" />Edit Profile
          </Button>
        )}
      </div>

      {editMode ? (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />Basic Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
              <CloudinaryUploadField
                label="Profile Image"
                value={avatar}
                onChange={setAvatar}
                folder="guestly/profiles/influencers"
                accept="image/*"
                placeholder="Upload profile image"
              />
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  className={inputClass}
                  placeholder="Tell organizers about yourself, your reach, and your niche"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={form.locationCity}
                  onChange={(e) => setForm({ ...form, locationCity: e.target.value })}
                  placeholder="e.g., Lagos"
                />
                <Input
                  label="Country"
                  value={form.locationCountry}
                  onChange={(e) => setForm({ ...form, locationCountry: e.target.value })}
                  placeholder="e.g., Nigeria"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-dark mb-4">Social Links</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <InstagramIcon className="w-5 h-5 text-pink-500 shrink-0" />
                <Input
                  label="Instagram"
                  value={form.socialInstagram}
                  onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })}
                  placeholder="@username or full URL"
                />
              </div>
              <div className="flex items-center gap-3">
                <TwitterIcon className="w-5 h-5 text-blue-400 shrink-0" />
                <Input
                  label="Twitter / X"
                  value={form.socialTwitter}
                  onChange={(e) => setForm({ ...form, socialTwitter: e.target.value })}
                  placeholder="@username or full URL"
                />
              </div>
              <div className="flex items-center gap-3">
                <FacebookIcon className="w-5 h-5 text-blue-600 shrink-0" />
                <Input
                  label="Facebook"
                  value={form.socialFacebook}
                  onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })}
                  placeholder="Page URL"
                />
              </div>
              <div className="flex items-center gap-3">
                <LinkedinIcon className="w-5 h-5 text-blue-700 shrink-0" />
                <Input
                  label="LinkedIn"
                  value={form.socialLinkedin}
                  onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })}
                  placeholder="Profile URL"
                />
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400 shrink-0" />
                <Input
                  label="Website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}>
              <Save className="w-4 h-4 mr-2" />Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditMode(false)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-5 mb-5">
              {avatar ? (
                <img src={avatar} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-lime/10 text-3xl font-bold text-dark">
                  {form.displayName?.charAt(0).toUpperCase() || "I"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-dark">{form.displayName || "Your Name"}</h2>
                <p className="text-sm text-gray-500">{form.category}</p>
                {(form.locationCity || form.locationCountry) && (
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {[form.locationCity, form.locationCountry].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
            {form.bio && (
              <div>
                <h3 className="text-sm font-semibold text-dark mb-1.5">About</h3>
                <p className="text-sm text-gray-500">{form.bio}</p>
              </div>
            )}
          </Card>

          {(form.socialInstagram || form.socialTwitter || form.socialFacebook || form.socialLinkedin || form.website) && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-dark mb-4">Social Links</h3>
              <div className="space-y-2">
                {form.socialInstagram && (
                  <a href={form.socialInstagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-dark">
                    <InstagramIcon className="w-4 h-4 text-pink-500" />Instagram
                  </a>
                )}
                {form.socialTwitter && (
                  <a href={form.socialTwitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-dark">
                    <TwitterIcon className="w-4 h-4 text-blue-400" />Twitter / X
                  </a>
                )}
                {form.socialFacebook && (
                  <a href={form.socialFacebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-dark">
                    <FacebookIcon className="w-4 h-4 text-blue-600" />Facebook
                  </a>
                )}
                {form.socialLinkedin && (
                  <a href={form.socialLinkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-dark">
                    <LinkedinIcon className="w-4 h-4 text-blue-700" />LinkedIn
                  </a>
                )}
                {form.website && (
                  <a href={form.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-dark">
                    <Globe className="w-4 h-4 text-gray-400" />Website
                  </a>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
