const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const bcrypt = require('bcrypt'); // Importando bcrypt

// Rota GET para a página de registro
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/registro.html')); // Ajuste o caminho se necessário
});

// Rota POST para o registro de usuário
router.post('/register', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    console.log(req.body); // Para verificar os valores recebidos

    // Verifica se as senhas coincidem
    if (password !== confirm_password) {
        return res.status(400).send('As senhas não coincidem');
    }

    try {
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).send('Usuário ou e-mail já existe');
        }

        // Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            username,
            email,
            password: hashedPassword // Armazenando a senha hash
        });

        await user.save();
        // Redirecionar para a página de login após o registro bem-sucedido
        res.redirect('/auth/login'); // Redireciona para a rota de login
    } catch (error) {
        console.error(error); // Adicione isso para ver o erro no console
        res.status(500).send('Erro no servidor');
    }
});

// Rota GET para a página de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html')); // Ajuste o caminho se necessário
});

// Rota POST para autenticar o usuário
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        // Verifica se o usuário existe
        if (!user) {
            return res.redirect('/auth/login?error=Usuário ou senha incorretos');
        }

        // Verifica a senha usando bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/auth/login?error=Usuário ou senha incorretos');
        }

        // Redirecionar para index.html após login bem-sucedido
        res.redirect('/index.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
