"use client";

import { VendorProfile } from "@/lib/store";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

interface VendorCardProps {
  vendor: VendorProfile;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const categoryIcons: Record<VendorProfile["category"], string> = {
    Sound: "music",
    Security: "shield",
    Decoration: "palette",
    Catering: "package",
    Photography: "camera",
    Logistics: "package",
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow ${
      vendor.subscription && vendor.subscription.expiresAt > Date.now()
        ? "border-2 border-primary-500/30 bg-gradient-to-br from-primary-500/5 to-transparent"
        : ""
    }`}>
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
          <Icon name={categoryIcons[vendor.category] as any} size={24} className="text-primary-600" />
        </div>

        {/* Vendor Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {vendor.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-foreground-muted">{vendor.category}</p>
                {vendor.city && (
                  <>
                    <span className="text-foreground-muted">•</span>
                    <p className="text-sm text-foreground-muted flex items-center gap-1">
                      <Icon name="home" size={12} />
                      {vendor.city}
                    </p>
                  </>
                )}
              </div>
            </div>
            {vendor.subscription && vendor.subscription.expiresAt > Date.now() && (
              <div className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium
              </div>
            )}
          </div>

          {/* Rating and Stats */}
          {(vendor.rating || vendor.completedEvents) && (
            <div className="flex items-center gap-4 mb-3">
              {vendor.rating && (
                <div className="flex items-center gap-1">
                  <Icon name="star" size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    {vendor.rating.toFixed(1)}
                  </span>
                  {vendor.reviewCount && (
                    <span className="text-xs text-foreground-muted">
                      ({vendor.reviewCount})
                    </span>
                  )}
                </div>
              )}
              {vendor.completedEvents && (
                <div className="flex items-center gap-1 text-sm text-foreground-muted">
                  <Icon name="check" size={14} />
                  <span>{vendor.completedEvents} events</span>
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
            {vendor.description}
          </p>

          {/* Services */}
          {vendor.services && vendor.services.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {vendor.services.slice(0, 3).map((service, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-surface-card border border-surface-border text-foreground-muted rounded"
                  >
                    {service}
                  </span>
                ))}
                {vendor.services.length > 3 && (
                  <span className="px-2 py-1 text-xs text-foreground-muted">
                    +{vendor.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-col gap-1 mb-4 text-sm">
            <div className="flex items-center gap-2 text-foreground-muted">
              <Icon name="document" size={14} />
              <a
                href={`mailto:${vendor.contactEmail}`}
                className="hover:text-primary-600 transition-colors"
              >
                {vendor.contactEmail}
              </a>
            </div>
            <div className="flex items-center gap-2 text-foreground-muted">
              <Icon name="document" size={14} />
              <a
                href={`tel:${vendor.contactPhone}`}
                className="hover:text-primary-600 transition-colors"
              >
                {vendor.contactPhone}
              </a>
            </div>
          </div>

          {/* Portfolio Preview */}
          {vendor.portfolio && vendor.portfolio.length > 0 && (
            <div className="flex gap-2 mb-4">
              {vendor.portfolio.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 bg-neutral-200 rounded-md overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200" />
                </div>
              ))}
              {vendor.portfolio.length > 3 && (
                <div className="w-16 h-16 bg-neutral-200 rounded-md flex items-center justify-center text-xs text-foreground-muted">
                  +{vendor.portfolio.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.href = `/vendors/${vendor.id}`}
            >
              View Profile
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.href = `mailto:${vendor.contactEmail}`}
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
