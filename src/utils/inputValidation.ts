
// Security utility for input validation and sanitization
export const sanitizeHtml = (input: string): string => {
  // Basic HTML sanitization - replace potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Le mot de passe doit contenir au moins une lettre minuscule';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Le mot de passe doit contenir au moins une lettre majuscule';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Le mot de passe doit contenir au moins un chiffre';
  }
  return null;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Mauritanian phone number validation (simplified)
  const phoneRegex = /^(\+222|00222|222)?[234567]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const sanitizeTextInput = (input: string, maxLength: number = 1000): string => {
  return sanitizeHtml(input.trim()).substring(0, maxLength);
};
