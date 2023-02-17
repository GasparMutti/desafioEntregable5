import fs from "fs";
export default class ProductManager {
  constructor() {
    this.path = "src/dao/fileManager/products.json";
  }

  async getProducts(limit) {
    try {
      const document = await fs.promises.readFile(this.path);
      const json = JSON.parse(document);
      if (limit) {
        if (limit <= json.length) json.length = limit;
        return json;
      } else {
        return json;
      }
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async addProduct(product) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = product;
    if (
      title &&
      description &&
      price &&
      thumbnails &&
      code &&
      stock &&
      status &&
      category
    ) {
      const json = await this.getProducts();
      if (!json.error) {
        let id = json.length + 1;
        const product = {
          title,
          description,
          price,
          category,
          thumbnails,
          status,
          code,
          stock,
          id,
        };
        if (json.find((prod) => prod.id === product.id)) product.id++;
        const exist = json.find(
          (prod) => prod.id === product.id || prod.code === product.code
        );
        if (!exist) {
          json.push(product);
          await this.writeFile(json);
          return {status: "Ok", message: "Product added successfully"};
        } else {
          return {
            status: 400,
            error: "Already exist a product with this params",
          };
        }
      } else {
        return json;
      }
    } else {
      return {status: 400, error: "Missing values in the request"};
    }
  }

  async getProductById(id) {
    const json = await this.getProducts();
    if (!json.error) {
      const product = json.find((prod) => prod.id === id);
      if (product) {
        return product;
      } else {
        return {
          status: 404,
          error: "Not found a product with this id",
        };
      }
    } else {
      return json;
    }
  }

  async updateProduct(id, object) {
    const json = await this.getProducts();
    if (!json.error) {
      if (id && object) {
        if (!object.id) {
          const product = json.find((product) => product.id === id);
          if (product) {
            const productIndex = json.findIndex((product) => product.id === id);
            const newProduct = {...product, ...object};
            json.splice(productIndex, 1, newProduct);
            await this.writeFile(json);
            return {status: "Ok", message: "Product updated successfully"};
          } else {
            return {
              status: 400,
              error: "Isn't possible change the id of a product",
            };
          }
        } else {
          return {status: 400, error: "Missing values in the request"};
        }
      } else {
        return {status: "404", error: "Not found a product with this id"};
      }
    } else {
      return json;
    }
  }

  async deleteProduct(id) {
    if (id) {
      const json = await this.getProducts();
      if (!json.error) {
        const product = json.find((product) => product.id === id);
        if (product) {
          const productIndex = json.findIndex((product) => product.id === id);
          json.splice(productIndex, 1);
          await this.writeFile(json);
          return {status: "Ok", message: "Product deleted successfully"};
        } else {
          return {status: 404, error: "Not found a product with this id"};
        }
      } else {
        return json;
      }
    } else {
      return {status: 400, error: "Missing values in the request"};
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
