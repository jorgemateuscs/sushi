interface PhoneAttempt {
  phone: string;
  timestamp: number;
}

const WINDOW_MS = 30 * 60 * 1000; // 30 minutos
const MAX_DISTINCT_PHONES = 3;
const STORAGE_KEY = 'device_phone_history';

export function validateDevicePhoneAttempt(newPhone: string): { 
  allowed: boolean; 
  waitMinutes: number; 
  message?: string 
} {
  const clean = newPhone.replace(/\D/g, '');
  const now = Date.now();

  let history: PhoneAttempt[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) history = JSON.parse(stored);
  } catch {
    history = [];
  }

  // Mantém apenas o histórico dentro da janela de 30 minutos
  history = history.filter(item => now - item.timestamp < WINDOW_MS);

  // Lista de números distintos testados recentemente
  const distinctPhones = Array.from(new Set(history.map(item => item.phone)));

  // Se o número digitado já faz parte dos testados recentemente, permite (é o mesmo usuário)
  if (distinctPhones.includes(clean)) {
    return { allowed: true, waitMinutes: 0 };
  }

  // Se for um novo número e o limite de números diferentes foi atingido:
  if (distinctPhones.length >= MAX_DISTINCT_PHONES) {
    const oldestAttempt = Math.min(...history.map(h => h.timestamp));
    const waitMinutes = Math.max(1, Math.ceil((oldestAttempt + WINDOW_MS - now) / 60000));
    return {
      allowed: false,
      waitMinutes,
      message: `Por motivos de segurança, este dispositivo atingiu o limite de números diferentes testados. Aguarde ${waitMinutes} minuto(s) para tentar com outro telefone.`
    };
  }

  return { allowed: true, waitMinutes: 0 };
}

export function recordDevicePhoneAttempt(phone: string): void {
  const clean = phone.replace(/\D/g, '');
  const now = Date.now();

  let history: PhoneAttempt[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) history = JSON.parse(stored);
  } catch {
    history = [];
  }

  history = history.filter(item => now - item.timestamp < WINDOW_MS);
  history.push({ phone: clean, timestamp: now });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
