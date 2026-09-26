import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, CreditCard, Copy, Check } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { supabase } from '../../lib/supabase';
import { STORE_PIX_KEY } from '../../data/seed';
import { isValidBrazilianPhone, isValidName } from '../../lib/validators';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

export default function CheckoutPage() {
  const { cart, cartNotes, formatCurrency, DELIVERY_FEE, createOrder, clientPhone, clientProfile, setClientPhone, setClientProfile } = useStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    referencia: '',
  });

  React.useEffect(() => {
    if (clientProfile) {
      setCustomer({
        name: clientProfile.full_name || '',
        phone: clientProfile.phone || '',
        bairro: clientProfile.address_neighborhood || '',
        rua: clientProfile.address_street || '',
        numero: clientProfile.address_number || '',
        complemento: '',
        referencia: clientProfile.address_reference || '',
      });
    } else if (clientPhone) {
      setCustomer(prev => ({ ...prev, phone: clientPhone }));
    }
  }, [clientProfile, clientPhone]);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [changeFor, setChangeFor] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingPhone, setIsSearchingPhone] = useState(false);

  const handlePhoneBlur = async () => {
    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      setIsSearchingPhone(true);
      const { data } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', cleanPhone)
        .maybeSingle();
      
      if (data) {
        setCustomer(prev => ({
          ...prev,
          name: data.full_name || prev.name,
          bairro: data.address_neighborhood || prev.bairro,
          rua: data.address_street || prev.rua,
          numero: data.address_number || prev.numero,
          referencia: data.address_reference || prev.referencia,
        }));
        
        toast.success(`Bem-vindo de volta, ${data.full_name?.split(' ')[0] || 'Cliente'}!`);
        
        const customerProfileData = {
          id: data.id,
          name: data.full_name,
          phone: data.phone,
          address: `${data.address_street || ''}, ${data.address_number || ''} - ${data.address_neighborhood || ''}`,
          full_name: data.full_name,
          address_street: data.address_street,
          address_number: data.address_number,
          address_neighborhood: data.address_neighborhood,
          address_reference: data.address_reference
        };
        localStorage.setItem('mearim_customer_profile', JSON.stringify(customerProfileData));
        
        if (setClientProfile) setClientProfile(customerProfileData);
        if (setClientPhone) setClientPhone(data.phone);
      }
      setIsSearchingPhone(false);
    }
  };

  const subtotal = cart.reduce((sum: number, item: any) => sum + item.total, 0);
  const total = subtotal + DELIVERY_FEE;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }));

  const isFormValid =
    customer.name.trim() &&
    customer.phone.trim() &&
    customer.bairro.trim() &&
    customer.rua.trim() &&
    customer.numero.trim() &&
    paymentMethod;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(STORE_PIX_KEY).then(() => {
      setPixCopied(true);
      toast.success('Chave Pix copiada!');
      setTimeout(() => setPixCopied(false), 3000);
    });
  };

  const [submitHistory, setSubmitHistory] = useState<{time: number, phone: string}[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    if (!isValidBrazilianPhone(customer.phone)) {
      toast.error('Número de telefone inválido. Verifique o DDD e os dígitos.');
      return;
    }

    if (!isValidName(customer.name)) {
      toast.error('Por favor, informe seu nome completo (nome e sobrenome).');
      return;
    }

    // Rate Limiting (Prevenção de Abuso Local)
    const now = Date.now();
    const tenMinsAgo = now - 10 * 60 * 1000;
    const recentSubmits = submitHistory.filter(s => s.time > tenMinsAgo);
    
    const uniquePhones = new Set(recentSubmits.map(s => s.phone)).size;
    if (uniquePhones >= 3 && !recentSubmits.some(s => s.phone === customer.phone)) {
      toast.error('Bloqueio de segurança: Foram detetados demasiados números diferentes. Aguarde 10 minutos.');
      return;
    }
    
    setSubmitHistory([...recentSubmits, { time: now, phone: customer.phone }]);
    setIsSubmitting(true);

    // Sanitize phone (only numbers)
    const sanitizedPhone = customer.phone.replace(/\D/g, '');

    const payment = {
      method: paymentMethod,
      ...(paymentMethod === 'dinheiro' && changeFor ? { changeFor: parseFloat(changeFor) } : {}),
    };

    try {
      await createOrder({ ...customer, phone: sanitizedPhone }, payment);
      toast.success('Pedido realizado com sucesso! 🎉');
      navigate('/cliente/perfil', { replace: true });
    } catch (error) {
      // Error already toasted in Context
    } finally {
      setTimeout(() => setIsSubmitting(false), 4000);
    }
  };

  if (cart.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 font-medium text-sm transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Voltar ao cardápio
      </Link>
      
      <h1 className="text-2xl font-bold mb-8">🧾 Finalizar Pedido</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={18} className="text-primary" /> Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={customer.name}
                onChange={handleChange('name')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={customer.phone}
                onChange={handleChange('phone')}
                onBlur={handlePhoneBlur}
                disabled={isSearchingPhone}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> Endereço de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                placeholder="Nome do bairro"
                value={customer.bairro}
                onChange={handleChange('bairro')}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="rua">Rua *</Label>
                <Input
                  id="rua"
                  placeholder="Nome da rua"
                  value={customer.rua}
                  onChange={handleChange('rua')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  placeholder="Nº"
                  value={customer.numero}
                  onChange={handleChange('numero')}
                  required
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  placeholder="Apto, bloco..."
                  value={customer.complemento}
                  onChange={handleChange('complemento')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referencia">Ponto de referência</Label>
                <Input
                  id="referencia"
                  placeholder="Próximo a..."
                  value={customer.referencia}
                  onChange={handleChange('referencia')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard size={18} className="text-primary" /> Forma de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: 'pix', icon: '📱', label: 'Pix' },
                { id: 'cartao', icon: '💳', label: 'Cartão (entrega)' },
                { id: 'dinheiro', icon: '💵', label: 'Dinheiro' },
              ].map((method) => (
                <div
                  key={method.id}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === method.id 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border bg-card text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-semibold text-sm">{method.label}</span>
                </div>
              ))}
            </div>

            {/* Pix details */}
            {paymentMethod === 'pix' && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Faça o Pix para a chave abaixo e envie o comprovante pelo WhatsApp:
                </p>
                <div className="flex items-center gap-2 bg-background p-2 pr-1 rounded-md border border-border">
                  <code className="flex-1 px-2 font-mono text-sm">{STORE_PIX_KEY}</code>
                  <Button type="button" size="sm" variant="secondary" onClick={handleCopyPix}>
                    {pixCopied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                    {pixCopied ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </div>
            )}

            {/* Change for cash */}
            {paymentMethod === 'dinheiro' && (
              <div className="space-y-2">
                <Label htmlFor="changeFor">Troco para quanto?</Label>
                <Input
                  id="changeFor"
                  type="number"
                  placeholder={`Total: ${formatCurrency(total)}`}
                  value={changeFor}
                  onChange={(e) => setChangeFor(e.target.value)}
                  min={total}
                  step="0.01"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📋 Resumo do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{item.quantity}x</span> {item.product.name}
                    {item.selectedExtras.length > 0 && (
                      <span className="text-xs ml-1">
                        ({item.selectedExtras.map((e: any) => e.name).join(', ')})
                      </span>
                    )}
                  </span>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
            
            {cartNotes && (
              <div className="mb-4 p-3 bg-background rounded-md text-sm border border-border text-muted-foreground italic">
                Obs: {cartNotes}
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxa de entrega</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 text-primary">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-bold"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'A processar pedido...' : `🚀 Confirmar Pedido — ${formatCurrency(total)}`}
        </Button>
      </form>
    </div>
  );
}
