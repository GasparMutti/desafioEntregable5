import fs from "fs";
import ProductManager from "./ProductManager.js";
const pm = new ProductManager();
export default class CartsManager {
  constructor() {
    this.id = 0;
    this.path = "src/dao/fileManager/carts.json";
  }

  async addCart() {
    const json = await this.getCarts();
    if (json.error) {
      return json;
    }
    let id = json.length + 1;
    const idFinded = json.find((cart) => cart.id === id);
    if (id === idFinded?.id) id++;
    const newCart = {id, products: []};
    json.push(newCart);
    return await this.writeFile(json);
  }

  async getCarts() {
    try {
      const document = await fs.promises.readFile(this.path);
      const json = JSON.parse(document);
      return json;
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async getCartById(id) {
    const json = await this.getCarts();
    if (!json.error) {
      const cart = json.find((cart) => cart.id === id);
      if (cart) {
        const cartIndex = json.findIndex((cart) => cart.id === id);
        return {cart, cartIndex};
      } else {
        return {status: 404, error: "Not found a cart with this id"};
      }
    } else {
      return json;
    }
  }

  async addProductToCart(cid, pid) {
    const json = await this.getCarts();
    const {cart, cartIndex} = await this.getCartById(cid);
    if (!json.error && !cart.error) {
      const product = cart.products.find(
        (product) => product.productId === pid
      );
      if (product) {
        const productIndex = cart.products.findIndex(
          (product) => product.productId === pid
        );
        product.quantity++;
        json[cartIndex].products.splice(productIndex, 1, product);
        return await this.writeFile(json);
      } else {
        const getProduct = await pm.getProductById(pid);
        if (!getProduct.error) {
          json[cartIndex].products.push({productId: pid, quantity: 1});
          return await this.writeFile(json);
        } else {
          return getProduct;
        }
      }
    } else {
      return json || cart;
    }
  }

  async removeToCart(cid, pid) {
    const json = await this.getCarts();
    const {cart, cartIndex} = await this.getCartById(cid);
    if (!json.error && !cart.error) {
      const product = cart.products.find(
        (product) => product.productId === pid
      );
      if (product) {
        const productIndex = cart.products.findIndex(
          (product) => product.productId === pid
        );
        json[cartIndex].products.splice(productIndex, 1);
        await this.writeFile(json);
        return {status: "Ok", message: "Product removed from cart succesfully"};
      } else {
        return {
          status: 404,
          error: "Not found a product with this id in this cart",
        };
      }
    } else {
      return json || cart;
    }
  }

  async writeFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data));
      return {status: "Ok", message: "Added successfully"};
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of write the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }
}
