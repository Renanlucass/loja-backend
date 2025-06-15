import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/home', async (req, res) => {
    const { username, password } = req.body;

    const correctUser = process.env.ADMIN_USER;
    const correctPass = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        return res.status(400).json({ error: 'Utilizador e senha são obrigatórios.' });
    }
    
    if (username === correctUser && password === correctPass) {
        const token = jwt.sign(
            { user: username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        return res.json({ token });
    }

    res.status(401).json({ error: 'Credenciais inválidas.' });
});

export default router;
