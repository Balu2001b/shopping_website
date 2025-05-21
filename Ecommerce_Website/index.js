

//----------------------------Show Toasting Message Scripting Section here---------------------------------


// Function to display the toast
function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // Toast is visible for 3 seconds
}

// function to display the wishlist
function Wishlist() {
    const toast = document.getElementById("toast-wishlist");
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // Toast is visible for 3 seconds
}





//----------------------------Size Fitting Image Scripting Section here---------------------------------

function showImage(event) {
    event.preventDefault();
    document.getElementById("overlay").style.display = "flex";
}

function hideImage() {
    document.getElementById("overlay").style.display = "none";
}




//----------------------copy clipboard Scripting Section here-------------------------------------

function clearAllSavedAddresses() {
    // Remove 'savedAddresses' from localStorage
    localStorage.removeItem("savedAddresses");

    // Also clear the address display
    const savedAddressContainer = document.querySelector(".saved-address");
    savedAddressContainer.innerHTML = "<p>No addresses saved.</p>";
}


function recalculateWishlistValue() {
    const items = document.querySelectorAll(".wishlist-item");
    document.getElementById("wishlistCount").textContent = items.length;

    // Save updated count
    localStorage.setItem("wishlistCount", items.length);
}



//--------------------------------Buy now button Scripting Section here---------------------------------



                 document.addEventListener("DOMContentLoaded", function () {
          const cartItems = document.querySelector(".cart-items");
          const totalPriceElement = document.getElementById("totalPrice");
        
          loadCartFromLocalStorage();
        
          document.getElementById("loadData1").addEventListener("click", function () {
            const productId = new URLSearchParams(window.location.search).get("id");
            const selectedSize = document.getElementById("size-select").value;
        
            if (!selectedSize) {
              sizeSelection();
              event.preventDefault(); // Prevent form submission if no size is selected
              
              return;
            }

            const existingProduct = document.querySelector(`.cart-item[data-id="${productId}"][data-size="${selectedSize}"]`);
            if (existingProduct) {
              showToast_exist(); // Show toast message for existing product
              recalculateCartValue(); // Update cart count
              return; // Prevent adding the same product again
            }

         

            
            
          
//----------------------------------------------------Fetch product data and add to cart----------------------------------

            // Fetch product data from JSON file

            fetch("products.json")
              .then((response) => response.json())
              .then((data) => {
                const product = data.find((p) => p.id == productId);
                if (product) {
                  product.size = selectedSize; // Add selected size to product object
                  addProductToCart(product);
                  saveCartToLocalStorage();
                } else {
                  alert("Product not found.");
                }
              });
          });


//-------------------------------------------Toggle empty cart message--------------------------------------




function toggleEmptyCartMessage() {
    let cartItems = document.querySelectorAll(".cart-item");
    let message = document.getElementById("empty-cart-message");

    if (cartItems.length === 0) {
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }
}


        
//--------------------------------------------Add product to cart function-------------------------------------


function addProductToCart(product, fromStorage = false) {
    let existingProduct = document.querySelector(`.cart-item[data-id="${product.id}"][data-size="${product.size}"]`);

    const quantityToAdd = product.quantity || 1;

    if (existingProduct) {
        if (fromStorage) return; // Don't increase if loading from storage

        const quantityElement = existingProduct.querySelector(".cart-quantity");
        const quantityDisplay = existingProduct.querySelector(".quantity-display");
        const priceElement = existingProduct.querySelector(".cart-price");
        const unitPrice = parseFloat(existingProduct.getAttribute("data-price"));

        let quantity = parseInt(quantityElement.textContent) + quantityToAdd;

        quantityElement.textContent = quantity;
        quantityDisplay.textContent = quantity;
        priceElement.textContent = (unitPrice * quantity).toFixed(2);

        saveCartToLocalStorage();
        updateTotalPrice();
        toggleEmptyCartMessage();
        
        return;
    }

    // If not existing, create a new cart item
    let productDiv = document.createElement("div");
    productDiv.classList.add("cart-item");
    productDiv.setAttribute("data-id", product.id);
    productDiv.setAttribute("data-size", product.size);
    productDiv.setAttribute("data-price", parseFloat(product.price).toFixed(2));

    productDiv.innerHTML = `
        <img src="${product.image}" class="cart-image" alt="${product.name}" />
        <p class="cart-name">${product.name}</p>
        <p class="cart-size">Size : <span>${product.size}</span></p>
        <p class="quantity-number">Qty : <span class="quantity-display">${quantityToAdd}</span></p>

        <div class="cart-quantity-controls">
            <button class="decrement"><i class="fa-solid fa-arrow-down"></i></button>
            <span class="cart-quantity">${quantityToAdd}</span>
            <button class="increment"><i class="fa-solid fa-arrow-up"></i></button>
        </div>

        <p class="cart-price">${(parseFloat(product.price) * quantityToAdd).toFixed(2)}</p>
        <i class="bi bi-trash"></i><hr>
    `;

    cartItems.appendChild(productDiv);
    saveCartToLocalStorage();
    updateTotalPrice();


    // Attach event listeners
    productDiv.querySelector(".increment").addEventListener("click", function () {
        updateQuantity(product.id, product.size, 1);
    });

    productDiv.querySelector(".decrement").addEventListener("click", function () {
        updateQuantity(product.id, product.size, -1);
    });

    productDiv.querySelector(".bi-trash").addEventListener("click", function () {
        removeProductFromCart(product.id, product.size);
    });

    saveCartToLocalStorage();
    updateTotalPrice();
    toggleEmptyCartMessage();
}





//---------------------------------------Update quantity function section here----------------------------------


function updateQuantity(productId, size, change) {
    let productElement = document.querySelector(`.cart-item[data-id="${productId}"][data-size="${size}"]`);
    if (!productElement) return;

    const quantityElement = productElement.querySelector(".cart-quantity");
    const quantityDisplay = productElement.querySelector(".quantity-display");
    const priceElement = productElement.querySelector(".cart-price");
    const unitPrice = parseFloat(productElement.getAttribute("data-price"));

    let quantity = parseInt(quantityElement.textContent) + change;

    if (quantity < 1) {
        removeProductFromCart(productId, size);
        return;
    }

    quantityElement.textContent = quantity;
    quantityDisplay.textContent = quantity;
    priceElement.textContent = (unitPrice * quantity).toFixed(2);

    saveCartToLocalStorage();
    recalculateCartValue();
    updateTotalPrice();
}




//---------------------------------------------Save cart to local storage function section here----------------------------------


function saveCartToLocalStorage() {
    const cartItemsElements = document.querySelectorAll(".cart-item");
    const cartData = [];

    cartItemsElements.forEach(item => {
        cartData.push({
            id: item.getAttribute("data-id"),
            size: item.getAttribute("data-size"),
            price: item.getAttribute("data-price"),
            quantity: parseInt(item.querySelector(".cart-quantity").textContent),
            name: item.querySelector(".cart-name").textContent,
            image: item.querySelector(".cart-image").getAttribute("src")
        });
    });

    localStorage.setItem("cart", JSON.stringify(cartData));
}
toggleEmptyCartMessage();



//-------------------------------------------Load cart from local storage function section here----------------------------------


function loadCartFromLocalStorage() {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];

    cartData.forEach(product => {
        addProductToCart(product, true); // prevent duplicate quantity/price
    });


    
    updateTotalPrice();
    toggleEmptyCartMessage();
}
document.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);



// -----------------------------------------Function to recalculate total cart count------------------------------------


function recalculateCartValue() {
    let totalItems = 0;

    document.querySelectorAll(".cart-quantity").forEach(item => {
        totalItems += parseInt(item.textContent);
    });

    // Update both localStorage and UI
    localStorage.setItem("cartValue", totalItems);
    document.getElementById("cart-value").textContent = totalItems || 0; // Set to 0 if empty
}
// Recalculate cart value on page load
document.addEventListener("DOMContentLoaded", function () {
    recalculateCartValue();
});



//----------------------------- ------------------Remove product from cart function section here----------------------------------


function removeProductFromCart(productId, size) {
    document.querySelector(`.cart-item[data-id='${productId}'][data-size="${size}"]`).remove();
    saveCartToLocalStorage();
    updateTotalPrice();
    recalculateCartValue();
    toggleEmptyCartMessage();
}


//------------------------------------Update total price function section here----------------------------------


function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll(".cart-item").forEach(item => {
        let price = parseFloat(item.querySelector(".cart-price").textContent.replace("$", ""));
        total += price;
    });
    totalPriceElement.textContent = `Total: ₹${total.toFixed(2)}`;
}
});




function sizeSelection() {
    var toast = document.getElementById("size-selection");
    toast.classList.add("show");
    window.scrollTo(0, 0);

    setTimeout(function() {
        toast.classList.remove("show");
    }, 2000); // Hide toast after 3 seconds
}



//--------------------------------------wishlist button Scripting Section here---------------------------------



