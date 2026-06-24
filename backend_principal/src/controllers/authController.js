const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { correo, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const nuevoUsuario = await prisma.usuario.create({
            data: { correo, password: hashedPassword }
        });

        res.status(201).json({ success: true, message: 'Usuario registrado' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'El correo ya existe o hubo un error' });
    }
};

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;
        const usuario = await prisma.usuario.findUnique({ where: { correo } });

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

module.exports = { register, login };
