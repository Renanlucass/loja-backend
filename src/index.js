// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import categoriasRoutes from './routes/categorias.js';
import produtosRoutes from './routes/produtos.js';
import configuracoesRoutes from './routes/configuracoes.js';

const app = express();

const allowedOrigins = [
    'http://localhost:3001',
    'https://loja-admin-nine.vercel.app/',
    // 'https://sua-loja.vercel.app' 
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo CORS'));
        }
    }
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/categorias', categoriasRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/configuracoes', configuracoesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
