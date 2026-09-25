import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const DELIVERY_FEE = 5.0;

const StoreContext = createContext<any>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // ─── Local State ───
  const [cart, setCart] = useState<any[]>([]);
  const [cartNotes, setCartNotes] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // ─── Supabase State ───
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ─── Auth State (Admin) ───
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // ─── Client Auth State ───
  const [clientPhone, setClientPhone] = useState<string | null>(localStorage.getItem('sushi_client_phone'));
  const [clientProfile, setClientProfile] = useState<any>(null);

  // ─── Fetch Initial Data ───
  useEffect(() => {
    // ── Auth Subscription ──
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => setProfile(data));
    } else {
      setProfile(null);
    }
  }, [session]);

  useEffect(() => {
    if (clientPhone) {
      localStorage.setItem('sushi_client_phone', clientPhone);
      supabase.from('customers').select('*').eq('phone', clientPhone).single()
        .then(({ data }) => {
          if (data) setClientProfile(data);
        });
    } else {
      localStorage.removeItem('sushi_client_phone');
      setClientProfile(null);
    }
  }, [clientPhone]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Categories
        const { data: cats } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
        if (cats) setCategories(cats);

        // Fetch Products
        const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (prods) setProducts(prods.map(p => ({
          ...p,
          categoryId: p.category_id,
          image: p.image_url,
          available: p.is_available,
          // Since we don't have prepTime or extras in the SQL, mock them for now or default
          prepTime: 15,
          extras: []
        })));

        // Fetch Orders
        const { data: ords } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
        if (ords) setOrders(ords.map(o => ({
          ...o,
          orderNumber: o.id.slice(0,4).toUpperCase(),
          customer: { name: o.customer_name, phone: o.customer_phone, rua: o.delivery_address, numero: '', bairro: '' },
          items: o.order_items.map((i: any) => ({ product: { id: i.product_id, name: i.product_name }, quantity: i.quantity, total: i.unit_price * i.quantity, unitPrice: i.unit_price, selectedExtras: [] })),
          total: o.total_amount,
          payment: { method: o.payment_method },
          deliveryFee: DELIVERY_FEE,
          createdAt: o.created_at,
          statusHistory: [{ status: o.status, at: o.created_at }]
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // ─── Realtime Subscriptions ───
    const orderSub = supabase.channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        // Simplistic refetch on any order change
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSub);
    };
  }, []);

  // ─── Cart Actions ───
  const addToCart = (product: any, quantity: number, selectedExtras: any[]) => {
    const cartItemId = `${Date.now()}`;
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    const itemTotal = (product.price + extrasTotal) * quantity;
    setCart(prev => [...prev, {
      id: cartItemId, product, quantity, selectedExtras, unitPrice: product.price + extrasTotal, total: itemTotal
    }]);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateCartQty = (id: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity, total: item.unitPrice * quantity } : item));
  };
  
  const clearCart = () => { setCart([]); setCartNotes(''); };

  // ─── Orders Actions ───
  const createOrder = async (customer: any, payment: any) => {
    try {
      const subtotal = cart.reduce((sum, i) => sum + i.total, 0);
      const total = subtotal + DELIVERY_FEE;

      const { data: order, error } = await supabase.from('orders').insert({
        customer_id: clientProfile?.id || null,
        customer_name: customer.name,
        customer_phone: customer.phone || clientPhone,
        delivery_address: `${customer.rua}, ${customer.numero} - ${customer.bairro} ${customer.complemento}`,
        total_amount: total,
        payment_method: payment.method,
        notes: cartNotes,
        status: 'received'
      }).select().single();

      if (error) {
        console.error("Erro ao criar pedido:", error);
        throw error;
      }
      if (!order) {
        throw new Error("Pedido não retornado do banco de dados.");
      }

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.unitPrice || item.product.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      
      if (itemsError) {
        console.error("Erro ao criar itens do pedido:", itemsError);
        throw itemsError;
      }
      
      setActiveOrderId(order.id);
      clearCart();
    } catch (err: any) {
      toast.error(err.message || "Erro ao finalizar pedido");
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: nextStatus }).eq('id', orderId);
    if (error) toast.error('Erro ao atualizar status.');
  };
  // ─── Categories ───
  const addCategory = async (category: any) => {
    const { data, error } = await supabase.from('categories').insert([{
      name: category.name,
      slug: category.slug,
      sort_order: category.sort_order
    }]).select().single();
    
    if (error) {
      toast.error('Erro ao criar categoria', { description: error.message });
      return;
    }
    
    if (data) {
      setCategories(prev => [...prev, data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      toast.success('Categoria criada!');
    }
  };

  // ─── Products ───
  const addProduct = async (product: any) => {
    await supabase.from('products').insert({
      name: product.name,
      description: product.description,
      category_id: product.categoryId,
      price: product.price,
      image_url: product.image,
      is_available: product.available
    });
    // Optimistic refresh
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data.map((p:any) => ({ ...p, categoryId: p.category_id, image: p.image_url, available: p.is_available, prepTime: 15, extras: [] })));
  };

  const updateProduct = async (product: any) => {
    await supabase.from('products').update({
      name: product.name,
      description: product.description,
      category_id: product.categoryId,
      price: product.price,
      image_url: product.image,
      is_available: product.available
    }).eq('id', product.id);
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductAvailability = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    await supabase.from('products').update({ is_available: !product.available }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <StoreContext.Provider
      value={{
        session,
        profile,
        clientPhone,
        setClientPhone,
        clientProfile,
        isLoading,
        categories,
        products,
        orders,
        cart,
        cartNotes,
        activeOrderId,
        DELIVERY_FEE,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        setCartNotes,
        createOrder,
        updateOrderStatus,
        addCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        formatCurrency,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
