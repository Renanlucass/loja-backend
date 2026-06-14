import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

/**
 * LISTAR TODOS OS VENDEDORES
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('vendedores')
            .select('*')
            .order('nome');

        if (error) throw error;

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Erro ao buscar vendedores.'
        });
    }
});

/**
 * BUSCAR UM VENDEDOR
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('vendedores')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Vendedor não encontrado.'
        });
    }
});

/**
 * CADASTRAR VENDEDOR
 */
router.post('/', async (req, res) => {
    try {
        const {
            nome,
            telefone,
            email,
            cidade,
            descricao
        } = req.body;

        if (!nome) {
            return res.status(400).json({
                error: 'Nome é obrigatório.'
            });
        }

        const { data, error } = await supabase
            .from('vendedores')
            .insert([
                {
                    nome,
                    telefone,
                    email,
                    cidade,
                    descricao
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Erro ao cadastrar vendedor.'
        });
    }
});

/**
 * ATUALIZAR VENDEDOR
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nome,
            telefone,
            email,
            cidade,
            descricao
        } = req.body;

        const { data, error } = await supabase
            .from('vendedores')
            .update({
                nome,
                telefone,
                email,
                cidade,
                descricao
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Erro ao atualizar vendedor.'
        });
    }
});

/**
 * EXCLUIR VENDEDOR
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('vendedores')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({
            message: 'Vendedor removido com sucesso.'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Erro ao excluir vendedor.'
        });
    }
});

export default router;