import express from 'express';
import { supabase } from '../services/supabase.js';

const router = express.Router();

// Buscar configurações
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('Configuracoes_Gerais').select('*').eq('id', 1).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Atualizar configurações
router.put('/', async (req, res) => {
  const updates = req.body;
  const { data, error } = await supabase.from('Configuracoes_Gerais').update(updates).eq('id', 1);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
