import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { destaque, incluir_arquivados, sort, page = '1', limit = '12', search = '' } = req.query;
    const isAscending = sort !== 'desc';

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum - 1;

    let query = supabase
      .from('Produto')
      .select('*', { count: 'exact' });

    if (incluir_arquivados !== 'true') {
      query = query.not('arquivado', 'is', true);
    }

    if (destaque === 'true') {
      query = query.eq('destaque', true);
    }

    if (search.trim()) {
      query = query.textSearch('search_text', search, {
        config: 'portuguese',
        type: 'plain' 
      });
    }

    query = query.order('id', { ascending: isAscending }).range(startIndex, endIndex);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      products: data || [],
      totalCount: count,
      currentPage: pageNum,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});
router.patch('/:id/update', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado para atualização fornecido.' });
    }
    const { data, error } = await supabase
      .from('Produto')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('Produto')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Produto não encontrado' });

  res.json(data);
});

router.post('/', async (req, res) => {
  const { nome, descricao, preco, estoque, destaque, imagem_produto, categoriaId } = req.body;

  const { data, error } = await supabase
    .from('Produto')
    .insert([{
      nome, descricao, preco, estoque, destaque, imagem_produto, categoriaId
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase.from('Produto').update(updates).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Produto').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;