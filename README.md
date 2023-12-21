# E-Commerce
This is a project to make E-Commerce Website using Only HTML &amp; CSS &amp; JavaScript

index.html
    This is the main page that contains all products without login and once any visitor want to add any product to cart or wishlist redirect him to login page that contains a link can reditect to register page.
    After login:
        Admin:if user sign in as an admin redirecit him to adminDashbord that contains 3 links on navbar 
            (Products, Orders, logout) 
            0. Products - redirect to productList page which contain table of all products with add new product button  
            0. Products - redirected to productsPage which contain table of all the product with add and delete button for each row
            1.Orders - when click on it will redirect you to orders page which contain table of all orders with their details and status(pending/processing/completed)
            2.Logout - clear session and redirect to home page
        Customer:if user sign in as a customer redirecit him to home page but show his name on top of page as 
        a profile and show new button to logout

dataBase.json
    This page contain all data of users and products to make operations on it get and set with different spaces