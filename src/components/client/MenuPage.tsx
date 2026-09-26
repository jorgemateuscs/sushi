import React, { useState, useRef } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

// ── Product Modal ──
function ProductModal({ product, onClose }: any) {
  const { formatCurrency, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);

  const toggleExtra = (extra: any) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const itemTotal = (product.price + extrasTotal) * quantity;

  const handleAdd = () => {
    addToCart(product, quantity, selectedExtras);
    toast.success(`${product.name} adicionado ao carrinho!`);
    onClose();
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <div className="relative h-48 w-full bg-muted flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🍣</span>
          )}
        </div>
        <div className="p-6">
          <DialogTitle className="text-xl mb-2">{product.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground mb-4">
            {product.description}
          </DialogDescription>

          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
            {product.prepTime > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} /> ~{product.prepTime} min
              </span>
            )}
          </div>

          {/* Extras */}
          {product.extras && product.extras.length > 0 && (
            <div className="mb-6 space-y-3">
              <h4 className="font-semibold text-sm">Adicionais / Opções</h4>
              {product.extras.map((extra: any) => {
                const isSelected = !!selectedExtras.find((e) => e.id === extra.id);
                return (
                  <div
                    key={extra.id}
                    className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => toggleExtra(extra)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleExtra(extra)} />
                      <label className="text-sm font-medium leading-none cursor-pointer">
                        {extra.name}
                      </label>
                    </div>
                    {extra.price > 0 && (
                      <span className="text-sm text-muted-foreground">+{formatCurrency(extra.price)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quantity & Add */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 border border-border rounded-md px-3 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-muted-foreground hover:text-foreground">
                −
              </button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-muted-foreground hover:text-foreground">
                +
              </button>
            </div>

            <Button className="flex-1" onClick={handleAdd}>
              <Plus size={18} className="mr-2" />
              Adicionar {formatCurrency(itemTotal)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Product Card ──
function ProductCard({ product, onSelect, onLongPress }: any) {
  const { formatCurrency } = useStore();
  const timerRef = useRef<any>(null);

  const startPress = (e: any) => {
    if (!product.available) return;
    if (e.target.closest('button')) return;
    timerRef.current = setTimeout(() => {
      onLongPress(product);
    }, 500);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group relative flex flex-row sm:flex-col p-3 sm:p-0 gap-3 sm:gap-0 select-none" 
      onClick={() => { cancelPress(); product.available && onSelect(product); }}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => { e.preventDefault(); cancelPress(); }}
    >
      <div className="relative w-24 h-24 sm:w-full sm:h-40 shrink-0 overflow-hidden bg-muted flex items-center justify-center rounded-md sm:rounded-none">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${!product.available ? 'grayscale opacity-60' : ''}`}
          />
        ) : (
          <span className={`text-4xl transition-transform group-hover:scale-105 ${!product.available ? 'grayscale opacity-60' : ''}`}>🍣</span>
        )}
        {product.prepTime > 0 && (
          <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-background/90 backdrop-blur text-foreground text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-1 font-medium shadow-sm">
            <Clock size={10} className="sm:w-3 sm:h-3" /> {product.prepTime} min
          </span>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold text-[10px] sm:text-sm shadow-lg">Esgotado</span>
          </div>
        )}
      </div>
      <CardContent className="p-0 sm:p-4 flex-1 flex flex-col justify-center sm:justify-start">
        <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-4 sm:min-h-[2.5rem]">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-sm sm:text-base text-primary">{formatCurrency(product.price)}</span>
          {product.available && (
            <Button size="icon" variant="secondary" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full shrink-0" onClick={(e) => { e.stopPropagation(); cancelPress(); onSelect(product); }}>
              <Plus size={14} className="sm:w-4 sm:h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Menu Page ──
export default function MenuPage() {
  const { categories, products } = useStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [longPressProduct, setLongPressProduct] = useState<any>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = sectionRefs.current[catId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sortedCategories = [...categories].sort((a, b) => (a.sort_order || a.order) - (b.sort_order || b.order));
  const activeCategories = sortedCategories.filter(cat => 
    products.some((p: any) => p.categoryId === cat.id && p.available)
  );

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="bg-card border border-border rounded-xl p-8 mb-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold mb-3">🍣 Sushiya Delivery</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Sushi artesanal feito com ingredientes frescos. Peça agora e receba no conforto da sua casa!
        </p>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-16 z-30 bg-background/95 backdrop-blur py-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-border sm:border-none overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 w-max">
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors border
                ${activeCategory === cat.id 
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                  : 'bg-card text-foreground border-border hover:bg-accent'}`}
              onClick={() => scrollToCategory(cat.id)}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Products by Category */}
      <div className="space-y-12">
        {activeCategories.map((cat) => {
          const catProducts = products.filter((p: any) => p.categoryId === cat.id && p.available);
          if (catProducts.length === 0) return null;
          return (
            <section
              key={cat.id}
              ref={(el) => (sectionRefs.current[cat.id] = el)}
              id={`cat-${cat.id}`}
              className="scroll-mt-36"
            >
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 pb-2 border-b border-border">
                <span>{cat.icon}</span>
                {cat.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {catProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                    onLongPress={setLongPressProduct}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Long Press Detail Modal */}
      {longPressProduct && (
        <Dialog open={true} onOpenChange={() => setLongPressProduct(null)}>
          <DialogContent className="sm:max-w-sm p-0 overflow-hidden border-none bg-transparent shadow-2xl scale-105 transition-transform duration-300">
            <div className="bg-card rounded-xl overflow-hidden pointer-events-none">
              <div className="relative h-64 w-full bg-muted flex items-center justify-center">
                {longPressProduct.image ? (
                  <img src={longPressProduct.image} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🍣</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{longPressProduct.name}</h3>
                <p className="text-muted-foreground mb-4">{longPressProduct.description}</p>
                <div className="text-xl font-bold text-primary">{useStore().formatCurrency(longPressProduct.price)}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
