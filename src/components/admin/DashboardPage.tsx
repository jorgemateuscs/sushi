import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Target,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export default function DashboardPage() {
  const { orders, formatCurrency } = useStore();

  const [period, setPeriod] = useState<'hoje' | 'mes' | 'ano' | 'personalizado'>('hoje');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    
    return orders.filter((o: any) => {
      const orderDate = new Date(o.createdAt);
      
      if (period === 'hoje') {
        return orderDate.toDateString() === now.toDateString();
      } else if (period === 'mes') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      } else if (period === 'ano') {
        return orderDate.getFullYear() === now.getFullYear();
      } else if (period === 'personalizado') {
        if (!customStart || !customEnd) return true;
        const s = new Date(customStart);
        // adjust start to beginning of day
        s.setHours(0,0,0,0);
        // Add 1 day to the end of the day or use 23:59:59 (we use local timezone)
        const e = new Date(customEnd);
        e.setHours(23, 59, 59, 999);
        return orderDate >= s && orderDate <= e;
      }
      return true;
    });
  }, [orders, period, customStart, customEnd]);

  // Only consider 'delivered' or 'entregue'
  const deliveredOrdersList = filteredOrders.filter((o: any) => ['delivered', 'entregue'].includes(o.status));
  
  const revenue = deliveredOrdersList.reduce((sum: number, o: any) => sum + o.total, 0);
  const deliveredOrdersCount = deliveredOrdersList.length;
  const ticketMedio = deliveredOrdersCount > 0 ? revenue / deliveredOrdersCount : 0;

  // Breakdown por pagamento
  const paymentBreakdown = deliveredOrdersList.reduce((acc: any, o: any) => {
    const method = o.payment?.method || 'outro';
    acc[method] = (acc[method] || 0) + o.total;
    return acc;
  }, {});

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'pix': return 'PIX';
      case 'credito': return 'Cartão de Crédito';
      case 'debito': return 'Cartão de Débito';
      case 'dinheiro': return 'Dinheiro';
      default: return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">📩 Recebido</Badge>;
      case 'preparing':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">👨‍🍳 Preparando</Badge>;
      case 'out_for_delivery':
      case 'delivering':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">🛵 A caminho</Badge>;
      case 'delivered':
      case 'entregue':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">✅ Entregue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">📊 Dashboard Financeiro</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={period === 'hoje' ? 'default' : 'outline'} onClick={() => setPeriod('hoje')} size="sm">
            Hoje
          </Button>
          <Button variant={period === 'mes' ? 'default' : 'outline'} onClick={() => setPeriod('mes')} size="sm">
            Este Mês
          </Button>
          <Button variant={period === 'ano' ? 'default' : 'outline'} onClick={() => setPeriod('ano')} size="sm">
            Este Ano
          </Button>
          <Button variant={period === 'personalizado' ? 'default' : 'outline'} onClick={() => setPeriod('personalizado')} size="sm">
            Personalizado
          </Button>
        </div>
      </div>

      {period === 'personalizado' && (
        <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">De:</span>
            <Input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Até:</span>
            <Input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="w-auto" />
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              No período selecionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Entregues</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrdersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de vendas concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(ticketMedio)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Média por pedido entregue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formas de Pagamento</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {Object.keys(paymentBreakdown).length > 0 ? (
              <div className="space-y-1 mt-1 text-sm">
                {Object.entries(paymentBreakdown).map(([method, total]) => (
                  <div key={method} className="flex justify-between items-center">
                    <span className="text-muted-foreground capitalize">{getPaymentLabel(method)}</span>
                    <span className="font-semibold">{formatCurrency(total as number)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-2xl font-bold">R$ 0,00</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Lista de Pedidos ({deliveredOrdersCount})</CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <Link to="/admin/orders">
              Gerenciar <ArrowRight size={14} className="ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {deliveredOrdersList.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              Nenhum pedido finalizado no período selecionado.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveredOrdersList.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-primary">
                        #{order.orderNumber}
                      </TableCell>
                      <TableCell>{order.customer?.name || '-'}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">
                        {getPaymentLabel(order.payment?.method || '')}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')} <br />
                        {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
