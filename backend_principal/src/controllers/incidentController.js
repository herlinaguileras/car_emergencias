const axios = require('axios');
const FormData = require('form-data');

const reportIncident = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se ha proporcionado ninguna imagen.' });
        }

        const formData = new FormData();
        formData.append('image', req.file.buffer, req.file.originalname);

        // Envía la imagen al microservicio de Python
        const iaResponse = await axios.post(`${process.env.IA_MICROSERVICE_URL}/predict/image`, formData, {
            headers: {
                ...formData.getHeaders(),
                'x-service-token': process.env.SERVICE_TOKEN
            }
        });

        // Retorna la respuesta directa a la app móvil
        return res.status(200).json({
            success: true,
            data: iaResponse.data
        });

    } catch (error) {
        console.error('Error al procesar el incidente:', error.message);
        return res.status(500).json({ success: false, message: 'Error interno de comunicación con IA.' });
    }
};

module.exports = { reportIncident };
