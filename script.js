let productsData = [];
let userData = [];
let categories = [];
let orders = [];

let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

let productsRendered = false;
let categoriesRendered = false;
let adminPanelRendered = false;
let profilePageRenderd = false;
let registerPageRenderd = false;
let cartRenderd = false;

//////////////////////////////////////////////////////////////
// Function to open the modal
function openModal() {
  renderCart();
  document.getElementById("cart-modal").style.display = "flex";
}

// Function to close the modal
function closeModal() {
  document.getElementById("cart-modal").style.display = "none";
}

function openWishlistModal() {
  renderWishlist();
  document.getElementById("wishlist-modal").style.display = "flex";
}

// Function to close the modal
function closeWishlistModal() {
  document.getElementById("wishlist-modal").style.display = "none";
}

////////////////////////////////////////////

// Data Getters Section ////////////////////////////////////////////////////
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
const showPage = (pageName) => {
  const pages = document.querySelectorAll(".page");
  const body = document.querySelector("body");

  pages.forEach((page) => {
    if (page.classList.contains(pageName)) {
      activatePage(page);
      if (pageName === "home") {
        if (!productsRendered) HomePage();
      } else if (pageName === "admin-panel") {
        if (!adminPanelRendered) renderAdminPanel();
      } else if (pageName === "profile") {
        if (!profilePageRenderd) renderProfilePage();
      } else if (pageName === "register") {
        if (!registerPageRenderd) {
          const registerForm = document.querySelector(".register form");
          registerForm.addEventListener("submit", Register);
          // get the form
          registerPageRenderd = true;
        }
      }
    } else {
      deactivatePage(page);
    }
  });

  // Add a class to the body when login or register page is active
  if (pageName === "login" || pageName === "register") {
    body.classList.add("hide-header");
    body.classList.add("hide-footer");
  } else {
    body.classList.remove("hide-header");
    body.classList.remove("hide-footer");
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
const decreaseQuantity = (id) => {
  // Get the cart from local storage
  const cart = JSON.parse(localStorage.getItem("cart"));

  // Find the item in the cart
  const cartItem = cart.find((item) => item.id === id);

  // Update the quantity
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity--;

    // Update the local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Render the cart with the updated quantities
    renderCart();
  }
};

const increaseQuantity = (id) => {
  // Get the cart from local storage
  const cart = JSON.parse(localStorage.getItem("cart"));

  // Find the item in the cart
  const cartItem = cart.find((item) => item.id === id);

  // Update the quantity
  if (cartItem) {
    cartItem.quantity++;

    // Update the local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Render the cart with the updated quantities
    renderCart();
  }
};

const renderCart = () => {
  const cartList = document.querySelector(".cart-list");
  // Clear existing content in the cart list
  cartList.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("cart"));

  if (!cart) return;

  // filter data according to the user id
  const userCart = cart.filter((item) => {
    return item.user_id === loggedUser.id;
  });

  if (!userCart || !userCart.length) {
    const emptyCart = document.createElement("div");

    emptyCart.innerHTML = `
    <div>
      <p> Your cart is empty </p>
    </div>
    `;
    cartList.appendChild(emptyCart);
    return;
  } else {
    userCart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.innerHTML = `
    <div
      class="category-card"
      style="
        display: flex;
        justify-content: space-between;
        gap:1rem;
      "
    >
      <div>
        <p> Product: ${item.name} </p>
        <div>
          <button onclick="decreaseQuantity(${item.id})">-</button>
          <input
            type="number"
            value="${item.quantity}"
            style="width: 3rem"
            disabled
          />
          <button onclick="increaseQuantity(${item.id})">+</button>
        </div>
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
  }

  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const totalDiv = document.createElement("div");
  totalDiv.className = "category-card";
  totalDiv.innerHTML = `
  <div
    style="
      display: flex;
      justify-content: space-between;
      gap:1rem;
    "
  >
    <p> Total: ${total} </p>
    <button onclick="checkout()" class="button">Checkout</button>
  </div>
  `;

  cartList.appendChild(totalDiv);
};

const addToCart = (id) => {
  const product = productsData.find((product) => product.id === id);
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // check if the product is already in the cart
  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1, user_id: loggedUser.id });
  }

  // don't forget to update the quantity on the productsData
  productsData = productsData.map((product) => {
    if (product.id === id) {
      product.quantity--;
    }
    return product;
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");

  // Render the cart after adding the product
  renderCart();
};

const checkout = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const order = {
    user_id: loggedUser.id,
    forUser: loggedUser.name,
    products: cart,
    status: "pending",
    total,
  };

  axios.post("http://localhost:3000/orders", order).then((response) => {
    alert(response.statusText);
  });
  localStorage.removeItem("cart");
  showPage("home");
};

const removeFromCart = (id) => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const cartItem = cart.find((item) => item.id === id);
  const cartItemIndex = cart.indexOf(cartItem);
  cart.splice(cartItemIndex, 1);

  // don't forget to update the quantity on the productsData
  productsData = productsData.map((product) => {
    if (product.id === id) {
      product.quantity += cartItem.quantity;
    }
    return product;
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Removed from cart");

  // Render the cart after removing the product
  renderCart();
};

// Users Section ////////////////////////////////////////////////////////////////////////
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

// Profile Section ////////////////////////////////////////////////////////
const renderProfilePage = () => {
  const profilePage = document.querySelector(".profile-page");
  const profileHeader = document.createElement("h2");

  if (!profilePageRenderd) {
    renderOrdersList();
    profilePageRenderd = true;
  }
};

// Orders Section ////////////////////////////////////////////////////////////////////////
const renderOrdersList = () => {
  // filter the orders to the user orders only
  const userOrders = orders.filter((order) => {
    return order.user_id === loggedUser.id;
  });

  const ordersList = document.querySelector(".orders-list");
  const ordersHeader = document.createElement("h2");
  ordersHeader.innerText = "Orders";
  ordersList.appendChild(ordersHeader);

  userOrders.forEach((order) => {
    const orderDiv = document.createElement("div");

    orderDiv.innerHTML = `
    <div class="category-card">
      <div>
        <p> User: ${order.forUser} </p>
        <p> Total: ${order.total} </p>
        <p> Products: ${order.products
          .map((product) => {
            return `${product.quantity} x ${product.name}`;
          })
          .join(", ")} 
        </p>            
        </div>
        
          <p> Status: ${order.status} </p>
          
        
    </div>
      `;

    ordersList.appendChild(orderDiv);
  });
};

const renderAdminOrdersList = () => {
  const ordersList = document.querySelector(".admin-orders-list");
  const ordersHeader = document.createElement("h2");
  ordersHeader.innerText = "Orders";
  ordersList.appendChild(ordersHeader);

  orders.forEach((order) => {
    const orderDiv = document.createElement("div");

    orderDiv.innerHTML = `
    <div class="category-card">
      <div>
        <p> User: ${order.forUser} </p>
        <p> Total: ${order.total} </p>
        <p> Products: ${order.products
          .map((product) => {
            return `${product.quantity} x ${product.name}`;
          })
          .join(", ")} 
        </p>            
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap:1rem;"
        >
          <p> Status: ${order.status} </p>
          
          <select
            name="status"
            id="status"
            style="
              padding: 0.5rem;
              border-radius: 0.5rem;
              border: 1px solid #ccc;
            "
            onchange="updateOrderStatus(${order.id}, this.value)"
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
          </select>
        </div>        
    </div>
      `;

    ordersList.appendChild(orderDiv);
  });
};

const updateOrderStatus = (id, value) => {
  const newStatus = value;

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
      renderAdminOrdersList();
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
    ">
    <h2>
      Add Category
    </h2>
    <form
      onsubmit="event.preventDefault(); AddCategory(event)"
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

// {
//     "name": "Mahmoud Ahmed",
//     "email": "hoda@gmail.com",
//     "job": "Freelancer",
//     "password": "Hoda@2468",
//     "admin": false,
//     "id": 10,
//     "wishlist": []
//   },
// data schema
// if user logged in add the product to wishlist in the database on user object and if clicked again remove it
// if user not logged in alert to login
// if user logged in and clicked on the wishlist button and the product is already in the wishlist remove it from the wishlist

// add to wishlist

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

const AddProduct = (ThisFromTheForm) => {
  const name = ThisFromTheForm.elements["name"].value;
  const image = ThisFromTheForm.elements["image"].value;
  const category = ThisFromTheForm.elements["category"].value;
  const price = ThisFromTheForm.elements["price"].value;
  const description = ThisFromTheForm.elements["description"].value;
  const quantity = ThisFromTheForm.elements["quantity"].value;

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
    onsubmit="event.preventDefault(); AddProduct(this)"
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
        ${categories
          .map((category) => {
            return `<option value="${category.name}">${category.name}</option>`;
          })
          .join("")}
        }
      </select>
      <button type="submit" class="button">Add</button>
    </form>
  <div>
`;
};

const HomePage = () => {
  const filtersButton = document.querySelector(".filters");

  // create a select options that updates the list and filters data on the filters and rerenders the new list on change
  const select = document.createElement("select");
  select.name = "category";
  select.id = "category";
  select.className = "input";
  select.innerHTML = `
    <option value="">Select a category</option>
    ${categories
      .map((category) => {
        return `<option value="${category.name}">${category.name}</option>`;
      })
      .join("")}
  `;
  filtersButton.appendChild(select);

  // listen to the select change event
  select.addEventListener("change", (event) => {
    renderProductsList(event.target.value);
  });
  renderProductsList();

  productsRendered = true;
};

// add to wishlist
const addToWishlist = (id) => {
  if (loggedUser) {
    const user = userData.find((user) => user.id === loggedUser.id);

    // check if the product with the id found on the user wish list or not
    if (!user.wishList.find((product) => product.id === id)) {
      // add the product to the wishlist
      const product = productsData.find((product) => product.id === id);
      user.wishList.push(product);

      // update the user data
      axios
        .patch(`http://localhost:3000/users/${user.id}`, user)
        .then((response) => {
          alert(response.statusText);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // if product found alert that the product already on the wishlist
    else {
      alert("Product already in the wishlist");
    }
  } else {
    alert("Please login first");
  }
};

// remove from wishlist
const removeFromWishlist = (id) => {
  if (loggedUser) {
    const user = userData.find((user) => user.id === loggedUser.id);

    // check if the product with the id found on the user wish list or not
    if (user.wishList.find((product) => product.id === id)) {
      // remove the product from the wishlist
      user.wishList = user.wishList.filter((product) => product.id !== id);
    } else {
      // add the product to the wishlist
      const product = productsData.find((product) => product.id === id);
      user.wishList.push(product);
    }

    // update the user data
    axios
      .patch(`http://localhost:3000/users/${user.id}`, user)
      .then((response) => {
        alert(response.statusText);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    alert("Please login first");
  }
};

const renderWishlist = () => {
  const wishlist = document.querySelector(".wishlist");

  wishlist.innerHTML = "";

  if (loggedUser) {
    const user = userData.find((user) => user.id === loggedUser.id);

    if (user.wishList.length > 0) {
      user.wishList.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "category-card";

        productDiv.innerHTML = `
              <div>
                <p> Name: ${product.name} </p>
                <p> Price: ${product.price} </p>
                <p> Description: ${product.description} </p>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  gap:1rem;
                "
              >
              <div class="card-button" onclick="addToCart(${product.id})">
                <svg class="svg-icon" viewBox="0 0 20 20">
                  <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                  <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                  <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                </svg>
              </div>    

                <button onclick="
                  removeFromWishlist(${product.id})
                " class="button-delete">
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
        `;

        wishlist.appendChild(productDiv);
      });
    } else {
      const emptyWishlist = document.createElement("div");

      emptyWishlist.innerHTML = `
      <div>
        <p> Your wishlist is empty </p>
      </div>
      `;
      wishlist.appendChild(emptyWishlist);
    }
  } else {
    const emptyWishlist = document.createElement("div");

    emptyWishlist.innerHTML = `
    <div>
      <p> Your wishlist is empty </p>
    </div>
    `;
    wishlist.appendChild(emptyWishlist);
  }
};

const checkIfProductInWishlist = (id) => {
  if (loggedUser) {
    const user = userData.find((user) => user.id === loggedUser.id);

    if (user.wishList.find((product) => product.id === id)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const renderProductsList = (category) => {
  const productsList = document.querySelector(".products-list");

  // filter the products according to the category
  const filteredProducts = productsData.filter((product) => {
    if (category) {
      return product.category === category;
    } else {
      return product;
    }
  });

  // clear the products list
  productsList.innerHTML = "";

  filteredProducts.forEach((product) => {
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
        </div>
        <div>
          <div class="card-footer">
            <span class="text-title">Price: 
            ${product.price} $
            </span>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap:1rem;
              "
            >
              <button class="wishlist-btn" onclick="addToWishlist(${
                product.id
              })"
              >
                <svg viewBox="0 0 17.503 15.625" height="20.625" width="20.503" xmlns="http://www.w3.org/2000/svg" class="icon"
                  style="fill: ${
                    checkIfProductInWishlist(product.id) ? "red" : "black"
                  }"

                >
                  <path 
                  
                   transform="translate(0 0)" d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z" id="Fill"></path>
                </svg>
              </button>
            
              <div class="card-button" onclick="addToCart(${product.id})">
                <svg class="svg-icon" viewBox="0 0 20 20">
                  <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                  <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                  <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                </svg>
              </div>    
            </div>
          </div>
          <div>
            <span class="text-title">Qty: ${product.quantity}</span>
          </div>
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
              <button class="edit-button">
                <svg class="edit-svgIcon" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
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
    wishList: [],
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

  // i need to store the users data in local storage and add this object to the loggedUser and navigate the user to the home page
  // return the error log
  if (errorLog.length > 0) {
    alert(errorLog.join("\n"));
    return;
  } else {
    axios.post("http://localhost:3000/users", data).then((response) => {
      if (response.status === 201) {
        // store the users data in local storage
        localStorage.setItem("loggedUser", JSON.stringify(response.data));

        alert("Registered successfully");

        // navigate the user to the home page
        window.location.hash = "home";

        // reload the page
        window.location.reload();
      }
    });
  }
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

  const initialRoute = await getRouteFromUrl();

  if (!!initialRoute) {
    showPage(initialRoute);
  } else {
    window.location.hash = "home";
  }

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
      <button class="btn" type="button" onclick="openModal()">
        <strong>CART</strong>
        <div id="container-stars">
          <div id="stars"></div>
        </div>

        <div id="glow">
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
      </button>


      <a onclick="openWishlistModal()"
        style="cursor: pointer;"
      >
        Wishlist
      </a>
      
      ${loggedUser.admin ? `<a href="#admin-panel">Admin Panel</a>` : ""}
      <a href="#profile"> ${loggedUser.name} </a>
      <button class="Btn"
        onclick="localStorage.removeItem('loggedUser'); showPage('home'); window.location.reload();"
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
        gap:1rem;
      "
    >
      <button data-page="login" class="button-white">Login</button>
      <button data-page="register" class="button-white" >Register</button>
    </div>
    `;
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
};
