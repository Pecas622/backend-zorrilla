import express from 'express';
import handlebars from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as ServerIo } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import viewsRouter from './routes/views.router.js';
import ManagerProducts from './managers/managerProductos.js';  // Aquí importamos la clase ManagerProducts

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

// Instanciamos el Manager de productos
const productManager = new ManagerProducts();

// Conexión de WebSocket para la ruta "/realtimeproducts"
app.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');  // Renderizar vista de productos en tiempo real
});

io.on('connection', (socket) => {
    console.log('Cliente conectado a WebSocket');

    // Enviar los productos actuales al cliente
    socket.emit('updateProducts', productManager.getProducts());
    
    // Escuchar el evento 'addProduct' desde el cliente
    socket.on('addProduct', (newProduct) => {
        productManager.createProduct(newProduct);  // Llamamos a crear un producto
        io.emit('updateProducts', productManager.getProducts());  // Emitir productos actualizados
    });

    // Escuchar el evento 'deleteProduct' desde el cliente
    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(productId);  // Llamamos a eliminar el producto
        io.emit('updateProducts', productManager.getProducts());  // Emitir productos actualizados
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Configuración del servidor
httpServer.listen(8080, (err) => {
    if (err) {
        console.error('No se pudo iniciar el servidor: ', err);
        return;
    }
    console.log('Server is running on http://localhost:8080');
});
