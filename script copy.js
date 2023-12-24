let productsData = [];
let userData = [];
let categories = [];

let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

let productsRendered = false;
let categoriesRendered = false;
let adminPanelRendered = false;

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

const showPage = (pageName) => {
  const pages = document.querySelectorAll(".page");
  const body = document.querySelector("body");

  pages.forEach((page) => {
    if (page.classList.contains(pageName)) {
      activatePage(page);
      if (pageName === "home") {
        if (!productsRendered) renderAdminProductsList();
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

// Categories Section
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

const renderAdminPanel = () => {
  const isUserAdmin = loggedUser.admin;
  if (!isUserAdmin) return;

  if (isUserAdmin) {
    const adminPanel = document.querySelector(".admin-panel");
    if (!adminPanel || adminPanelRendered) return; // If there is no list or it has already been rendered, exit the function
    if (!adminPanelRendered) {
      renderAddCategoryComponent();
      renderCategoriesList();
      renderUsersList();
      renderAdminProductsList();
      renderAddProduct();
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

const renderAddCategoryComponent = () => {
  const adminPanel = document.querySelector(".add-category");
  const header = document.createElement("h2");
  header.innerText = "Add Category";
  adminPanel.appendChild(header);

  adminPanel.innerHTML = `  
  <div
    style="
      background-color:#fff;
      border-radius:0.5rem;
      padding:1rem
    "
  >
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

// Products Section
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

const renderAddProduct = () => {
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
        <span class="text-title">
          ${product.quantity}
        </span>
        <div class="card-button">
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
            <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
            <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
          </svg>
        </div>
      </div>
    </div>
        `;
    productsList.appendChild(productDiv);
  });

  productsRendered = true; // Set the flag to true after rendering
};

// Login and Register
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
  } else {
    alert("Wrong email or password");
  }
};

// Update the window.onload function
window.onload = async () => {
  await getUsersData();
  await getProducts();
  await getCatigories();
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
      <button onclick="localStorage.removeItem('loggedUser'); window.location.reload()">Logout</button>
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
      <button data-page="login">Login</button>
      <button data-page="register">Register</button>
    </div>
    `;
  }

  // render a select list of categories in a select with id category
  const categorySelect = document.querySelector("#category");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.innerText = category.name;
    categorySelect.appendChild(option);
  });

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

  const addProductForm = document.querySelector(".add-product form");
  addProductForm.addEventListener("submit", AddProduct);

  const addCategoryForm = document.querySelector(
    ".admin-panel .add-category form"
  );
  addCategoryForm.addEventListener("submit", AddCategory);
};
