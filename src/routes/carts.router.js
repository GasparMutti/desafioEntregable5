import {Router} from "express";
import dbCartsManager from "../dao/dbManager/CartsManager.js";

const router = Router();

const dbcm = new dbCartsManager();

router.get("/", async (req, res) => {
  const getResponse = await dbcm.getCarts();

  return !getResponse.error
    ? res.send(getResponse)
    : res.status(getResponse.status).send(getResponse);
});

router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const getResponse = await dbcm.getCartById(id);

  return !getResponse.error
    ? res.send(getResponse)
    : res.status(getResponse.status).send(getResponse);
});

router.post("/", async (req, res) => {
  const addResponse = await dbcm.addCart();

  return !addResponse.error
    ? res.send(addResponse)
    : res.status(addResponse.status).send(addResponse);
});

router.post("/:cid/products/:pid", async (req, res) => {
  const {cid, pid} = req.params;
  const addResponse = await dbcm.addProductToCart(cid, pid);

  return !addResponse.error
    ? res.send(addResponse)
    : res.status(addResponse.status).send(addResponse);
});

router.put("/:cid/products", async (req, res) => {
  const cid = req.params.cid;
  const products = req.body;
  const updateResponse = await dbcm.updateProducts(cid, products);

  return !updateResponse.error
    ? res.send(updateResponse)
    : res.status(updateResponse.status).send(updateResponse);
});

router.put("/:cid/products/:pid", async (req, res) => {
  const {cid, pid} = req.params;
  const {quantity} = req.body;
  const updateResponse = await dbcm.updateQuantity(cid, pid, quantity);

  return !updateResponse.error
    ? res.send(updateResponse)
    : res.status(updateResponse.status).send(updateResponse);
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const deleteResponse = await dbcm.removeToCart(cid, pid);

  return !deleteResponse.error
    ? res.send(deleteResponse)
    : res.status(deleteResponse.status).send(deleteResponse);
});

router.delete("/:cid/products", async (req, res) => {
  const cid = req.params.cid;
  const deleteResponse = await dbcm.removeAllProductsToCart(cid);

  return !deleteResponse.error
    ? res.send(deleteResponse)
    : res.status(deleteResponse.status).send(deleteResponse);
});

export default router;
