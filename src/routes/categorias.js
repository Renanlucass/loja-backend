import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('Categoria')
    .select('*')
    .order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('Categoria')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id/produtos', async (req, res) => {
  const { id } = req.params;
  const { sort } = req.query;

  const isAscending = sort === 'asc';

  const { data, error } = await supabase
    .from('Produto')
    .select('*')
    .eq('categoriaId', id)
    .not('arquivado', 'is', true)
    .order('id', { ascending: isAscending });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { nome, imagem_ilustrativa } = req.body;
  const { data, error } = await supabase.from('Categoria').insert([{ nome, imagem_ilustrativa }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, imagem_ilustrativa } = req.body;
  const { data, error } = await supabase.from('Categoria').update({ nome, imagem_ilustrativa }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Categoria').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
