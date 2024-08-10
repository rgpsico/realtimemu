const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Configuração do CORS
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir todas as origens
        methods: ["GET", "POST"] // Métodos HTTP permitidos
    }
});

app.use(express.json());
app.use(express.static('public'));

// Define uma rota POST para /enviar-json
app.post('/enviar-json', (req, res) => {
    console.log('Dados recebidos:', req.body); // Exibe os dados recebidos no console
    io.emit('dados-json', req.body);
    // Responde com um JSON
    res.json({ mensagem: "Dados recebidos com sucesso!", seusDados: req.body });
});

// Define uma rota POST para /atualizar_aluno
app.post('/atualizar_aluno', (req, res) => {
    console.log('atualizar_aluno'+req.body.empresa, req.body); // Exibe os dados recebidos no console
     io.emit('atualizar_aluno'+req.body.empresa, req.body);

   
    res.json({ mensagem: "Dados recebidos com sucesso noaaa outro canal!", seusDados: req.body });
});


app.post('/acesso', (req, res) => {
    console.log('Acesso', req.body); 
    console.log('Acesso'+req.body.empresa)
    io.emit('Acesso'+req.body.empresa, req.body);
  
    res.json({ mensagem: "Dados recebidos com sucesso noaaa outro canal!", seusDados: req.body });
});


app.post('/liberacao_manual', (req, res) => {
    console.log('liberacao_manual', req.body); 
    console.log('liberacao_manual'+req.body.empresa)
    io.emit('liberacao_manual'+req.body.empresa, req.body);
  
    res.json({ mensagem: "Liberação Concluida!", seusDados: req.body });
});


app.post('/atualizar_imagem_aluno', (req, res) => { 
       io.emit('atualizar_imagem_aluno'+req.body.empresa, req.body);  
    res.json({ mensagem: "atualizar_imagem_aluno", seusDados: req.body });
});


app.post('/reiniciar_aplicativo', (req, res) => {    
    io.emit('reiniciar_aplicativo'+req.body.empresa, req.body);  
    res.json({ mensagem: "reiniciando o APP", seusDados: req.body });
});

app.post('/bate_papo', (req, res) => {    
    io.emit('bate_papo'+req.body.empresa, req.body);  
    res.json({ mensagem: "reiniciando o APP", seusDados: req.body });
});
// Configurações de conexão do Socket.IO
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    socket.on('chat message', (msg) => {
        console.log('Mensagem recebida:', msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
