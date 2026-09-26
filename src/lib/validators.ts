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

export function getPhoneValidationError(phone: string): string | null {
  const clean = phone.replace(/\D/g, '');
  
  if (!clean) return 'Por favor, informe seu número de WhatsApp.';
  if (clean.length < 10) return `Número incompleto. Faltam ${10 - clean.length} dígitos.`;
  if (clean.length > 11) return 'Número muito longo. Informe no máximo 11 dígitos.';
  if (/^(\d)\1+$/.test(clean)) return 'Número inválido (dígitos repetidos).';
  
  const ddd = parseInt(clean.substring(0, 2), 10);
  const validDDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 24, 27, 28,
    31, 32, 33, 34, 35, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48, 49,
    51, 53, 54, 55,
    61, 62, 63, 64, 65, 66, 67, 68, 69,
    71, 73, 74, 75, 77, 79,
    81, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 93, 94, 95, 96, 97, 98, 99
  ];
  if (!validDDDs.includes(ddd)) return `O DDD (${ddd}) não é válido no Brasil.`;
  
  if (clean.length === 11 && clean[2] !== '9') {
    return 'Para celulares com 11 dígitos, o número após o DDD deve começar com 9.';
  }
  
  return null;
}
