// server.js
const express = require('express');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: '3191bet-secret',
    resave: false,
    saveUninitialized: true
}));

// Pasta frontend
app.use(express.static('frontend'));

// Funções para banco
const USERS_FILE = path.join(__dirname, 'backend/users.json');
function getUsers() {
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
    return JSON.parse(fs.readFileSync(USERS_FILE));
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Cadastro
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.json({ success:false, message: 'Preencha todos os campos' });

    let users = getUsers();
    if(users.find(u => u.email === email)) return res.json({ success:false, message:'Email já cadastrado' });

    const newUser = { name, email, password, balance:100, history:[] };
    users.push(newUser);
    saveUsers(users);
    res.json({ success:true });
});

// Login
app.post('/login', (req,res)=>{
    const { email, password } = req.body;
    if(!email || !password) return res.json({success:false, message:'Preencha todos os campos'});

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if(user){
        req.session.user = user; // criar sessão
        res.json({success:true});
    } else res.json({success:false, message:'Email ou senha incorretos'});
});

// Logout
app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/login.html');
});

// Pegar dados do usuário logado
app.get('/me', (req,res)=>{
    if(req.session.user) res.json({user:req.session.user});
    else res.json({user:null});
});

// Depositar
app.post('/deposit', (req,res)=>{
    if(!req.session.user) return res.json({success:false});
    const amount = parseFloat(req.body.amount);
    if(isNaN(amount) || amount <= 0) return res.json({success:false, message:'Valor inválido'});

    let users = getUsers();
    const user = users.find(u=>u.email===req.session.user.email);
    user.balance += amount;
    saveUsers(users);
    req.session.user = user;
    res.json({success:true, balance:user.balance});
});

// Sacar
app.post('/withdraw', (req,res)=>{
    if(!req.session.user) return res.json({success:false});
    const amount = parseFloat(req.body.amount);
    let users = getUsers();
    const user = users.find(u=>u.email===req.session.user.email);
    if(isNaN(amount) || amount <= 0 || amount>user.balance) return res.json({success:false, message:'Saldo insuficiente'});
    user.balance -= amount;
    saveUsers(users);
    req.session.user = user;
    res.json({success:true, balance:user.balance});
});

// Middleware para proteger index
app.get('/index.html', (req,res,next)=>{
    if(!req.session.user) return res.redirect('/login.html');
    next();
});

app.listen(PORT, ()=>console.log(`Servidor rodando em http://localhost:${PORT}`));
