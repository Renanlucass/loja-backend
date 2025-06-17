import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import categoriasRoutes from './routes/categorias.js';
import produtosRoutes from './routes/produtos.js';
import configuracoesRoutes from './routes/configuracoes.js';
import authRoutes from './routes/auth.js'
import pedidosRoutes from './routes/pedidos.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/pedidos', pedidosRoutes);
app.use('/auth', authRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/produtos', produtosRoutes);
app.use('/configuracoes', configuracoesRoutes);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });


export default app;