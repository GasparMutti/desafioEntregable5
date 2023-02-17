import {Router} from "express";
import dbProductManager from "../dao/dbManager/ProductManager.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

const dbpm = new dbProductManager();

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  } = req.body;
  const product = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  const addResponse = await dbpm.addProduct(product);

  return !addResponse.error
    ? res.status(201).send(addResponse)
    : res.status(addResponse.status).send(addResponse);
});

router.get("/?", async (req, res) => {
  const {query, limit, page, sort} = req.query;
  const getResponse = await dbpm.getProducts(query, limit, page, sort);

  return !getResponse.error
    ? res.status(200).json(getResponse)
    : res.status(getResponse.status).send(getResponse);
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  const getResponse = await dbpm.getProductById(id);

  return !getResponse.error
    ? res.send(getResponse)
    : res.status(getResponse.status).send(getResponse);
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const object = req.body;
  const updateResponse = await dbpm.updateProduct(id, object);

  return !updateResponse.error
    ? res.send(updateResponse)
    : res.status(updateResponse.status).send(updateResponse);
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  const deleteResponse = await dbpm.deleteProduct(id);

  return !deleteResponse.error
    ? res.send(deleteResponse)
    : res.status(deleteResponse.status).send(deleteResponse);
});

export default router;
