import ProductManager from "./ProductManager.js";
import cartModel from "../models/carts.model.js";

const dbpm = new ProductManager();

export default class CartsManager {
  constructor() {}

  async getCarts() {
    try {
      const carts = await cartModel.find().populate("products.pid");
      return !carts.length
        ? {
            status: 404,
            error: "No carts found",
          }
        : carts;
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while obtaining the carts",
      };
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartModel.findById(id).lean().populate("products.pid");
      return cart === null
        ? {
            status: 404,
            error: `Cart with id ${id} not found`,
          }
        : cart.products;
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while obtaining the cart with id ${id}`,
      };
    }
  }

  async addCart() {
    try {
      return await cartModel.create({products: []});
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while creating the cart",
      };
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cartFinded = await this.getCartById(cid);
      if (cartFinded.error)
        return {
          status: 404,
          error: `Cart with id ${cid} not found`,
        };

      const productFinded = await dbpm.getProductById(pid);
      if (productFinded.error)
        return {
          status: 404,
          error: `Product with id ${pid} not found`,
        };

      const productInCart = cartFinded.find(
        (product) => product.pid._id == pid
      );
      if (productInCart) {
        const productIndex = cartFinded.findIndex(
          (product) => product.pid._id == pid
        );
        const newCart = cartFinded;
        newCart[productIndex].quantity++;
        return await cartModel.findByIdAndUpdate(cid, {products: newCart});
      }

      return await cartModel.findByIdAndUpdate(cid, {
        $push: {products: {pid, quantity: 1}},
      });
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while adding the product`,
      };
    }
  }

  async updateProducts(cid, products) {
    try {
      const cartFinded = await this.getCartById(cid);
      if (cartFinded.error) return cartFinded;

      const dbProducts = (await dbpm.getProducts()).payload.map((product) =>
        product._id.toString()
      );

      const productsExist = products.map((product) => {
        const result = dbProducts.find((dbProduct) => dbProduct == product.pid);
        return result ? true : false;
      });

      if (productsExist.includes(false))
        return {
          status: 404,
          error: "Error when trying to add a non-existent product to the cart",
        };

      await this.removeAllProductsToCart(cid);
      await cartModel.findByIdAndUpdate(cid, {products: products});
      return {status: "success", message: "Cart updated successfully"};
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while updating the cart with id ${cid}`,
      };
    }
  }

  async updateQuantity(cid, pid, quantity) {
    try {
      if (typeof quantity !== "number")
        return {status: 400, error: "the amount must be a number"};

      const cartFinded = await this.getCartById(cid);
      if (cartFinded.error) return cartFinded;

      const productFinded = await dbpm.getProductById(pid);
      if (productFinded.error)
        return {
          status: 404,
          error: `Product with id ${pid} not found`,
        };

      const productInCart = cartFinded.find(
        (product) => product.pid._id == pid
      );
      if (productInCart) {
        const productIndex = cartFinded.findIndex(
          (product) => product.pid._id == pid
        );
        const newCart = [...cartFinded];
        newCart[productIndex].quantity = quantity;

        await cartModel.findByIdAndUpdate(cid, {products: newCart});
        return {
          status: "success",
          message: "The quantity updated successfully",
        };
      }
      return {
        status: 404,
        error: `The product with id ${pid} was not found in the cart with id ${cid}`,
      };
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while updating the quantity",
      };
    }
  }

  async removeToCart(cid, pid) {
    try {
      const cartFinded = await this.getCartById(cid);
      if (cartFinded.error)
        return {
          status: 404,
          error: `Cart with id ${cid} not found`,
        };

      const productInCart = cartFinded.find(
        (product) => product.pid._id == pid
      );

      if (productInCart) {
        await cartModel.findByIdAndUpdate(cid, {$pull: {products: {pid}}});
        return {status: "success", message: "Product deleted successfully"};
      }
      return {
        status: 404,
        error: `The product with id ${pid} was not found in the cart with id ${cid}`,
      };
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while deleting the product with id ${pid}`,
      };
    }
  }

  async removeAllProductsToCart(cid) {
    try {
      const cartFinded = await this.getCartById(cid);
      if (cartFinded.error)
        return {
          status: 404,
          error: `Cart with id ${cid} not found`,
        };

      await cartModel.findByIdAndUpdate(cid, {products: []});
      return {status: "success", message: "All product deleted successfully"};
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while deleting products`,
      };
    }
  }
}
