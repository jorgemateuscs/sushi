import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// ── Product Form Modal ──
function ProductFormModal({ product, onClose, onSave }: any) {
  const { categories } = useStore();
  const [form, setForm] = useState(
    product || {
      name: '',
      description: '',
      categoryId: categories[0]?.id || '',
      price: '',
      image: '',
      prepTime: '',
      available: true,
      extras: [],
    }
  );

  const handleChange = (field: string) => (e: any) =>
    setForm((prev: any) => ({ ...prev, [field]: e.target.value }));

  const handleCategoryChange = (val: string) => {
    setForm((prev: any) => ({ ...prev, categoryId: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) return;
    onSave({
      ...form,
      price: parseFloat(form.price),
      prepTime: parseInt(form.prepTime) || 0,
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>
            {product ? 'Atualize os dados do produto abaixo.' : 'Preencha os detalhes do novo produto.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Nome do produto"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição do produto..."
              value={form.description}
              onChange={handleChange('description')}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={form.categoryId} onValueChange={handleCategoryChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange('price')}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://..."
              value={form.image}
              onChange={handleChange('image')}
            />
          </div>

          {form.image && (
            <div className="h-32 w-full rounded-md border border-border overflow-hidden">
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="prepTime">Tempo de Preparo (min)</Label>
            <Input
              id="prepTime"
              type="number"
              placeholder="Ex: 15"
              value={form.prepTime}
              onChange={handleChange('prepTime')}
              min="0"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {product ? 'Salvar Alterações' : 'Criar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Category Form Modal ──
function CategoryFormModal({ onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    sort_order: 0,
  });

  const handleChange = (field: string) => (e: any) => {
    const val = e.target.value;
    if (field === 'name') {
      setForm((prev) => ({ ...prev, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }));
    } else {
      setForm((prev) => ({ ...prev, [field]: val }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return;
    onSave({
      ...form,
      sort_order: parseInt(form.sort_order as any) || 0,
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
          <DialogDescription>
            Adicione uma nova categoria para agrupar os produtos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="catName">Nome *</Label>
            <Input
              id="catName"
              placeholder="Ex: Sobremesas"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="catSlug">Slug (Automático) *</Label>
            <Input
              id="catSlug"
              placeholder="ex: sobremesas"
              value={form.slug}
              onChange={handleChange('slug')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="catOrder">Ordem de Exibição</Label>
            <Input
              id="catOrder"
              type="number"
              placeholder="Ex: 8"
              value={form.sort_order}
              onChange={handleChange('sort_order')}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Products Page ──
export default function ProductsPage() {
  const {
    products,
    categories,
    formatCurrency,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formModal, setFormModal] = useState<any>(null); // null | {} | product
  const [categoryModal, setCategoryModal] = useState(false);

  const filtered = products.filter((p: any) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory && filterCategory !== 'all_categories_internal_value' ? p.categoryId === filterCategory : true;
    return matchSearch && matchCat;
  });

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c: any) => c.id === catId);
    return cat ? `${cat.icon || ''} ${cat.name}` : catId;
  };

  const handleSave = (productData: any) => {
    if (productData.id) {
      updateProduct(productData);
      toast.success('Produto atualizado!');
    } else {
      addProduct(productData);
      toast.success('Produto criado!');
    }
    setFormModal(null);
  };

  const handleSaveCategory = (categoryData: any) => {
    addCategory(categoryData);
    setCategoryModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Excluir "${name}"?`)) {
      deleteProduct(id);
      toast.success('Produto excluído!');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">📦 Catálogo de Produtos</h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_categories_internal_value">Todas categorias</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icon || ''} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setCategoryModal(true)} variant="outline" className="flex-1 sm:flex-none">
            <Plus size={16} className="mr-2" />
            Nova Categoria
          </Button>
          <Button onClick={() => setFormModal({})} className="flex-1 sm:flex-none">
            <Plus size={16} className="mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Preparo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-xl">
                      🍣
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-bold">{product.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                    {product.description}
                  </div>
                </TableCell>
                <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                <TableCell className="font-bold text-primary">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.prepTime ? `${product.prepTime} min` : '—'}
                </TableCell>
                <TableCell>
                  {product.available ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">✓ Disponível</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">✕ Esgotado</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormModal(product)}
                      title="Editar"
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={product.available ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50" : "text-green-500 hover:text-green-600 hover:bg-green-50"}
                      onClick={() => toggleProductAvailability(product.id)}
                      title={product.available ? 'Desativar' : 'Ativar'}
                    >
                      {product.available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(product.id, product.name)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum produto encontrado.
          </div>
        )}
      </div>

      {/* Form Modal */}
      {formModal !== null && (
        <ProductFormModal
          product={formModal.id ? formModal : null}
          onClose={() => setFormModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Category Modal */}
      {categoryModal && (
        <CategoryFormModal
          onClose={() => setCategoryModal(false)}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}
