import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Slider')
      .select('*')
      .eq('is_banner', false) 
      .order('ordem', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor ao buscar imagens do slider.');
  }
});

router.get('/banner', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Slider')
            .select('*')
            .eq('is_banner', true) 
            .limit(1) 
            .single(); 
        
        if (error) throw error;
        res.json(data);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao buscar o banner.');
    }
});

export default router;
