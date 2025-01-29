import express from 'express';
import handlebars from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as ServerIo } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import viewsRouter from './routes/views.router.js';

const app = express();
const httpServer = new HttpServer(app);
const io = new ServerIo(httpServer);

// Obtener el __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Handlebars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para WebSocket (pero no se activará en la ruta raíz)
const socketMidd = (io) => (req, res, next) => {
    req.io = io;
    next();
};

app.use(socketMidd(io));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', () => {});
app.use('/api/carts', () => {});

// Conexión de WebSocket para la ruta "/realtimeproducts"
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    // Enviar productos cuando el cliente se conecta
    socket.emit('updateProducts', [{ name: 'Yerba Playadito', price: 850 }, { name: 'Mate', price: 500 }]);
});

httpServer.listen(8080, (err) => {
    if (err) {
        console.error('No se pudo iniciar el servidor: ', err);
        return;
    }
    console.log('Server is running on http://localhost:8080');
});
