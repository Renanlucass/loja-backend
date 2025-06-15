import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { destaque, incluir_arquivados, sort } = req.query;
    const isAscending = sort !== 'desc';

    let query = supabase
      .from('Produto')
      .select('*')
      .order('id', { ascending: isAscending });

    if (incluir_arquivados !== 'true') {
      query = query.eq('arquivado', false);
    }

    if (destaque === 'true') {
      query = query.eq('destaque', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);

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
  } catch(err) {
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

  const { data, error } = await supabase.from('Produto').insert([{
    nome, descricao, preco, estoque, destaque, imagem_produto, categoriaId
  }]);

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
