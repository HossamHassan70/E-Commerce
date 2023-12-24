import { ordersURL } from "/networkConfig.js";
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
async function fetchOrderList() {
  try {
    const response = await axios.get(`${ordersURL}?user=${loggedUser.email}`);
    const products = response.data;

    return products.filter((product) => product.user === loggedUser.email);
  } catch (error) {
    console.error("Error fetching carlist:", error);
    return [];
  }
}

async function renderOrderList() {
  try {
    const filteredProducts = await fetchOrderList();
    console.log(filteredProducts);
    const cartList = document.getElementById("order-container");
    cartList.innerHTML = "";

    filteredProducts.forEach((item, index) => {
      let totalPrice = 0;
      const productDiv = document.createElement("div");
      productDiv.style.border = "1px solid black";
      productDiv.style.margin = "0.5rem";
      productDiv.style.padding = "0.5rem";
      productDiv.style.borderRadius = "1rem";
      productDiv.classList.add("product-div");
      item.userOrders.forEach((product, index2) => {
        totalPrice += product.price * product.quantity;
        const productDetails = document.createElement("div");
        productDetails.innerHTML = `
        <div class="product">
        <h3>  ${product.name} </h3>

        <span> quanity: ${product.quantity} </span>
        <span> price: ${product.price} </span>
       
        <span> total: ${product.price * product.quantity} </span>
        </div>
        `;
        productDiv.appendChild(productDetails);
      });
      const status = document.createElement("div");
      status.style.margin = "10px";
      status.innerHTML = `
     status : ${item.status}
      `;
      const customer = document.createElement("div");
      customer.innerHTML = `
      customer : ${item.user}
      `;
      customer.style.margin = "10px";
      const total = document.createElement("div");
      total.innerHTML = `
      Total Price : ${item.total_price}
      `;
      total.style.margin = "10px";
      productDiv.appendChild(status);
      productDiv.appendChild(customer);
      productDiv.appendChild(total);
      cartList.appendChild(productDiv);
    });
    const approveOrder = document.createElement("button");
    approveOrder.textContent = "Approve Order";
    approveOrder.style.marginLeft = "20px";

    const rejectOrder = document.createElement("button");
    rejectOrder.textContent = "RejectOrder Order";
    rejectOrder.style.marginLeft = "20px";
    if (loggedUser.admin) {
      cartList.appendChild(approveOrder);
      cartList.appendChild(rejectOrder);
    }
  } catch (error) {
    console.error("Error rendering cartlist:", error);
  }
}

// Call the function to render wishlist
renderOrderList();
