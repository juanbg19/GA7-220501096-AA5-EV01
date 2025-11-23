import express from 'express';
//fix para _dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {methods as autenticar} from './controlador/autenticacion.controlador.js';


//Servidor
const app = express();
app.set('port', 4000);
app.listen(app.get('port'));
console.log('servidor corriendo en puerto', app.get('port'));

//configutacion
app.use(express.static(__dirname + '/public'));
app.use(express.json());

//Rutas
app.get('/', (req, res) => res.sendFile(__dirname + '/pages/login.html'));
app.get('/registrar', (req, res) => res.sendFile(__dirname + '/pages/registrar.html'));
app.get('/inicio', (req, res) => res.sendFile(__dirname + '/pages/inicio.html'));
app.post('/registrar',autenticar.registrar);
app.post('/login',autenticar.login)
