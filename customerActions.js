async function addToCart(product) {
  try {
    const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const foundProduct = cartProducts.find((item) => item.id === product.id);

    if (foundProduct) {
      alert("Product already in cart");
      return;
    }

    cartProducts.push(product);
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    await updateServerCartData(loggedUser.email, cartProducts);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

async function addToWishlist(product) {
  try {
    const wishlistProducts =
      JSON.parse(localStorage.getItem("wishlistProducts")) || [];
    const foundProduct = wishlistProducts.find(
      (item) => item.id === product.id
    );

    if (foundProduct) {
      alert("Product already in wishlist");
      return;
    }
    wishlistProducts.push(product);
    localStorage.setItem("wishlistProducts", JSON.stringify(wishlistProducts));
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    await updateServerWishlistData(loggedUser.email, wishlistProducts);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
}

async function updateServerCartData(userEmail, cartData) {
  const uniqueId = Math.floor(Math.random() * 10000);
  try {
    const response = await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userEmail,
        products: cartData,
        id: uniqueId,
      }),
    });

    const data = await response.json();
    console.log("Cart updated successfully:", data);
  } catch (error) {
    console.error("There was an error updating the cart:", error);
  }
}

async function updateServerWishlistData(userEmail, wishlistData) {
  const uniqueId = Math.floor(Math.random() * 10000);
  try {
    const response = await fetch("http://localhost:3000/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userEmail,
        products: wishlistData,
        id: uniqueId,
      }),
    });

    const data = await response.json();
    console.log("Wishlist updated successfully:", data);
  } catch (error) {
    console.error("There was an error updating the wishlist:", error);
  }
}

function minusAmount(quantityID) {
  const value = parseInt(document.getElementById(quantityID).value);
  if (value != 0) {
    document.getElementById(quantityID).value = value - 1;
  }
  calculateTotalPrice();
}

function calculateTotalPrice() {
  const productDivs = document.getElementsByClassName("product-div");

  // Initialize total price
  let totalPrice = 0;

  // Loop through each product div
  for (let i = 0; i < productDivs.length; i++) {
    const productDiv = productDivs[i];
    const price = parseFloat(
      productDiv
        .querySelector('p[name="price"]')
        .textContent.split(":")[1]
        .trim()
    );
    const quantity = parseFloat(
      productDiv.getElementsByTagName("input")[0].value
    );

    // Calculate subtotal for each product
    const subtotal = price * quantity;

    // Add subtotal to the total price
    totalPrice += subtotal;
  }

  const element = document.getElementsByClassName("total-price")[0];
  element.innerText = `Total: ${totalPrice}`;
}

function addAmount(quantityID, stock) {
  const value = parseInt(document.getElementById(quantityID).value);
  if (value < stock) {
    document.getElementById(quantityID).value = value + 1;
  }

  calculateTotalPrice();
}

function submitOrderLogic() {
  const productDivs = document.getElementsByClassName("product-div");
  orders = [];
  for (let i = 0; i < productDivs.length; i++) {
    const productDiv = productDivs[i];

    const product = {
      id: productDiv.getElementsByTagName("input")[1].value,
      name: productDiv.getElementsByTagName("h3")[0].innerText.trim(),
      price: parseFloat(
        productDiv
          .querySelector('p[name="price"]')
          .textContent.split(":")[1]
          .trim()
      ),
      quantity: parseFloat(productDiv.getElementsByTagName("input")[0].value),

      description: productDiv
        .querySelector('p[name="price"]')
        .textContent.split(":")[1]
        .trim(),
    };
    orders.push(product);
  }
  const uniqueId = Math.floor(Math.random() * 10000);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const total_price = document
    .getElementsByClassName("total-price")[0]
    .textContent.split(":")[1]
    .trim();
  const payload = {
    userOrders: orders,
    user: loggedUser.email,
    id: uniqueId,
    status: "pending",
    total_price: parseFloat(total_price),
  };
  console.log(productDivs);
  addOrders(payload);
}

async function addOrders(payload) {
  try {
    const response = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Wishlist updated successfully:", data);

    await fetch(`http://localhost:3000/card?user=${loggedUser.email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("There was an error updating the wishlist:", error);
  }
}
