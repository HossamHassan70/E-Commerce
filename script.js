let productsData = [];
let userData = [];
let categories = [];
let orders = [];

let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
const cart = JSON.parse(localStorage.getItem("cart")) || [];

let productsRendered = false;
let categoriesRendered = false;
let adminPanelRendered = false;

// Data Getters Section ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
const getUsersData = async () => {
  const response = await axios.get("http://localhost:3000/users");
  userData.push(...response.data);
};

const getProducts = async () => {
  const response = await axios.get("http://localhost:3000/products");
  productsData.push(...response.data);
};

const getCatigories = async () => {
  const response = await axios.get("http://localhost:3000/categories");
  categories.push(...response.data);
};

// get Orders
const getOrders = async () => {
  const response = await axios.get("http://localhost:3000/orders");
  orders.push(...response.data);
};

// Page and routing handlers section //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

const showPage = (pageName) => {
  const pages = document.querySelectorAll(".page");
  const body = document.querySelector("body");

  pages.forEach((page) => {
    if (page.classList.contains(pageName)) {
      activatePage(page);
      if (pageName === "home") {
        if (!productsRendered) renderProductsList();
      } else if (pageName === "admin-panel") {
        if (!adminPanelRendered) renderAdminPanel();
      }
    } else {
      deactivatePage(page);
    }
  });

  // Add a class to the body when login or register page is active
  if (pageName === "login" || pageName === "register") {
    body.classList.add("hide-header");
  } else {
    body.classList.remove("hide-header");
  }
};

// Define a function to extract the route from the URL
const getRouteFromUrl = () => {
  const hash = window.location.hash;
  return hash.slice(1); // Remove the '#' at the beginning
};

// Listen for hash changes and update the page accordingly
window.addEventListener("hashchange", () => {
  const newRoute = getRouteFromUrl();
  showPage(newRoute);
});

const activatePage = (page) => {
  page.classList.add("active");
  page.classList.remove("disabled");
};

const deactivatePage = (page) => {
  page.classList.add("disabled");
  page.classList.remove("active");
};

// Cart Section ///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

const addToCart = (id) => {
  const product = productsData.find((product) => product.id === id);
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let alreadyInCartIndex = cart.indexOf(id);
  if (alreadyInCartIndex !== -1) {
    cart[alreadyInCartIndex].quantity++;
  }
  if (alreadyInCartIndex === -1) {
    cart.push({ ...product, quantity: 1 });
  }

  // don't forget to update the quantity on the productsData
  productsData = productsData.map((product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem) {
      product.quantity -= cartItem.quantity;
    }
    return product;
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
};

const renderCart = () => {
  const cartList = document.querySelector(".cart-list");
  const cartHeader = document.createElement("h2");
  cartHeader.innerText = "Cart";
  cartList.appendChild(cartHeader);
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "category-card";
    cartItem.innerHTML = `
    <div>
      <div>
        <p> Product: ${item.name} </p>
        <p> Quantity: ${item.quantity} </p> 
        <p> Price: ${item.price} </p> 
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap:1rem;
        "
      >
        <button onclick="removeFromCart(${item.id})" class="button-delete">
          <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 69 14"
    class="svgIcon bin-top"
  >
    <g clip-path="url(#clip0_35_24)">
      <path
        fill="black"
        d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_35_24">
        <rect fill="white" height="14" width="69"></rect>
      </clipPath>
    </defs>
  </svg>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 69 57"
    class="svgIcon bin-bottom"
  >
    <g clip-path="url(#clip0_35_22)">
      <path
        fill="black"
        d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_35_22">
        <rect fill="white" height="57" width="69"></rect>
      </clipPath>
    </defs>
  </svg>
          </button>
      </div>
    </div>
    `;

    cartList.appendChild(cartItem);
  });

  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const totalDiv = document.createElement("div");
  totalDiv.className = "category-card";
  totalDiv.innerHTML = `
  <div>
    <p> Total: ${total} </p>
  </div>
  `;

  cartList.appendChild(totalDiv);
};

const removeFromCart = (id) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.querySelector(".cart-list");
  const cartHeader = document.querySelector("h2");
  const cartItem = document.querySelector(".category-card");
  const totalDiv = document.querySelector(".category-card");
  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  let alreadyInCartIndex = cart.indexOf(id);
  if (alreadyInCartIndex !== -1) {
    cart[alreadyInCartIndex].quantity--;
  }
  if (alreadyInCartIndex === -1) {
    cart.splice(alreadyInCartIndex, 1);
  }

  // don't forget to update the productsData
  productsData = productsData.map((product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem) {
      product.quantity += cartItem.quantity;
    }
    return product;
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  cartList.removeChild(cartHeader);
  cartList.removeChild(cartItem);
  cartList.removeChild(totalDiv);
  renderCart();
};

// Users Section ////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const renderUsersList = () => {
  const usersList = document.querySelector(".users-list");
  const usersHeader = document.createElement("h2");
  usersHeader.innerText = "Users";
  usersList.appendChild(usersHeader);

  userData.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.className = "category-card";

    // appendchild h2 with the header users

    // view data inside that div
    userDiv.innerHTML = `
              <div>
                <p> Name: ${user.name} </p>
                <p> Email: ${user.email} </p>
                <p> Job: ${user.job} </p>
                <p> Role: ${user.admin ? "Admin" : "Not Admin"} </p>
              </div>
        `;

    usersList.appendChild(userDiv);
  });
};

// Orders Section ////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
const renderOrdersList = () => {
  const ordersList = document.querySelector(".orders-list");
  const ordersHeader = document.createElement("h2");
  ordersHeader.innerText = "Orders";
  ordersList.appendChild(ordersHeader);

  orders.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "category-card";

    orderDiv.innerHTML = `
    <div>
      <div>
        <p> User: ${order.forUser} </p>
        <p> Product: ${order.productName} </p>
        <p> Quantity: ${order.quantity} </p>
        <p> Status: ${order.status} </p>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap:1rem;
          "
        >
          <button onclick="updateOrderStatus(${order.id})" class="button">Update </button>
          <button onclick="deleteOrder(${order.id})" class="button-delete">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 69 14"
              class="svgIcon bin-top"
            >
              <g clip-path="url(#clip0_35_24)">
                <path
                  fill="black"
                  d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_35_24">
                  <rect fill="white" height="14" width="69"></rect>
                </clipPath>
              </defs>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 69 57"
              class="svgIcon bin-bottom"
            >
              <g clip-path="url(#clip0_35_22)">
                <path
                  fill="black"
                  d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_35_22">
                  <rect fill="white" height="57" width="69"></rect>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>



        
    </div>
              
        `;

    ordersList.appendChild(orderDiv);
  });
};

// update order status
const updateOrderStatus = (id) => {
  const newStatus = prompt("Enter the new status");
  if (newStatus === null) return;

  axios
    .patch(`http://localhost:3000/orders/${id}`, { status: newStatus })
    .then((response) => {
      alert(response.statusText);
    })
    .catch((err) => {
      console.log(err);
    });
};

// delete order status
const deleteOrder = (id) => {
  axios
    .delete(`http://localhost:3000/orders/${id}`)
    .then((response) => {
      alert(response.statusText);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Admin Secion ////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
const renderAdminPanel = () => {
  const isUserAdmin = loggedUser ? loggedUser.admin : false;

  if (!isUserAdmin) return;

  if (isUserAdmin) {
    const adminPanel = document.querySelector(".admin-panel");
    if (!adminPanel || adminPanelRendered) return; // If there is no list or it has already been rendered, exit the function
    if (!adminPanelRendered) {
      renderAddCategoryForm();
      renderCategoriesList();
      renderUsersList();
      renderAdminProductsList();
      renderAddProductForm();
      renderOrdersList();
    }
    adminPanelRendered = true;
  } else {
    const adminPanel = document.querySelector(".admin-panel");
    adminPanel.innerHTML = `
    <div class="not-admin-container">
    <div class="message-wrapper">
    <h1> You are not allowed to be here </h1>
    </div>
    
    </div>
    `;
  }
};

// Categories Section /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
const deleteCategory = (id) => {
  axios
    .delete(`http://localhost:3000/categories/${id}`)
    .then((response) => {
      alert(response.statusText);
    })
    .catch((err) => {
      console.log(err);
    });
};

const AddCategory = (event) => {
  event.preventDefault();

  const name = event.target.elements["name"].value;

  // name not empty
  if (name === "") {
    alert("Name is required");
    return;
  }

  axios.post("http://localhost:3000/categories", { name }).then((response) => {
    alert(response.statusText);
  });
};

const renderAddCategoryForm = () => {
  const adminPanel = document.querySelector(".add-category");

  adminPanel.innerHTML = `  
  <div
    style="
      background-color:#fff;
      border-radius:0.5rem;
      padding:1rem
    "
  >

  <h2>
    Add Category
  </h2>
    <form
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap:1rem;
        padding:1rem;
      "
    >
      <input type="text" name="name" placeholder="Category name" class="input"/>
      <button type="submit" class="button">Add</button>
    </form>
  <div>
`;
};

const renderCategoriesList = () => {
  const categoriesList = document.querySelector(".categories-list");
  const categoriesHeader = document.createElement("h2");
  categoriesHeader.innerText = "Categories";
  categoriesList.appendChild(categoriesHeader);

  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-card");

    // view data inside that div
    categoryDiv.innerHTML = `
              <p> ${category.name} </p>
              ${
                loggedUser.admin
                  ? `<button onclick="deleteCategory(${category.id})" class="button-delete"><svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 69 14"
    class="svgIcon bin-top"
  >
    <g clip-path="url(#clip0_35_24)">
      <path
        fill="black"
        d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_35_24">
        <rect fill="white" height="14" width="69"></rect>
      </clipPath>
    </defs>
  </svg>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 69 57"
    class="svgIcon bin-bottom"
  >
    <g clip-path="url(#clip0_35_22)">
      <path
        fill="black"
        d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_35_22">
        <rect fill="white" height="57" width="69"></rect>
      </clipPath>
    </defs>
  </svg></button>`
                  : ""
              }
          `;
    categoriesList.appendChild(categoryDiv);
  });
};

// Products Section ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

// update product
const updateProduct = (id) => {
  const name = prompt("Enter the new name");
  const image = prompt("Enter the new image");
  const category = prompt("Enter the new category");
  const price = prompt("Enter the new price");
  const description = prompt("Enter the new description");
  const quantity = prompt("Enter the new quantity");

  const data = {
    name,
    image,
    category,
    price,
    description,
    quantity,
  };

  axios
    .patch(`http://localhost:3000/products/${id}`, data)
    .then((response) => {
      alert(response.statusText);
    })
    .catch((err) => {
      console.log(err);
    });
};

const AddProduct = (event) => {
  event.preventDefault();

  const name = event.target.elements["name"].value;
  const image = event.target.elements["image"].value;
  const category = event.target.elements["category"].value;
  const price = event.target.elements["price"].value;
  const description = event.target.elements["description"].value;
  const quantity = event.target.elements["quantity"].value;

  const data = {
    name,
    image,
    category,
    price,
    description,
    quantity,
  };

  const errorLog = [];

  // name not empty
  if (name === "") {
    errorLog.push("Name is required");
  }

  // name must be a string
  if (!isNaN(name)) {
    errorLog.push("Product Name must be a string");
  }

  // image not empty
  if (image === "") {
    errorLog.push("Image is required");
  }
  // check that the user has selected a category
  if (category === "") {
    errorLog.push("Category is required");
  }

  // check that the price is a number
  if (isNaN(price)) {
    errorLog.push("Price must be a number");
  }

  // check that the description is not empty
  if (description === "") {
    errorLog.push("Description is required");
  }

  // check that the quantity is a number
  if (isNaN(quantity)) {
    errorLog.push("Quantity must be a number");
  }

  // return the error log
  if (errorLog.length > 0) {
    alert(errorLog.join("\n"));
    return;
  }
  axios.post("http://localhost:3000/products", data).then((response) => {
    alert(response.statusText);
  });
};

const deleteProduct = (id) => {
  axios
    .delete(`http://localhost:3000/products/${id}`)
    .then((result) => {
      alert(result.statusText);
    })
    .catch((err) => {
      console.log(err);
    });
};

const renderAddProductForm = () => {
  const addProductList = document.querySelector(".add-product");
  const header = document.createElement("h2");
  header.innerText = "Add Product";
  addProductList.appendChild(header);

  addProductList.innerHTML = `  
  <div
    style="
      background-color:#fff;
      border-radius:0.5rem;
      padding:1rem
    "
  >
  
  
  <h2>
    Add Product
  </h2>
    <form
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap:1rem;
        padding:1rem;
      "
    >
      <input type="text" name="name" placeholder="Product name" class="input"/>
      <input type="text" name="image" placeholder="Product image" class="input"/>
      <input type="number" name="price" placeholder="Product price" class="input"/>
      <input type="text" name="description" placeholder="Product description" class="input"/>
      <input type="number" name="quantity" placeholder="Product quantity" class="input"/>
      <select name="category" id="category" class="input">
      <option value="">Select a category</option>
      </select>
      <button type="submit" class="button">Add</button>
    </form>
  <div>
`;
};

const renderProductsList = () => {
  const productsList = document.querySelector(".products-list");

  productsData.forEach((product) => {
    const productDiv = document.createElement("div");

    productDiv.innerHTML = `
      <div class="card">
        <img class="card-img"
          src="${product.image}"
        />
        <div class="card-info">
          <p class="text-title">
            ${product.name}
          </p>
          <div class="text-body">
            <p> ${product.description} </p>
        </div>
        <div>
          <div class="card-footer">
            <span class="text-title">$
            ${product.price}
            </span>
            <div>
              <button class="button"
              onclick="addToCart(${product.id})"
              >Add to cart</button>
            </div>
          </div>
          <span class="text-title">
            Qty: ${product.quantity}
          </span>
        </div>
      </div>
        `;
    productsList.appendChild(productDiv);
  });

  productsRendered = true; // Set the flag to true after rendering
};

const renderAdminProductsList = () => {
  const productsList = document.querySelector(".admin-products-list");

  productsData.forEach((product) => {
    const productDiv = document.createElement("div");

    productDiv.innerHTML = `
      <div class="card">
        <img class="card-img"
          src="${product.image}"
        />
        <div class="card-info">
          <p class="text-title">
            ${product.name}
          </p>
          <div class="text-body">
            <p> ${product.description} </p>
        </div>
        <div>
          <div class="card-footer">
            <span class="text-title">$
            ${product.price}
            </span>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;  
                gap:1rem;
              "
            >
            <button class="scroll-up"
            onclick="updateProduct(${product.id})"
            >
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 0h24v24H0z" fill="none"></path>
		<path fill="rgba(255,255,255,1)" d="M11.9997 10.8284L7.04996 15.7782L5.63574 14.364L11.9997 8L18.3637 14.364L16.9495 15.7782L11.9997 10.8284Z">
		</path>
	</svg>
</button>
              <button onclick="deleteProduct(${product.id})" class="button-delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 69 14"
                  class="svgIcon bin-top"
                >
                  <g clip-path="url(#clip0_35_24)">
                    <path
                      fill="black"
                      d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_35_24">
                      <rect fill="white" height="14" width="69"></rect>
                    </clipPath>
                  </defs>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 69 57"
                  class="svgIcon bin-bottom"
                >
                  <g clip-path="url(#clip0_35_22)">
                    <path
                      fill="black"
                      d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_35_22">
                      <rect fill="white" height="57" width="69"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
          <span class="text-title">
            Qty: ${product.quantity}
          </span>
        </div>
      </div>
        `;
    productsList.appendChild(productDiv);
  });

  productsRendered = true; // Set the flag to true after rendering
};

// Login and Register //////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
const Register = (event) => {
  event.preventDefault();
  const name = event.target.elements["name"].value;
  const email = event.target.elements["email"].value;
  const job = event.target.elements["job"].value;
  const password = event.target.elements["password"].value;

  const data = {
    name,
    email,
    job,
    password,
    admin: false,
  };
  let errorLog = [];

  // check if the email is already registered
  userData.forEach((user) => {
    if (user.email === email) {
      errorLog.push("Email already registered");
    }
  });

  // check if job is number it must be a string
  if (!isNaN(job)) {
    errorLog.push("Job must be a string");
  }

  // check if the password is less than 8 characters
  if (password.length < 8) {
    errorLog.push("Password must be at least 8 characters");
  }

  // check if the password contains a number
  if (!/\d/.test(password)) {
    errorLog.push("Password must contain a number");
  }

  // check if the password contains a capital letter
  if (!/[A-Z]/.test(password)) {
    errorLog.push("Password must contain a capital letter");
  }

  // check if the password contains a small letter
  if (!/[a-z]/.test(password)) {
    errorLog.push("Password must contain a small letter");
  }

  // check if the password contains a special character
  if (!/[!@#$%^&*]/.test(password)) {
    errorLog.push("Password must contain a special character");
  }

  // return the error log
  if (errorLog.length > 0) {
    alert(errorLog.join("\n"));
    return;
  } else {
    alert("Registered successfully");
  }

  axios.post("http://localhost:3000/users", data).then(
    (response) => {
      if (response.status === 201) {
        // navigate to the home page
        window.location.hash = "home";
      }
    },
    (error) => {
      console.log(error);
    }
  );
};

const Login = (event) => {
  event.preventDefault();

  let userFound = false;

  const userEmail = event.target.elements["email"].value;
  const userPassword = event.target.elements["password"].value;

  userData.forEach((user) => {
    if (user.email === userEmail && user.password === userPassword) {
      userFound = true;
      loggedUser = user;
    }
  });

  if (userFound) {
    alert("Logged in successfully");
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

    window.location.hash = "home";
    window.location.reload();
  } else {
    alert("Wrong email or password");
  }
};

// Update the window.onload function
window.onload = async () => {
  await getUsersData();
  await getProducts();
  await getCatigories();
  await getOrders();
  renderCart();

  const initialRoute = await getRouteFromUrl();
  showPage(initialRoute);

  // if user logged in remove the button and login buttons and make a <p> tag with the name
  const authButtons = document.querySelector(".auth-buttons");

  if (loggedUser) {
    authButtons.innerHTML = `
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap:1rem;
      "
    >
      ${loggedUser.admin ? `<a href="#admin-panel">Admin Panel</a>` : ""}
      <p> ${loggedUser.name} </p>
      <button class="Btn"
        onclick="localStorage.removeItem('loggedUser'); window.location.reload();"
      >
        <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
        
      </button>

    </div>
    `;
  } else {
    authButtons.innerHTML = `
    <div  
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;  
      "
    >
      <button data-page="login">Login</button>
      <button data-page="register">Register</button>
    </div>
    `;
  }

  // render a select list of categories in a select with id category
  if (loggedUser) {
    const categorySelect = document.querySelector("#category");
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.innerText = category.name;
      categorySelect.appendChild(option);
    });
  }

  // Update your li and button event listeners to change the hash on click
  const l_i_s = document.querySelectorAll("li[data-page]");
  l_i_s.forEach((li) => {
    li.addEventListener("click", () => {
      const pageName = li.getAttribute("data-page");
      window.location.hash = pageName;
    });
  });

  const buttons = document.querySelectorAll("button[data-page]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const pageName = button.getAttribute("data-page");
      window.location.hash = pageName;
    });
  });

  const registerForm = document.querySelector(".register form");
  registerForm.addEventListener("submit", Register);

  const isAdmin = document.querySelector("#isAdmin");
  isAdmin.addEventListener("change", () => {
    alert("You are not allowed to be an admin, please contact us :^)");

    // uncheck the admin checkbox
    isAdmin.checked = false;
  });

  const loginForm = document.querySelector(".login form");
  loginForm.addEventListener("submit", Login);

  // perform if the current page was admin-panel
  if (adminPanelRendered) {
    const addProductForm = document.querySelector(".add-product form");
    addProductForm.addEventListener("submit", AddProduct);

    const addCategoryForm = document.querySelector(
      ".admin-panel .add-category form"
    );
    addCategoryForm.addEventListener("submit", AddCategory);
  }
};
