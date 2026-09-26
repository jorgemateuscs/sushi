import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { supabase } from '../../lib/supabase';
import { getPhoneValidationError, isValidName } from '../../lib/validators';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Phone } from 'lucide-react';

export default function ClientAuthPage() {
  const { clientPhone, setClientPhone } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/checkout';

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'register'>('phone');

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  if (clientPhone) {
    return <Navigate to={from} replace />;
  }

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length === 0) return '';
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.substring(0, 2)}) ${v.substring(2)}`;
    if (v.length <= 10) return `(${v.substring(0, 2)}) ${v.substring(2, 6)}-${v.substring(6)}`;
    return `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
    if (phoneError) setPhoneError(null);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    const errorMsg = getPhoneValidationError(phone);
    if (errorMsg) {
      setPhoneError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    setLoading(true);
    const cleanPhone = phone.replace(/\D/g, '');
    const { data, error } = await supabase.from('customers').select('*').eq('phone', cleanPhone).single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is not found
      toast.error('Erro ao buscar telefone', { description: error.message });
      setLoading(false);
      return;
    }

    if (data) {
      // Exists
      setClientPhone(cleanPhone);
      toast.success(`Bem-vindo(a) de volta, ${data.full_name.split(' ')[0]}!`);
      navigate(from);
    } else {
      // New user
      setStep('register');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (!isValidName(name)) {
      toast.error('Informe seu nome completo (ao menos nome e sobrenome).');
      return;
    }

    setLoading(true);
    const cleanPhone = phone.replace(/\D/g, '');
    const { error } = await supabase.from('customers').insert({
      phone: cleanPhone,
      full_name: name
    });

    if (error) {
      toast.error('Erro ao cadastrar', { description: error.message });
      setLoading(false);
      return;
    }

    setClientPhone(cleanPhone);
    toast.success('Cadastro realizado com sucesso!');
    navigate(from);
  };

  return (
    <div className="container mx-auto p-4 py-12 flex justify-center">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Identificação</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Insira seu número de WhatsApp para continuar.' 
              : 'Parece que você é novo por aqui. Qual seu nome?'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp / Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={phoneError ? 'border-red-500' : ''}
                  required
                />
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading || phone.replace(/\D/g, '').length < 10}>
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp / Telefone</Label>
                <Input id="phone" value={phone} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Finalizar Cadastro'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep('phone')} disabled={loading}>
                Voltar
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
