import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import cookieParser from 'cookie-parser';
const __dirname = path.dirname(__filename);
import {methods as autenticar} from './app/controlador/autenticacion.controlador.js';
import dotenv from "dotenv";

dotenv.config({ path: path.resolve("./.env") });

//Servidor
const app = express();
app.set('port', 4000);
app.listen(app.get('port'));
console.log('servidor corriendo en puerto', app.get('port'));

//configutacion
const staticPath = path.join(__dirname, 'app', 'public');
console.log("Ruta absoluta de archivos estáticos:", staticPath); // Mira esto en tu terminal
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Rutas
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'app/pages/login.html')));
app.get('/registrar', (req, res) => res.sendFile(path.join(__dirname, 'app/pages/registrar.html')));
app.post('/registrar',autenticar.registrar);
app.post('/login',autenticar.login)


import jwt from "jsonwebtoken";

function verificarToken(req, res, next) {
  const token = req.cookies.JWT;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

// Ruta protegida
app.get('/inicio', verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/inicio.html'));
});
