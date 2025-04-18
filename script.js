// Simple cart simulation using an array
let cart = [];

// Function to update the cart display
function updateCartDisplay() {
  const cartItemsDiv = document.getElementById("cartItems");
  cartItemsDiv.innerHTML = ""; // clear current content

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is currently empty.</p>";
    return;
  }

  // Create a list of items
  const ul = document.createElement("ul");
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    // Optionally add a remove button for each cart item
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn";
    removeBtn.style.marginLeft = "1rem";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCartDisplay();
    });
    li.appendChild(removeBtn);
    ul.appendChild(li);
  });

  cartItemsDiv.appendChild(ul);
}

// Event listener for Add-to-Cart buttons
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    // Get product details from the parent card attributes
    const productCard = e.target.closest(".product-card");
    const id = productCard.getAttribute("data-id");
    const name = productCard.getAttribute("data-name");
    const price = parseInt(productCard.getAttribute("data-price"));

    // Add to cart (for a real application, you may check if item already exists, etc.)
    cart.push({ id, name, price });
    updateCartDisplay();
    alert(`${name} has been added to your cart!`);
  });
});

// Checkout function using Razorpay
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  // Prepare Razorpay options.
  // IMPORTANT: Replace YOUR_RAZORPAY_KEY with your actual Razorpay API key.
  const options = {
    key: "YOUR_RAZORPAY_KEY", // Enter your Razorpay API key here
    amount: totalAmount * 100, // Razorpay accepts amount in paise
    currency: "INR",
    name: "MT Guppy Galaxy",
    description: "Purchase of guppies",
    // image: "https://yourdomain.com/logo.png", // optional: add your logo URL here
    handler: function (response) {
      // Handle successful payment here:
      alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      // Clear the cart on success
      cart = [];
      updateCartDisplay();
    },
    prefill: {
      // Optionally prefill customer details (if you have them)
      name: "",
      email: "",
    },
    notes: {
      address: "Your Store Address",
    },
    theme: {
      color: "#e94560",
    },
  };

  // Uncomment the following lines after including Razorpay's checkout.js script
  // const rzp1 = new Razorpay(options);
  // rzp1.open();
  // For now, simulate a checkout process:
  alert(`Initiating payment of ₹${totalAmount} (simulation).`);
});