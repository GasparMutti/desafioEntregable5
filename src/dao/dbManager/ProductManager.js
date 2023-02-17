import productModel from "../models/products.model.js";
export default class ProductManager {
  constructor() {}

  async getProducts(query, limit = 10, page = 1, sort) {
    try {
      if (query) query = JSON.parse(query);
      const result = await productModel.paginate(query, {
        limit: limit,
        page: page,
        sort: {price: sort},
        lean: true,
      });
      if (result.hasNextPage)
        result.nextLink = `http://localhost:8080/api/products/?${
          query ? "query=" + query + "&" : ""
        }${"limit=" + limit}${"&page=" + (+page + 1)}${
          sort ? "&sort=" + sort : ""
        }`;
      if (result.hasPrevPage)
        result.prevLink = `http://localhost:8080/api/products/?${
          query ? "query=" + query + "&" : ""
        }${"limit=" + limit}${"&page=" + (+page - 1)}${
          sort ? "&sort=" + sort : ""
        }`;
      return {
        status: "success",
        payload: result.docs,
        totalDocs: result.totalDocs,
        limit: result.limit,
        totalPages: result.totalPages,
        page: result.page,
        pagingCounter: result.pagingCounter,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      };
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the database, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async addProduct(product) {
    try {
      return await productModel.create(product);
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while creating the product",
      };
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findById(id);
      return product === null
        ? {
            status: 404,
            error: `Product with id ${id} not found`,
          }
        : product;
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while obtaining the product with id ${id}`,
      };
    }
  }

  async updateProduct(id, object) {
    try {
      const productUpdated = await productModel.findByIdAndUpdate(id, object, {
        new: true,
      });
      return productUpdated === null
        ? {
            status: 404,
            error: `Product with id ${id} not found`,
          }
        : productUpdated;
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while updating the product with id ${id}`,
      };
    }
  }

  async deleteProduct(id) {
    try {
      const productDeleted = await productModel.findByIdAndDelete(id);
      return productDeleted === null
        ? {
            status: 404,
            error: `Product with id ${id} not found`,
          }
        : {status: 200, message: `Product with ${id} deleted succesfully`};
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while updating the product with id ${id}`,
      };
    }
  }
}
