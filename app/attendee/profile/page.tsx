"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/ToastProvider";
import CloudinaryUploadField from "@/components/ui/CloudinaryUploadField";
import { DEFAULT_PLATFORM_CATALOG, PlatformCatalog, normalizeCatalog } from "@/lib/platformCatalog";

type UserProfile = {
  id: string;
  email: string;
  display_name: string;
  avatar?: string | null;
  bio?: string | null;
  location_city?: string | null;
  location_country?: string | null;
  social_twitter?: string | null;
  social_instagram?: string | null;
  social_linkedin?: string | null;
  interests: string[];
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const viewingUserId = searchParams.get("userId");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatar, setAvatar] = useState("");
  const [catalog, setCatalog] = useState<PlatformCatalog>(DEFAULT_PLATFORM_CATALOG);

  const isOwnProfile = !viewingUserId || viewingUserId === currentUserId;

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.user) {
          setCurrentUserId(d.user.id);
          const targetUserId = viewingUserId || d.user.id;
          fetchProfile(targetUserId);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [viewingUserId]);

  useEffect(() => {
    fetch("/api/platform/catalog")
      .then((res) => res.json())
      .then((data) => setCatalog(normalizeCatalog(data)))
      .catch(() => setCatalog(DEFAULT_PLATFORM_CATALOG));
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}/profile`);
      const data = await res.json();

      if (res.ok && data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
        setInterests(data.interests || []);
        setCity(data.location_city || "");
        setCountry(data.location_country || "");
          setTwitter(data.social_twitter || "");
          setInstagram(data.social_instagram || "");
          setLinkedin(data.social_linkedin || "");
          setAvatar(data.avatar || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUserId) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${currentUserId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          avatar: avatar || null,
          bio,
          interests,
          location_city: city || null,
          location_country: country || null,
          social_twitter: twitter || null,
          social_instagram: instagram || null,
          social_linkedin: linkedin || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setIsEditing(false);
        addToast("Profile saved successfully!", { type: "success" });
      } else {
        addToast("Failed to save profile", { type: "error" });
      }
    } catch {
      addToast("Something went wrong while saving", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
        <div className="h-64 bg-neutral-100 rounded-xl" />
        <div className="h-48 bg-neutral-100 rounded-xl" />
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
        <p className="text-neutral-500 mb-4">Please log in to view your profile.</p>
        <Button onClick={() => (window.location.href = "/login")}>Sign In</Button>
      </div>
    );
  }

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() || "U";

  const avatarUrl = profile?.avatar
    ? profile.avatar.startsWith("http")
      ? profile.avatar
      : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}${profile.avatar}`
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {isOwnProfile ? "My Profile" : `${profile?.display_name || "User"}'s Profile`}
          </h1>
          <p className="mt-1 text-neutral-500">Manage your personal information</p>
        </div>
        {isOwnProfile ? (
          !isEditing ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleLogout}>Logout</Button>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  if (profile) {
                    setDisplayName(profile.display_name || "");
                    setBio(profile.bio || "");
                    setInterests(profile.interests || []);
                    setCity(profile.location_city || "");
                    setCountry(profile.location_country || "");
                    setTwitter(profile.social_twitter || "");
                    setInstagram(profile.social_instagram || "");
                    setLinkedin(profile.social_linkedin || "");
                    setAvatar(profile.avatar || "");
                  }
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} loading={saving}>
                Save Changes
              </Button>
            </div>
          )
        ) : null}
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-lime/20 flex items-center justify-center text-dark text-2xl font-bold">
              {initials}
        </div>
      )}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">{profile?.display_name || "User"}</h2>
            <p className="text-sm text-neutral-500">{profile?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-lime/10 text-dark rounded-full text-xs font-medium capitalize">
              {profile?.role}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Profile Information</h3>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />

            <CloudinaryUploadField
              label="Profile Image"
              value={avatar}
              onChange={setAvatar}
              folder="guestly/profiles/attendees"
              accept="image/*"
              placeholder="Upload profile image"
            />

            <Textarea
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Country</label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setCity("");
                  }}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20"
                >
                  <option value="">Select country</option>
                  {catalog.countries.filter(item => item.isActive).map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20"
                >
                  <option value="">Select city</option>
                  {catalog.cities.filter(item => item.isActive && (!country || item.countryName === country)).map(item => <option key={item.slug} value={item.name}>{item.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Interests
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="Add an interest..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                />
                <Button onClick={handleAddInterest} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-lime/10 text-dark rounded-full text-sm"
                  >
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:text-dark/60"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-700">Social Links</h4>
              <Input
                label="Twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@username"
              />
              <Input
                label="Instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
              />
              <Input
                label="LinkedIn"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-1">Display Name</h4>
              <p className="text-neutral-900">{profile?.display_name || "Not set"}</p>
            </div>

            {profile?.bio && (
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-1">Bio</h4>
                <p className="text-neutral-900">{profile.bio}</p>
              </div>
            )}

            {(profile?.location_city || profile?.location_country) && (
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-1">Location</h4>
                <p className="text-neutral-900">
                  {profile.location_city}
                  {profile.location_city && profile.location_country && ", "}
                  {profile.location_country}
                </p>
              </div>
            )}

            {profile?.interests && profile.interests.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-lime/10 text-dark rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(profile?.social_twitter || profile?.social_instagram || profile?.social_linkedin) && (
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Social Links</h4>
                <div className="space-y-1">
                  {profile.social_twitter && (
                    <p className="text-neutral-900">Twitter: {profile.social_twitter}</p>
                  )}
                  {profile.social_instagram && (
                    <p className="text-neutral-900">Instagram: {profile.social_instagram}</p>
                  )}
                  {profile.social_linkedin && (
                    <p className="text-neutral-900">LinkedIn: {profile.social_linkedin}</p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100">
              <p className="text-sm text-neutral-500">
                Member since {new Date(profile?.created_at || "").toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-neutral-400">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
