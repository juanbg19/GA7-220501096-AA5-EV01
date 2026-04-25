import bcryptjs from 'bcryptjs';
import JsonWebToken from 'jsonwebtoken';
import Dotenv from 'dotenv';

Dotenv.config();

const usuarios = [{
    user: 'pedro',
    email: 'pedro@gmail.com',
    password: '$2b$10$jQk8PH4QuJJkQNEuhcgnJeE6Ljoi527Qi7QuQJTlLLVx/fwVCbV1O',
}
];

async function login(req, res) {
    console.log(req.body.user);
    const user = req.body.user;
    const password = req.body.password;
    if (!user || !password) {
        return res.status(400).send({ status: "error", message: "Faltan datos" });
    }
    const usuariosExistente = usuarios.find(usuarios => usuarios.user === user);
    if (!usuariosExistente) {
        return res.status(400).send({ status: "error", message: "Usuario durante login" });
    }


    const loginCorrecto = await bcryptjs.compare(password, usuariosExistente.password);
    if (!loginCorrecto) {
        return res.status(400).send({ status: 'error', menssage: 'Contraseña durante login' });
    }
    const token = JsonWebToken.sign(
        { user: usuariosExistente.user },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION});
    

        const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        path : '/'
        }
        res.cookie('JWT', token, cookieOptions);
        res.status(200).send({ status: 'ok', message: 'Login exitoso', redirect:'/inicio'});
};


async function registrar(req, res) {
    console.log(req.body.user);
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;
    if (!user || !password || !email) {
        return res.status(400).send({ status: 'error', error: 'Faltan datos' });
    }
    const usuariosExistente = usuarios.find(usuarios => usuarios.user === user);
    if (usuariosExistente) {
        return res.status(400).send({ status: 'error', error: 'El usuario ya existe' });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const nuevoUsuario = {
        user, email, password: hashedPassword
    };
    usuarios.push(nuevoUsuario);
    console.log(usuarios.map(u => ({ user: u.user, email: u.email})));
    return res.status(201).send({ status: 'ok', message: 'Usuario registrado', redirect: true });
}

export const methods = {
    login,
    registrar
};