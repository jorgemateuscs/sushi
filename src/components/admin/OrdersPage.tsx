import React, { useEffect, useRef } from 'react';
import { ChevronRight, Phone, MapPin } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const STATUS_CONFIG: Record<string, any> = {
  received: { label: '📩 Recebidos', next: 'preparing', nextLabel: 'Preparar', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  preparing: { label: '👨‍🍳 Em Preparação', next: 'out_for_delivery', nextLabel: 'Enviar', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  out_for_delivery: { label: '🛵 Saiu p/ Entrega', next: 'delivered', nextLabel: 'Entregar', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  delivered: { label: '✅ Entregues', next: null, nextLabel: null, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
};

const COLUMNS = ['received', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrdersPage() {
  const { orders, updateOrderStatus, formatCurrency } = useStore();


  const handleAdvance = (orderId: string, nextStatus: string) => {
    updateOrderStatus(orderId, nextStatus);
    const labels: Record<string, string> = {
      preparing: 'em preparação',
      out_for_delivery: 'saiu para entrega',
      delivered: 'entregue',
    };
    toast.success(`Pedido atualizado para: ${labels[nextStatus]}`);
  };

  const getPaymentLabel = (payment: any) => {
    const labels: Record<string, string> = {
      pix: '📱 Pix',
      cartao: '💳 Cartão',
      dinheiro: '💵 Dinheiro',
    };
    return labels[payment.method] || payment.method;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold tracking-tight mb-6">📋 Gestão de Pedidos</h1>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 pb-4 items-start">
        {COLUMNS.map((status) => {
          const config = STATUS_CONFIG[status];
          const columnOrders = orders.filter((o: any) => o.status === status);

          return (
            <div key={status} className="flex flex-col h-full max-h-[75vh] md:max-h-full min-h-0">
              <div className={`px-4 py-3 rounded-t-xl border-t border-l border-r border-border font-bold flex items-center justify-between ${config.color.replace('border-', '')} border`}>
                <span>{config.label}</span>
                <Badge variant="secondary" className="bg-background/50 font-bold">{columnOrders.length}</Badge>
              </div>

              <div className="flex-1 bg-muted/30 border border-border rounded-b-xl p-2 overflow-y-auto scrollbar-thin space-y-2">
                {columnOrders.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    Nenhum pedido
                  </p>
                )}

                {columnOrders.map((order: any) => (
                  <Card
                    key={order.id}
                    className={`border border-border/50 shadow-sm ${status === 'received' ? 'animate-in fade-in slide-in-from-top-2 duration-300' : ''}`}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base text-primary">#{order.orderNumber}</span>
                        <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-md font-medium">
                          {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="font-semibold">{order.customer.name}</div>

                      <div className="text-sm text-muted-foreground line-clamp-3">
                        {order.items.map((i: any) => `${i.quantity}x ${i.product.name}`).join(', ')}
                      </div>

                      {order.notes && (
                        <div className="text-xs text-orange-500 bg-orange-500/10 p-2 rounded border border-orange-500/20 italic">
                          📝 {order.notes}
                        </div>
                      )}

                      <div className="flex items-center justify-between font-bold">
                        <span>{formatCurrency(order.total)}</span>
                        <Badge variant="outline" className="font-normal text-xs">
                          {getPaymentLabel(order.payment)}
                          {order.payment.changeFor && ` (troco p/ ${formatCurrency(order.payment.changeFor)})`}
                        </Badge>
                      </div>

                      <Separator />

                      {/* Contact & Address */}
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="inline-flex items-center gap-1 text-[0.7rem] text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full hover:bg-blue-500/20 transition-colors"
                        >
                          <Phone size={10} /> {order.customer.phone}
                        </a>
                        <span className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground bg-accent px-2 py-1 rounded-full">
                          <MapPin size={10} />
                          <span className="line-clamp-1 max-w-[150px]">
                            {order.customer.rua}, {order.customer.numero}
                            {order.customer.bairro && ` - ${order.customer.bairro}`}
                          </span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-2">
                        {config.next && (
                          <Button
                            className="flex-1"
                            size="sm"
                            onClick={() => handleAdvance(order.id, config.next)}
                          >
                            {config.nextLabel}
                            <ChevronRight size={16} className="ml-1" />
                          </Button>
                        )}
                        {['received', 'preparing'].includes(status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
                                updateOrderStatus(order.id, 'cancelled');
                              }
                            }}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
