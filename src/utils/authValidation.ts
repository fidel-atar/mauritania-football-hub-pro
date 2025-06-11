
import { validateEmail, validatePassword } from './inputValidation';

export const validateAuthInput = (email: string, password: string): string | null => {
  if (!email || !password) {
    return 'Veuillez remplir tous les champs';
  }

  if (!validateEmail(email)) {
    return 'Veuillez entrer une adresse email valide';
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return passwordError;
  }

  return null;
};
