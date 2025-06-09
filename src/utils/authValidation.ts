
export const validateAuthInput = (email: string, password: string) => {
  if (!email || !password) {
    return 'Tous les champs sont requis';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Format d\'email invalide';
  }
  
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  
  return null;
};
