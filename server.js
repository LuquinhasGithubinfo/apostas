// server.js
const express = require('express');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('frontend'));

app.use(session({
    secret: '3191bet-secret',
    resave: false,
    saveUninitialized: true
}));

// Função para ler usuários
function getUsers() {
    if(!fs.existsSync('backend/users.json')) fs.writeFileSync('backend/users.json', '[]');
    return JSON.parse(fs.readFileSync('backend/users.json'));
}

// Função para salvar usuários
function saveUsers(users) {
    fs.writeFileSync('backend/users.json', JSON.stringify(users, null, 2));
}

// Cadastro
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    let users = getUsers();
    if(users.find(u => u.email === email)) return res.json({ success: false, message: "Email já cadastrado" });

    const newUser = { name, email, password, balance: 100.0, history: [] };
    users.push(newUser);
    saveUsers(users);
    res.json({ success: true });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    let users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if(user){
        req.session.user = user;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Email ou senha incorretos" });
    }
});

// Pegar dados do usuário logado
app.get('/me', (req, res) => {
    if(req.session.user) res.json({ user: req.session.user });
    else res.json({ user: null });
});

// Deposito
app.post('/deposit', (req, res) => {
    if(!req.session.user) return res.json({ success: false });
    let users = getUsers();
    const user = users.find(u => u.email === req.session.user.email);
    user.balance += parseFloat(req.body.amount);
    saveUsers(users);
    req.session.user = user;
    res.json({ success: true, balance: user.balance });
});

// Saque
app.post('/withdraw', (req, res) => {
    if(!req.session.user) return res.json({ success: false });
    let users = getUsers();
    const user = users.find(u => u.email === req.session.user.email);
    const amount = parseFloat(req.body.amount);
    if(user.balance < amount) return res.json({ success: false, message: "Saldo insuficiente" });
    user.balance -= amount;
    saveUsers(users);
    req.session.user = user;
    res.json({ success: true, balance: user.balance });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
