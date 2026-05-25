/**
 * Validators
 * Common validation utilities for the D2R application
 */

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate GSTIN (Indian GST Number) format
 * Format: 22AAAAA0000A1Z5
 */
export function isValidGSTIN(gstin: string): boolean {
  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim().toUpperCase());
}

/**
 * Validate PAN (Permanent Account Number) format
 * Format: AAAAA0000A
 */
export function isValidPAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.trim().toUpperCase());
}

/**
 * Validate Indian phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Allow 10 digits or 12 digits (with country code)
  return (
    cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith("91"))
  );
}

/**
 * Validate Indian PIN code
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode.trim());
}

/**
 * Validate AWB (Air Waybill) number format
 */
export function isValidAWB(awb: string): boolean {
  // AWB typically 10-12 alphanumeric characters
  const awbRegex = /^[A-Z0-9]{10,12}$/;
  return awbRegex.test(awb.trim().toUpperCase());
}

/**
 * Validate required string field
 */
export function isRequired(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Validate minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Validate maximum length
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

/**
 * Validate number is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate positive number
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Validate non-negative number
 */
export function isNonNegative(value: number): boolean {
  return value >= 0;
}

/**
 * Validate date is not in the past
 */
export function isNotPastDate(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

/**
 * Validate date is not in the future
 */
export function isNotFutureDate(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d <= new Date();
}

/**
 * Create a validation result object
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate form data against a set of rules
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, (value: unknown) => string | null>,
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field as keyof T]);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
