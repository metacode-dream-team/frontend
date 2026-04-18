/**
 * Утилиты для валидации
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): boolean {
  return password === confirmPassword;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateUsernameIdentifier(id: string): boolean {
  return /^[a-zA-Z0-9._-]{3,64}$/.test(id);
}

export function validateLoginForm(
  identifier: string,
  password: string,
): ValidationResult {
  const errors: string[] = [];

  if (!identifier.trim()) {
    errors.push("Email or username is required");
  } else if (identifier.includes("@")) {
    if (!validateEmail(identifier)) {
      errors.push("Invalid email format");
    }
  } else if (!validateUsernameIdentifier(identifier)) {
    errors.push(
      "Username must be 3–64 characters (letters, digits, . _ -)",
    );
  }

  if (!password) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRegisterForm(
  email: string,
  password: string,
  confirmPassword: string,
): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push("Email is required");
  } else if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (!validatePassword(password)) {
    errors.push("Password must be at least 8 characters");
  }

  if (!confirmPassword) {
    errors.push("Password confirmation is required");
  } else if (!validatePasswordMatch(password, confirmPassword)) {
    errors.push("Passwords do not match");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateResetPasswordForm(
  newPassword: string,
  confirmPassword: string,
): ValidationResult {
  const errors: string[] = [];

  if (!newPassword) {
    errors.push("New password is required");
  } else if (!validatePassword(newPassword)) {
    errors.push("Password must be at least 8 characters");
  }

  if (!confirmPassword) {
    errors.push("Password confirmation is required");
  } else if (!validatePasswordMatch(newPassword, confirmPassword)) {
    errors.push("Passwords do not match");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
