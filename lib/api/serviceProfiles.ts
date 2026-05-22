type ServiceProfileRecord = Record<string, unknown>;

export function toBackendServiceProfile(body: ServiceProfileRecord): ServiceProfileRecord {
  const data: ServiceProfileRecord = { ...body };

  if ("pricingModel" in data) {
    data.pricing_model = data.pricingModel;
    delete data.pricingModel;
  }
  if ("minBudget" in data) {
    data.min_budget = data.minBudget;
    delete data.minBudget;
  }
  if ("maxBudget" in data) {
    data.max_budget = data.maxBudget;
    delete data.maxBudget;
  }
  if ("bannerImage" in data) {
    data.banner_image = data.bannerImage;
    delete data.bannerImage;
  }
  if ("rateCardUrl" in data) {
    data.rate_card_url = data.rateCardUrl;
    delete data.rateCardUrl;
  }
  if ("portfolioUrl" in data) {
    data.portfolio_url = data.portfolioUrl;
    delete data.portfolioUrl;
  }
  if ("socialUrl" in data) {
    data.social_url = data.socialUrl;
    delete data.socialUrl;
  }
  if ("isActive" in data) {
    data.is_active = data.isActive;
    delete data.isActive;
  }

  for (const key of ["banner_image", "rate_card_url", "portfolio_url", "social_url"]) {
    if (data[key] === "") data[key] = null;
  }

  return data;
}

export function fromBackendServiceProfile(profile: ServiceProfileRecord): ServiceProfileRecord {
  return {
    ...profile,
    vendorId: profile.vendorId ?? profile.vendor_id,
    pricingModel: profile.pricingModel ?? profile.pricing_model,
    minBudget: profile.minBudget ?? profile.min_budget,
    maxBudget: profile.maxBudget ?? profile.max_budget,
    bannerImage: profile.bannerImage ?? profile.banner_image,
    rateCardUrl: profile.rateCardUrl ?? profile.rate_card_url,
    portfolioUrl: profile.portfolioUrl ?? profile.portfolio_url,
    socialUrl: profile.socialUrl ?? profile.social_url,
    isActive: profile.isActive ?? profile.is_active,
    createdAt: profile.createdAt ?? profile.created_at,
    updatedAt: profile.updatedAt ?? profile.updated_at,
  };
}
