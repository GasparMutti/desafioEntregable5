const productsContainer = document.querySelector(".productsContainer");

async function logout() {
  const options = {
    method: "POST",
    body: "",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    `http://localhost:8080/api/session/logout`,
    options
  );
  const res = await response.json();
  console.log(res);
  location.assign("/products");
}

async function addToCart(id) {
  const options = {
    method: "POST",
    body: "",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(
    `http://localhost:8080/api/carts/63e9bda4f8b1b3b6dfec4229/products/${id}`,
    options
  );
  Swal.fire({
    toast: true,
    icon: "success",
    position: "top-right",
    html: "Product added to cart",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}
