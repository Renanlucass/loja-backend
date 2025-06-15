import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Pedidos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao buscar os pedidos.');
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            nome_cliente,
            telefone_cliente,
            endereco_completo,
            metodo_entrega,
            forma_pagamento,
            itens_pedido,
            subtotal
        } = req.body;

        if (!nome_cliente || !telefone_cliente || !itens_pedido) {
            return res.status(400).json({ error: 'Dados do cliente e itens são obrigatórios.' });
        }

        const { data, error } = await supabase
            .from('Pedidos')
            .insert([{
                nome_cliente,
                telefone_cliente,
                endereco_completo,
                metodo_entrega,
                forma_pagamento,
                itens_pedido,
                subtotal
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao criar o pedido.');
    }
});

export default router;
