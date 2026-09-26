import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Plus, Trash2, Save, Store, MapPin, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export default function AdminSettingsPage() {
  const { fetchStoreSettings } = useStore();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    store_name: '',
    phone: '',
    whatsapp: '',
    address: '',
    logo_url: '',
    banner_url: '',
    instagram: '',
    social_links: [] as { label: string, url: string }[]
  });

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (data && !error) {
        setForm({
          store_name: data.store_name || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          address: data.address || '',
          logo_url: data.logo_url || '',
          banner_url: data.banner_url || '',
          instagram: data.instagram || '',
          social_links: Array.isArray(data.social_links) ? data.social_links : [],
        });
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSocialLink = () => {
    setForm({
      ...form,
      social_links: [...form.social_links, { label: '', url: '' }]
    });
  };

  const updateSocialLink = (index: number, key: 'label' | 'url', value: string) => {
    const updated = [...form.social_links];
    updated[index][key] = value;
    setForm({ ...form, social_links: updated });
  };

  const removeSocialLink = (index: number) => {
    const updated = [...form.social_links];
    updated.splice(index, 1);
    setForm({ ...form, social_links: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('store_settings')
      .upsert({ 
        id: 'default', 
        ...form,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast.error('Erro ao salvar as configurações', { description: error.message });
    } else {
      toast.success('Configurações salvas com sucesso!');
      if (fetchStoreSettings) {
        await fetchStoreSettings();
      }
    }
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto pb-12 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações da Loja</h1>
        <p className="text-muted-foreground">Gerencie as informações públicas do estabelecimento.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Identificação e Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Store size={20} /> Identificação e Contato</CardTitle>
            <CardDescription>Nome e números para contato com os clientes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store_name">Nome do Estabelecimento</Label>
                <Input id="store_name" name="store_name" value={form.store_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (Fixo/Celular)</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                <Input id="whatsapp" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="5511999999999" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin size={20} /> Localização</CardTitle>
            <CardDescription>Endereço físico do estabelecimento.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Rua, Número, Bairro - Cidade" />
            </div>
          </CardContent>
        </Card>

        {/* Identidade Visual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ImageIcon size={20} /> Identidade Visual</CardTitle>
            <CardDescription>Links das imagens para exibição no catálogo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL da Logo</Label>
              <Input id="logo_url" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner_url">URL da Capa (Banner)</Label>
              <Input id="banner_url" name="banner_url" value={form.banner_url} onChange={handleChange} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        {/* Links e Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LinkIcon size={20} /> Redes Sociais e Links</CardTitle>
            <CardDescription>Conecte seus clientes às suas redes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@seuinstagram" />
            </div>

            <div>
              <Label className="mb-2 block">Mais opções (Links Adicionais)</Label>
              {form.social_links.map((link, index) => (
                <div key={index} className="flex items-center gap-2 mb-3">
                  <Input 
                    placeholder="Título (ex: Facebook)" 
                    value={link.label}
                    onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input 
                    placeholder="URL (https://...)" 
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    className="flex-2"
                  />
                  <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeSocialLink(index)}>
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="mt-2">
                <Plus size={16} className="mr-2" /> Adicionar outro link
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={loading}>
            <Save size={18} className="mr-2" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
