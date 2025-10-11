const fs = require('fs');
const path = require('path');

class productManager {
    constructor(path) {
        this.path = path;
    }
    
    async getProducts() {
        try {
            if (!fs.existsSync(this.path)) {
                return [];
            }
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer el archivo de productos:", error);
            throw new Error("No se pudieron obtener los productos.");
        }
    }

    async addProduct(nuevoProducto) {
        try {
            const productos = await this.getProducts();
            const newId = productos.length > 0 ? Math.max(...productos.map(p => Number(p.id))) + 1 : 1;
            
            nuevoProducto.id = newId;
            productos.push(nuevoProducto);

            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 2));
            
            return nuevoProducto;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw new Error("No se pudo agregar el producto.");
        }
    }
    async deleteProduct(pid) {
        try {
            let products = await this.getProducts();
            let index = products.findIndex(p => String(p.id) === String(pid));
            
            if (index === -1) {
                return null;
            }
            
            let deleted = products.splice(index, 1)[0];
            
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            
            return deleted;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new Error("No se pudo eliminar el producto.");
        }
    }
    async getProductById(pid) {
        try {
            const products = await this.getProducts();
            return products.find(p => String(p.id) === String(pid)) || null;
        } catch (error) {
            console.error("Error al buscar el producto por ID:", error);
            throw new Error("No se pudo encontrar el producto.");
        }
    }
}

module.exports = productManager;