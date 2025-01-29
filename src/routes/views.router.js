import { Router } from 'express';

const router = Router();

// Configuración interna de Express router para views
router.get('/', async (req, res) => {
    // Establecer la conexión con el socket
    req.io.on('connection', socket => {
        console.log('Nuevo cliente conectado');
        // Aquí puedes emitir eventos o escuchar eventos desde el socket
    });

    // Aquí va la lógica para obtener los productos
    res.render('home', { products: [] });
});

router.get('/realtimeproducts', (req, res) => { 
    res.render('realtimeproducts');
});

export default router;
