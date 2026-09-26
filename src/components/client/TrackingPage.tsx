import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { STORE_WHATSAPP, STORE_NAME } from '../../data/seed';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const STATUS_CONFIG: Record<string, any> = {
  received: {
    label: 'Recebido',
    desc: 'Aguardando confirmação da loja',
    emoji: '📩',
  },
  preparing: {
    label: 'Em Preparação',
    desc: 'A cozinha está preparando seus sushis',
    emoji: '👨‍🍳',
  },
  delivering: {
    label: 'Saiu para Entrega',
    desc: 'Seu pedido está a caminho',
    emoji: '🛵',
  },
  delivered: {
    label: 'Entregue',
    desc: 'Pedido entregue! Bom apetite!',
    emoji: '✅',
  },
};

const STEPS = ['received', 'preparing', 'delivering', 'delivered'];

export default function TrackingPage() {
  const { orderId } = useParams();
  const { orders, activeOrderId, formatCurrency, storeSettings } = useStore();

  const trackId = orderId || activeOrderId;
  const order = orders.find((o: any) => o.id === trackId);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center pt-24 text-center">
        <p className="text-6xl mb-6">🔍</p>
        <h2 className="text-2xl font-bold mb-2">Nenhum pedido encontrado</h2>
        <p className="text-muted-foreground mb-8">Faça um pedido pelo nosso cardápio!</p>
        <Button asChild className="w-full max-w-[300px]">
          <Link to="/">Ver Cardápio</Link>
        </Button>
      </div>
    );
  }

  const currentStepIndex = STEPS.indexOf(order.status);

  const getStepTime = (stepStatus: string) => {
    const entry = order.statusHistory.find((h: any) => h.status === stepStatus);
    if (!entry) return null;
    return new Date(entry.at).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${storeSettings?.name || STORE_NAME}! 🍣\n\nGostaria de informações sobre meu pedido #${order.orderNumber}.\n\nNome: ${order.customer.name}\nTelefone: ${order.customer.phone}\nTotal: ${formatCurrency(order.total)}`
  );
  const whatsappNumber = storeSettings?.whatsapp || STORE_WHATSAPP;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 font-medium text-sm transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Voltar ao cardápio
      </Link>

      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">📍 Acompanhe seu Pedido</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Pedido <strong className="text-foreground">#{order.orderNumber}</strong>
      </p>

      {/* Timeline */}
      <Card className="mb-8">
        <CardContent className="pt-6 relative pl-8 before:absolute before:inset-y-6 before:left-4 before:w-[2px] before:bg-border">
          {STEPS.map((step, i) => {
            const config = STATUS_CONFIG[step];
            const isCompleted = i < currentStepIndex;
            const isActive = i === currentStepIndex;
            const time = getStepTime(step);

            return (
              <div
                key={step}
                className={`relative mb-8 last:mb-0 pl-6 ${isCompleted || isActive ? 'opacity-100' : 'opacity-40'}`}
              >
                <div 
                  className={`absolute -left-[1.35rem] top-1 h-5 w-5 rounded-full border-4 border-card z-10 
                    ${isCompleted ? 'bg-primary' : isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} 
                />
                <h4 className={`text-lg font-bold flex items-center gap-2 ${isActive ? 'text-primary' : ''}`}>
                  <span>{config.emoji}</span> {config.label}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{config.desc}</p>
                {time && <p className="text-xs font-medium text-muted-foreground mt-2">{time}</p>}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card className="mb-8 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Detalhes do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{item.quantity}x</span> {item.product.name}
                </span>
                <span className="font-medium">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Taxa de entrega</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 text-primary">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp button */}
      <Button asChild size="lg" className="w-full h-14 text-lg font-bold bg-[#25D366] hover:bg-[#1DA851] text-white">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={22} className="mr-2" />
          Falar com a loja pelo WhatsApp
        </a>
      </Button>
    </div>
  );
}
