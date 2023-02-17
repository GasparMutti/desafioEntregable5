import {Router} from "express";
import ProductManager from "../dao/dbManager/ProductManager.js";
import CartsManager from "../dao/dbManager/CartsManager.js";

const router = Router();
const pm = new ProductManager();
const cm = new CartsManager();

router.get("/", async (req, res) => {
  console.log(req.session.user);
  const isLogin = req.session.user ? true : false;
  res.render("home", {isLogin});
});

router.get("/chat", async (req, res) => {
  const isLogin = req.session.user ? true : false;
  res.render("chat", {isLogin});
});

router.get("/products?", async (req, res) => {
  const isLogin = req.session.user ? true : false;
  const user = req.session.user;
  const {query, limit, page, sort} = req.query;
  const response = await pm.getProducts(query, limit, page, sort);
  let {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    page: resPage,
  } = response;
  if (hasNextPage)
    nextLink = `http://localhost:8080/products/?${
      query ? "query=" + query + "&" : ""
    }${"limit=" + limit}${"&page=" + (+resPage + 1)}${
      sort ? "&sort=" + sort : ""
    }`;
  if (hasPrevPage)
    prevLink = `http://localhost:8080/products/?${
      query ? "query=" + query + "&" : ""
    }${"limit=" + limit}${"&page=" + (+resPage - 1)}${
      sort ? "&sort=" + sort : ""
    }`;
  return res.render("products", {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    resPage,
    isLogin,
    user,
  });
});

router.get("/carts/:cid", async (req, res) => {
  const isLogin = req.session.user ? true : false;
  const id = req.params.cid;
  const cart = await cm.getCartById(id);
  return !cart.error
    ? res.render("cart", {cart, isLogin})
    : res.render("404", {});
});

router.get("/register", (req, res) => {
  return res.render("register", {});
});

router.get("/login", (req, res) => {
  return res.render("login", {});
});

router.get("/profile", (req, res) => {
  const isLogin = req.session.user ? true : false;
  return isLogin ? res.render("profile", {}) : res.redirect("/login");
});

export default router;
