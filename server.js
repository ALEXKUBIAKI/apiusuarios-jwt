const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;


app.use(express.json());

// Lista de memória
let users = [
    { id: 1, nome: 'Admin', email: 'admin@example.com', password: bcrypt.hashSync('password123', 10) } 
];

// Middleware de autenticação JWT para proteger a rota GET /users
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"

    if (!token) return res.status(403).json({ message: 'Acesso negado. Token não encontrado.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

// Endpoint de login - Gera o token JWT
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

    // Verifica a senha
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

        // Gera o JWT
        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken });
    });
});

// Rota GET /users → Retorna a lista de usuários cadastrados
// Proteger essa rota com autenticação JWT
app.get('/users', authenticateToken, (req, res) => {
    res.json(users);
});

// Rota POST /users → Adiciona um novo usuário
app.post('/users', (req, res) => {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
        id: users.length + 1,
        nome,
        email,
        password: hashedPassword
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// Rota PUT /users/:id → Atualiza os dados de um usuário pelo ID
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { nome, email, password } = req.body;

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Atualizando o usuário
    users[userIndex] = { id: userId, nome, email, password: password ? bcrypt.hashSync(password, 10) : users[userIndex].password };
    res.json(users[userIndex]);
});

// Rota DELETE /users/:id → Remove um usuário pelo ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Remover o usuário
    users.splice(userIndex, 1);
    res.status(204).end(); // No content, apenas remove o usuário
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
