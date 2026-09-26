export const isValidBrazilianPhone = (phone: string) => {
  const clean = phone.replace(/\D/g, '');
  
  // Garante tamanho exato de 10 ou 11 dígitos
  if (clean.length !== 10 && clean.length !== 11) return false;
  
  // Rejeita sequências com todos os dígitos iguais
  if (/^(\d)\1+$/.test(clean)) return false;
  
  // Valida se os 2 primeiros dígitos correspondem a um DDD brasileiro válido
  const ddd = parseInt(clean.substring(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  
  // Para números de celulares, valida se o terceiro dígito é 9
  if (clean.length === 11 && clean[2] !== '9') return false;
  
  return true;
};

export const isValidName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  // Exija nome com pelo menos 3 caracteres e duas palavras
  if (parts.length < 2) return false;
  if (parts[0].length < 3) return false;
  return true;
};
