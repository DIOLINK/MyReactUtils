export interface PasswordRules {
  min?: number;
  max?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numeric?: boolean;
  special?: boolean;
}

const defaultRules: Required<PasswordRules> = {
  min: 8,
  max: 128,
  uppercase: true,
  lowercase: true,
  numeric: true,
  special: false,
};

/** Email simple pero práctico */
export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Password con reglas configurables */
export const isPassword = (
  value: string,
  rules: PasswordRules = defaultRules
): boolean => {
  const r = { ...defaultRules, ...rules };

  if (value.length < r.min || value.length > r.max) return false;
  if (r.uppercase && !/[A-Z]/.test(value)) return false;
  if (r.lowercase && !/[a-z]/.test(value)) return false;
  if (r.numeric && !/\d/.test(value)) return false;
  if (r.special && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;

  return true;
};
