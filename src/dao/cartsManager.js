const fs = require('fs');
const path = require('path');

class cartsManager {
    constructor(path) {
        this.path = path;
    }
    
    async getCarts() {
        try {
            if (!fs.existsSync(this.path)) {
                return [];
            }
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer el archivo de carts:", error);
            throw new Error("No se pudieron obtener los carts.");
        }
    }

    async addCart(newCart) {
        try {
            const carts = await this.getCarts();
            const newId = carts.length > 0 ? Math.max(...carts.map(p => Number(p.id))) + 1 : 1;
            
            newCart.id = newId;
            carts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            
            return newCart;
        } catch (error) {
            console.error("Error al agregar el Carrito:", error);
            throw new Error("No se pudo agregar el Carrito.");
        }
    }
    async deleteCart(pid) {
        try {
            let carts = await this.getCarts();
            let index = carts.findIndex(p => String(p.id) === String(pid));
            
            if (index === -1) {
                return null;
            }
            
            let deleted = carts.splice(index, 1)[0];
            
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            
            return deleted;
        } catch (error) {
            console.error("Error al eliminar el Carrito:", error);
            throw new Error("No se pudo eliminar el Carrito.");
        }
    }
    async getCartById(pid) {
        try {
            const carts = await this.getCarts();
            return carts.find(p => String(p.id) === String(pid)) || null;
        } catch (error) {
            console.error("Error al buscar el Carrito por ID:", error);
            throw new Error("No se pudo encontrar el Carrito.");
        }
    }
}

module.exports = cartsManager;