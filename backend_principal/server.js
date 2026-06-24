require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { reportIncident } = require('./src/controllers/incidentController');
const { register, login } = require('./src/controllers/authController');
const verifyToken = require('./src/middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Rutas Públicas (Auth)
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Rutas Protegidas (Requieren Token JWT)
app.post('/api/incidents/report', verifyToken, upload.single('photo'), reportIncident);

app.listen(process.env.PORT || 8000, () => {
    console.log(`[Backend Minimalista] Corriendo en puerto ${process.env.PORT || 8000}`);
});
