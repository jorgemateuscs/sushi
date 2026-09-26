export function isValidBrazilianPhone(phone: string): boolean {
  const clean = phone.replace(/\D/g, '');
  
  // Tamanho estrito: 10 dígitos (fixo) ou 11 dígitos (celular)
  if (clean.length !== 10 && clean.length !== 11) return false;
  
  // Rejeita todos os dígitos iguais (ex: 11111111111, 0000000000)
  if (/^(\d)\1+$/.test(clean)) return false;
  
  // Valida DDD real (11 até 99)
  const ddd = parseInt(clean.substring(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  
  // Se for celular (11 dígitos), o terceiro dígito obrigatoriamente deve ser 9
  if (clean.length === 11 && clean[2] !== '9') return false;
  
  return true;
}

export function isValidName(name: string): boolean {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return false;
  if (parts[0].length < 3) return false;
  return true;
}
