"use client";
import React from "react";
import Input from "@/components/ui/Input";
import type { ShippingAddress } from "@/types/merchandise";

interface ShippingAddressFormProps {
  value: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  errors?: Partial<Record<keyof ShippingAddress, string>>;
}

export default function ShippingAddressForm({ value, onChange, errors = {} }: ShippingAddressFormProps) {
  const handleChange = (field: keyof ShippingAddress, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">
        Shipping Address
      </h3>
      
      <Input
        label="Full Name"
        value={value.fullName}
        onChange={(e) => handleChange("fullName", e.currentTarget.value)}
        error={errors.fullName}
        required
        placeholder="John Doe"
        autoComplete="name"
        inputMode="text"
      />

      <Input
        label="Address Line 1"
        value={value.addressLine1}
        onChange={(e) => handleChange("addressLine1", e.currentTarget.value)}
        error={errors.addressLine1}
        required
        placeholder="123 Main Street"
        autoComplete="address-line1"
        inputMode="text"
      />

      <Input
        label="Address Line 2 (Optional)"
        value={value.addressLine2 || ""}
        onChange={(e) => handleChange("addressLine2", e.currentTarget.value)}
        placeholder="Apt 4B"
        autoComplete="address-line2"
        inputMode="text"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          value={value.city}
          onChange={(e) => handleChange("city", e.currentTarget.value)}
          error={errors.city}
          required
          placeholder="Lagos"
          autoComplete="address-level2"
          inputMode="text"
        />

        <Input
          label="State/Province"
          value={value.state}
          onChange={(e) => handleChange("state", e.currentTarget.value)}
          error={errors.state}
          required
          placeholder="Lagos State"
          autoComplete="address-level1"
          inputMode="text"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Postal Code"
          value={value.postalCode}
          onChange={(e) => handleChange("postalCode", e.currentTarget.value)}
          error={errors.postalCode}
          required
          placeholder="100001"
          autoComplete="postal-code"
          inputMode="numeric"
        />

        <Input
          label="Country"
          value={value.country}
          onChange={(e) => handleChange("country", e.currentTarget.value)}
          error={errors.country}
          required
          placeholder="Nigeria"
          autoComplete="country-name"
          inputMode="text"
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        value={value.phone}
        onChange={(e) => handleChange("phone", e.currentTarget.value)}
        error={errors.phone}
        required
        placeholder="+234 800 000 0000"
        autoComplete="tel"
        inputMode="tel"
      />
    </div>
  );
}
