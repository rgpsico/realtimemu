const express = require("express");
const fs = require("fs");
const https = require("https");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

// Carregar Certificado SSL
const options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/www.comunidadeppg.com.br/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/www.comunidadeppg.com.br/fullchain.pem"
  ),
};

// Criar servidor HTTPS
const server = https.createServer(options, app);

// Configuração do CORS no Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.static("public"));

app.post("/enviarpedidoparaentregadores", (req, res) => {
  console.log("enviarpedidoentregadores", req.body);
  io.emit("enviarpedidoentregadores", req.body);

  res.json({ mensagem: "enviarpedidoentregadores!", seusDados: req.body });
});

app.post("/enviarmensagem", (req, res) => {
  console.log("enviarmensagem", req.body.user_id);
  io.emit("enviarmensagem" + req.body.user_id, req.body);

  res.json({ mensagem: "enviarmensagem!", seusDados: req.body });
});

app.post("/receberMensagemEntregador", (req, res) => {
  console.log("receberMensagemEntregador", req.body);
  io.emit("receberMensagemEntregador" + req.body.user_id, req.body);

  res.json({ mensagem: "receberMensagemEntregador!", seusDados: req.body });
});

app.post("/teste123", (req, res) => {
  console.log("Mensagem recebida:", req.body);
  io.emit("teste123" + req.body.user_id, req.body);
  res.json({ mensagem: "Mensagem enviada com teste123!", seusDados: req.body });
});

// Exemplo de rota segura
app.post("/enviarmensagem", (req, res) => {
  console.log("Mensagem recebida:", req.body);
  io.emit("enviarmensagem" + req.body.user_id, req.body);
  res.json({ mensagem: "Mensagem enviada com sucesso!", seusDados: req.body });
});

io.on("connection", (socket) => {
  console.log("Novo usuário conectado");

  socket.on("chat message", (msg) => {
    console.log("Mensagem recebida:", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado");
  });
});

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Servidor HTTPS rodando na porta ${PORT}`)
);
