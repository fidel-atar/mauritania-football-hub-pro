
// Security utility for input validation and sanitization
export const sanitizeHtml = (input: string): string => {
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
  // Mauritanian phone number validation (more comprehensive)
  const cleanPhone = phone.replace(/\s/g, '');
  
  // Check for Mauritanian format: +222XXXXXXXX or 222XXXXXXXX
  const mauritanianRegex = /^(\+222|222)[2-7]\d{7}$/;
  
  return mauritanianRegex.test(cleanPhone);
};

export const sanitizeTextInput = (input: string, maxLength: number = 1000): string => {
  return sanitizeHtml(input.trim()).substring(0, maxLength);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('222')) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.startsWith('22') && cleanPhone.length >= 8) {
    return `+2${cleanPhone}`;
  } else if (cleanPhone.length >= 8) {
    return `+222${cleanPhone}`;
  }
  
  return phone;
};
