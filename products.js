import { categoriesURL, productURL } from "/networkConfig.js";

export const getProducts = async (productsData) => {
  const response = await axios.get(productURL);
  productsData.push(...response.data);
};

export const renderProducts = (
  productsData,
  productsRendered,
  selectedCategory
) => {
  const productsList = document.querySelector(".products-list");
  productsList.innerHTML = "";

  if (selectedCategory === undefined || selectedCategory === null) {
    selectedCategory = "All"; // Use assignment operator (=) instead of comparison (==)
  }

  const filteredProducts =
    selectedCategory === "All"
      ? productsData
      : productsData.filter((product) => product.category === selectedCategory);

  filteredProducts.forEach((product) => {
    const productDiv = document.createElement("div");

    // add styles for each div
    productDiv.style.border = "1px solid black";
    productDiv.style.margin = "0.5rem";
    productDiv.style.padding = "0.5rem";
    productDiv.style.borderRadius = "1rem";
    const addToCartButton = document.createElement("button");
    addToCartButton.style.marginLeft = "5px";
    addToCartButton.textContent = "Add To Cart";
    addToCartButton.addEventListener("click", () => {
      addToCart(product); // Assuming addToCart function adds the product to cart
    });

    const addToWishlistButton = document.createElement("button");
    addToWishlistButton.style.marginLeft = "5px";
    addToWishlistButton.textContent = "Add To Wishlist";
    addToWishlistButton.addEventListener("click", () => {
      addToWishlist(product); // Assuming addToWishlist function adds the product to wishlist
    });
    // view data inside that div
    productDiv.innerHTML = `
        <h3> Name: ${product.name} </h3>
        <img src="${product.image}">
        <p> Category: ${product.category} </p>
        <p> Price: ${product.price} </p>
        <p> Description: ${product.description} </p>
        <p> Stock Quantity: ${product.quantity} </p>
       
      `;
    productDiv.appendChild(addToCartButton);
    productDiv.appendChild(addToWishlistButton);
    productsList.appendChild(productDiv);
  });

  // Return a boolean value to indicate rendering status instead of modifying argument
  productsRendered = true;
};

export const getCatigories = async (categories) => {
  const response = await axios.get(categoriesURL);
  categories.push(...response.data);
};

export const renderCategories = (
  categories,
  categoriesRendered,
  loggedUser
) => {
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
                  loggedUser?.admin
                    ? `<button onclick="deleteCategory(${category.id})">Delete</button>`
                    : ""
                }
            `;
      categoriesList.appendChild(categoryDiv);
    });
  }
  categoriesRendered = true; // Set the flag to true after rendering
};

// Categories Section
export const AddCategory = (event) => {
  event.preventDefault();

  const name = event.target.elements["name"].value;

  axios.post({ categories }, { name }).then((response) => {
    alert(response.statusText);
  });
};

export const deleteCategory = (id) => {
  axios
    .delete(`${categories}/${id}`)
    .then((response) => {
      alert(response.statusText);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Products Section
export const AddProduct = (event) => {
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

  axios.post(productURL, data).then((response) => {
    alert(response.statusText);
  });
};

export const deleteProduct = (id) => {
  axios
    .delete(`${productURL}/${id}`)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const renderProductFilter = (categories) => {
  const filterSelect = document.getElementById("filter");
  categories.forEach((category) => {
    const existingOption = Array.from(filterSelect.options).find(
      (option) => option.value === category.name
    );

    if (!existingOption) {
      const option = document.createElement("option");
      option.value = category.name; // Assuming category object has a 'name' property
      option.textContent = category.name;
      filterSelect.appendChild(option);
    }
  });
};
