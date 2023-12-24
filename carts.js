import { cartURL } from "/networkConfig.js";

let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

async function fetchCartList() {
  try {
    const response = await axios.get(`${cartURL}?user=${loggedUser.email}`);
    const products = response.data;

    return products.filter((product) => product.user === loggedUser.email);
  } catch (error) {
    console.error("Error fetching carlist:", error);
    return [];
  }
}

async function renderCartList() {
  try {
    const filteredProducts = await fetchCartList();
    console.log(filteredProducts);
    const cartList = document.getElementById("cart-container");
    cartList.innerHTML = "";
    let total_price = 0
    filteredProducts.forEach((item, index) => {
      item.products.forEach((product, index2) => {
        const productDiv = document.createElement("div");
        const quantityID = `${index2}-${index}`;
        // add styles for each div
        productDiv.style.border = "1px solid black";
        productDiv.style.margin = "0.5rem";
        productDiv.style.padding = "0.5rem";
        productDiv.style.borderRadius = "1rem";
        productDiv.classList.add("product-div");

        const plusButton = document.createElement("button");
        plusButton.textContent = "+";
        plusButton.style.marginLeft = "5px";
        plusButton.addEventListener("click", () => {
          addAmount(quantityID, product.quantity); // Assuming addAmount increases the quantity of the product
        });

        const minusButton = document.createElement("button");
        minusButton.textContent = "-";
        minusButton.style.marginLeft = "5px";
        minusButton.addEventListener("click", () => {
          minusAmount(quantityID); // Assuming minusAmount decreases the quantity of the product
        });

        // view data inside that div
        productDiv.innerHTML = `
              <h3 name="name"> Name: ${product.name} </h3>
              <img src="${product.image}">
              <p name ="category"> Category: ${product.category} </p>
              <p name ="price" > Price: ${product.price} </p>
              <p name ="description"> Description: ${product.description} </p>
              <p> Quantity: <input disabled name ="quanity" id =${quantityID} type ="number" value =1 /> </p>
              <input name="product" hidden value = ${product.id}>
            
           
            `;

        productDiv.appendChild(plusButton);
        productDiv.appendChild(minusButton);
        cartList.appendChild(productDiv);
        total_price+=product.price
      });
    });
    const submitOrder = document.createElement("button");
    submitOrder.textContent = "Submit Order";
    submitOrder.style.marginLeft = "20px";
    const totalPrice = document.createElement("div");
    totalPrice.classList.add("total-price");
    totalPrice.textContent = `Total : ${total_price}`;
    totalPrice.style.margin = "20px";
    
    submitOrder.addEventListener("click", () => {
      submitOrderLogic();
    });

    cartList.appendChild(totalPrice);
    cartList.appendChild(submitOrder);
  } catch (error) {
    console.error("Error rendering cartlist:", error);
  }
}

// Call the function to render wishlist
renderCartList();
