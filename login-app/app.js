// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth'); // Importando as rotas de autenticação

const app = express();

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/loginapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err); // Mudei para console.error para erros
});

// Usar body-parser para analisar dados URL-encoded e JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Definir o diretório para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Se você tiver arquivos públicos como CSS/JS

// Definir o diretório para as views HTML (opcional, mas recomendado)
app.set('views', path.join(__dirname, 'views')); // Define o diretório para as views
app.set('view engine', 'ejs'); // Se você usar EJS como template engine, caso contrário, pode omitir

// Rotas
app.use('/auth', authRoutes); // Mudei a base da rota para '/auth'

// Rota principal para renderizar o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); // Ajuste o caminho se necessário
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
