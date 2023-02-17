import mongoose from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        pid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number || 1,
          required: true,
        },
      },
    ],
    default: [],
    required: true,
  },
});

const cartModel = mongoose.model(cartsCollection, cartSchema);
export default cartModel;
