import { wishlistURL } from "/networkConfig.js";

let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

async function fetchWishlist() {
  try {
    const response = await axios.get(`${wishlistURL}?user=${loggedUser.email}`);
    const products = response.data;

    return products.filter((product) => product.user === loggedUser.email);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
}

async function renderWishlist() {
  try {
    const filteredProducts = await fetchWishlist();
    const wishlist = document.getElementById("wishlist-container");

    wishlist.innerHTML = "";

    filteredProducts.forEach((item) => {
      item?.products.forEach((product) => {
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
            
           
          `;

        wishlist.appendChild(productDiv);
      });
    });
  } catch (error) {
    console.error("Error rendering wishlist:", error);
  }
}

// Call the function to render wishlist
renderWishlist();
