import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '../ui/sheet';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const {
    cart,
    cartNotes,
    formatCurrency,
    DELIVERY_FEE,
    removeFromCart,
    updateCartQty,
    setCartNotes,
  } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum: number, item: any) => sum + item.total, 0);
  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            Carrinho
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <span className="text-6xl mb-4">🍣</span>
              <h3 className="text-xl font-bold">Seu carrinho está vazio</h3>
              <p className="text-muted-foreground text-sm max-w-[250px]">
                Explore nosso cardápio e adicione itens deliciosos!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items */}
              <div className="space-y-4">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-md object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md border border-border bg-muted flex items-center justify-center shrink-0">
                        <span className="text-xl">🍣</span>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <h4 className="font-bold text-sm line-clamp-1">{item.product.name}</h4>
                      {item.selectedExtras.length > 0 && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {item.selectedExtras.map((e: any) => e.name).join(', ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-sm text-primary">
                          {formatCurrency(item.total)}
                        </span>
                        
                        <div className="flex items-center gap-2 border border-border rounded-md px-2 py-1 bg-card">
                          <button
                            className="text-muted-foreground hover:text-foreground text-xs"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(item.id);
                              } else {
                                updateCartQty(item.id, item.quantity - 1);
                              }
                            }}
                          >
                            {item.quantity <= 1 ? <Trash2 size={12} className="text-destructive" /> : '−'}
                          </button>
                          <span className="w-4 text-center text-xs font-medium">{item.quantity}</span>
                          <button
                            className="text-muted-foreground hover:text-foreground text-xs"
                            onClick={() => updateCartQty(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold">Observações do pedido</Label>
                <Textarea
                  id="notes"
                  placeholder="Ex: sem wasabi, enviar 2 pares de hashis..."
                  value={cartNotes}
                  onChange={(e) => setCartNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <SheetFooter className="p-6 border-t border-border bg-card/50 backdrop-blur block">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxa de entrega</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
            <Button className="w-full h-12 text-md font-bold" onClick={handleCheckout}>
              Finalizar Pedido
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
