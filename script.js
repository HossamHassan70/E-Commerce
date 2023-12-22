let productsData = [];
let userData = [];
let categories = [];

let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

let productsRendered = false;
let usersListRendered = false;
let categoriesRendered = false;

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
      activatePage(page, pageName);
      if (pageName === "users-list") {
        if (!usersListRendered) renderUsersList();
      } else if (pageName === "home") {
        if (!productsRendered) renderProducts();
      } else if (pageName === "admin-panel") {
        if (!categoriesRendered) renderCategories();
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

const activatePage = (page, pageName) => {
  page.classList.add("active");
  page.classList.remove("disabled");
};

const deactivatePage = (page) => {
  page.classList.add("disabled");
  page.classList.remove("active");
};

const renderUsersList = () => {
  if (usersListRendered) {
    return; // If already rendered, exit the function
  }

  const usersList = document.querySelector(".users-list");

  userData.forEach((user) => {
    const userDiv = document.createElement("div");

    // add styles for each div
    userDiv.style.border = "1px solid black";
    userDiv.style.margin = "0.5rem";
    userDiv.style.padding = "0.5rem";
    userDiv.style.borderRadius = "1rem";

    // view data inside that div
    userDiv.innerHTML = `
            <h3> ${user.name} </h3>
            <p> ${user.email} </p>
            <p> ${user.job} </p>
            <p> ${user.admin ? "Admin" : "Not Admin"} </p>
        `;

    usersList.appendChild(userDiv);
  });

  usersListRendered = true; // Set the flag to true after rendering
};

// Categories Section
const AddCategory = (event) => {
  event.preventDefault();

  const name = event.target.elements["name"].value;

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

const renderCategories = () => {
  const categoriesList = document.querySelector(".categories-list");
  if (!categoriesList || categoriesRendered) return; // If there is no list or it has already been rendered, exit the function
  if (!categoriesRendered) {
    categories.forEach((category) => {
      const categoryDiv = document.createElement("div");

      // add styles for each div
      categoryDiv.style.border = "1px solid black";
      categoryDiv.style.margin = "0.5rem";
      categoryDiv.style.padding = "0.5rem";
      categoryDiv.style.borderRadius = "0.5rem";

      // view data inside that div
      categoryDiv.innerHTML = `
              <p> ${category.name} </p>
              ${
                loggedUser.admin
                  ? `<button onclick="deleteCategory(${category.id})">Delete</button>`
                  : ""
              }
          `;
      categoriesList.appendChild(categoryDiv);
    });
  }
  categoriesRendered = true; // Set the flag to true after rendering
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

  axios.post("http://localhost:3000/products", data).then((response) => {
    alert(response.statusText);
  });
};

const deleteProduct = (id) => {
  axios
    .delete(`http://localhost:3000/products/${id}`)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const renderProducts = () => {
  const productsList = document.querySelector(".products-list");

  productsData.forEach((product) => {
    const productDiv = document.createElement("div");

    // add styles for each div
    productDiv.style.border = "1px solid black";
    productDiv.style.margin = "0.5rem";
    productDiv.style.padding = "0.5rem";
    productDiv.style.borderRadius = "1rem";

    // view data inside that div
    productDiv.innerHTML = `
            <h3> Name: ${product.name} </h3>
            <p> Image :${product.image} </p>
            <p> Category: ${product.category} </p>
            <p> Price: ${product.price} </p>
            <p> Description: ${product.description} </p>
            <p> Stock Quantity: ${product.quantity} </p>
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

  userData.map((user) => {
    if (user.email === userEmail) {
      if (user.password === userPassword) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        loggedUser = user;
        alert("Logged in successfully");

        // go to home page
        window.location.hash = "home";
      }
    }
  });
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
      "
    >
      <p
        style="
          margin-right: 0.5rem;
        "
      > ${loggedUser.name} </p>
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
      "
    >
      <button
        style="
          margin-right: 0.5rem;
          "
          onclick="showPage('login')"
      >Login</button>
      <button onclick="showPage('register')">Register</button>
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

  const addCategoryForm = document.querySelector(".admin-panel .add-category");
  addCategoryForm.addEventListener("submit", AddCategory);
};
