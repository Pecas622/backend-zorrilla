import fs from 'fs';

class ManagerProducts {
    constructor() {
        this.filePath = './products.json';
    }

    // Leer productos desde el archivo
    readFile() {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    // Guardar productos en el archivo
    saveFile(products) {
        fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
    }

    // Obtener todos los productos
    getProducts() {
        return this.readFile();
    }

    // Obtener un producto por ID
    getProduct(id) {
        const products = this.readFile();
        return products.find(product => product.id === id);
    }

    // Crear un producto
    createProduct(newProduct) {
        const products = this.readFile();
        newProduct.id = Date.now();  // Usamos la fecha como ID único
        products.push(newProduct);
        this.saveFile(products);
    }

    // Actualizar un producto
    updateProduct(id, updatedProduct) {
        const products = this.readFile();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            this.saveFile(products);
        }
    }

    // Eliminar un producto
    deleteProduct(productId) {
        let products = this.readFile();
        products = products.filter(product => product.id !== parseInt(productId));
        this.saveFile(products);
    }
}

export default ManagerProducts;
