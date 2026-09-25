import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Package, User, Clock, ShoppingBag, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ClientProfilePage() {
  const { clientPhone, clientProfile, setClientPhone, clientOrders, fetchClientHistory, formatCurrency, addToCart } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'andamento' | 'perfil' | 'historico' | 'carrinho'>('andamento');

  // Profile Form
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    address_street: '',
    address_number: '',
    address_neighborhood: '',
    address_reference: ''
  });

  useEffect(() => {
    if (clientPhone) {
      fetchClientHistory(clientPhone);
    }
  }, [clientPhone]);

  // User's orders
  const myOrders = clientOrders || [];
  const activeOrder = myOrders.find((o: any) => !['delivered', 'cancelled'].includes(o.status));

  useEffect(() => {
    if (clientProfile) {
      setForm({
        full_name: clientProfile.full_name || '',
        address_street: clientProfile.address_street || '',
        address_number: clientProfile.address_number || '',
        address_neighborhood: clientProfile.address_neighborhood || '',
        address_reference: clientProfile.address_reference || ''
      });
    }
  }, [clientProfile]);

  const prevStatusRef = React.useRef(activeOrder?.status);

  useEffect(() => {
    if (activeOrder && activeOrder.status !== prevStatusRef.current) {
      if (activeOrder.status === 'out_for_delivery') {
        toast('🛵 Seu pedido saiu para entrega!', {
          description: 'O motoboy está a caminho do seu endereço.',
          duration: 8000,
          className: 'bg-primary text-primary-foreground border-primary',
        });

        // Tenta vibrar o celular
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }

        // Toca um som suave de notificação
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
          
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
          // Ignora se não puder tocar
        }
      }
      prevStatusRef.current = activeOrder.status;
    }
  }, [activeOrder?.status]);

  if (!clientPhone) {
    return <Navigate to="/" replace />;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('customers').update(form).eq('phone', clientPhone);
    if (error) {
      toast.error('Erro ao atualizar perfil', { description: error.message });
    } else {
      toast.success('Perfil atualizado com sucesso!');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setClientPhone(null);
    navigate('/');
  };

  const handleRepeatOrder = (order: any) => {
    order.items.forEach((item: any) => {
      const mockProduct = { id: item.product.id, name: item.product.name, price: item.unitPrice, image: '' };
      addToCart(mockProduct, item.quantity, []);
    });
    toast.success('Itens adicionados ao carrinho!');
    navigate('/checkout');
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'received': return 25;
      case 'preparing': return 50;
      case 'out_for_delivery': return 75;
      case 'delivered': return 100;
      case 'cancelled': return 100;
      default: return 0;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Recebido';
      case 'preparing': return 'Em Preparação';
      case 'out_for_delivery': return 'Saiu para Entrega';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const TabButton = ({ value, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
        activeTab === value
          ? 'bg-primary text-primary-foreground shadow'
          : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Olá, {clientProfile?.full_name?.split(' ')[0] || 'Cliente'}! 👋</h1>
          <p className="text-muted-foreground">Gerencie sua conta e acompanhe seus pedidos.</p>
        </div>
        <Button variant="outline" className="text-destructive" onClick={handleLogout}>Sair da conta</Button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-8 bg-muted/50 p-1 rounded-lg">
        <TabButton value="andamento" icon={Clock} label="Em Andamento" />
        <TabButton value="perfil" icon={User} label="Meu Perfil" />
        <TabButton value="historico" icon={Package} label="Histórico" />
        <TabButton value="carrinho" icon={ShoppingBag} label="Meu Carrinho" />
      </div>

      <div>
        {activeTab === 'andamento' && (
          <Card>
            <CardHeader>
              <CardTitle>Pedido em Andamento</CardTitle>
              <CardDescription>Acompanhe o status em tempo real.</CardDescription>
            </CardHeader>
            <CardContent>
              {activeOrder ? (
                <div>
                  <div className="mb-8">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-primary">{getStatusText(activeOrder.status)}</span>
                      <span>{getStatusProgress(activeOrder.status)}%</span>
                    </div>
                    <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${activeOrder.status === 'cancelled' ? 'bg-destructive' : 'bg-primary'}`} 
                        style={{ width: `${getStatusProgress(activeOrder.status)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Pedido #{activeOrder.orderNumber}</h4>
                    <ul className="space-y-2 mb-4">
                      {activeOrder.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span>{formatCurrency(item.total)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between font-bold border-t border-border pt-4">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(activeOrder.total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Nenhum pedido em andamento</h3>
                  <p className="text-muted-foreground mb-6">Que tal pedir um sushi fresquinho agora?</p>
                  <Button asChild><Link to="/">Ver Cardápio</Link></Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'perfil' && (
          <Card>
            <CardHeader>
              <CardTitle>Meus Dados</CardTitle>
              <CardDescription>Mantenha suas informações e endereço de entrega atualizados.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input id="full_name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp / Telefone</Label>
                    <Input id="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-4 text-lg">Endereço Padrão de Entrega</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address_street">Rua / Avenida</Label>
                      <Input id="address_street" value={form.address_street} onChange={e => setForm({...form, address_street: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address_number">Número</Label>
                      <Input id="address_number" value={form.address_number} onChange={e => setForm({...form, address_number: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="address_neighborhood">Bairro</Label>
                      <Input id="address_neighborhood" value={form.address_neighborhood} onChange={e => setForm({...form, address_neighborhood: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address_reference">Ponto de Referência</Label>
                      <Input id="address_reference" value={form.address_reference} onChange={e => setForm({...form, address_reference: e.target.value})} />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'historico' && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pedidos</CardTitle>
              <CardDescription>Veja seus pedidos anteriores e peça novamente.</CardDescription>
            </CardHeader>
            <CardContent>
              {myOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Você ainda não fez nenhum pedido.</p>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order: any) => (
                    <div key={order.id} className="flex flex-col sm:flex-row justify-between p-4 rounded-lg border border-border bg-card gap-4 shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                          <span className="text-xs text-muted-foreground">• {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {order.items.map((i:any) => `${i.quantity}x ${i.product.name}`).join(', ')}
                        </div>
                        <div className="font-medium text-primary">
                          {formatCurrency(order.total)} <span className="text-muted-foreground text-xs font-normal">via {order.payment.method}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:justify-center gap-2">
                        <div className="text-sm font-medium flex items-center gap-1">
                          {order.status === 'delivered' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : null}
                          {getStatusText(order.status)}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleRepeatOrder(order)}>
                          <RefreshCw className="w-4 h-4 mr-2" /> Repetir Pedido
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'carrinho' && (
          <Card>
            <CardContent className="p-0 sm:p-6 text-center py-12">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Finalize seu pedido</h3>
              <p className="text-muted-foreground mb-6">Verifique os itens do seu carrinho e conclua a compra de forma segura.</p>
              <Button asChild size="lg">
                <Link to="/checkout">Ir para o Checkout <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
