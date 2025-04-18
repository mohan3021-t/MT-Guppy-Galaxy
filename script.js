document.addEventListener("DOMContentLoaded", () => {
  // Initialize cart in sessionStorage if not present
  if (!sessionStorage.getItem("cart")) {
    sessionStorage.setItem("cart", JSON.stringify([]));
  }

  // Helper functions for cart management
  const getCart = () => JSON.parse(sessionStorage.getItem("cart"));
  const updateCartStorage = (cart) =>
    sessionStorage.setItem("cart", JSON.stringify(cart));

  // Update header cart count
  const updateCartCount = () => {
    const cart = getCart();
    const cartCountElem = document.getElementById("cartCount");
    if (cartCountElem) {
      cartCountElem.textContent = cart.length;
    }
  };
  updateCartCount();

  // "Add to Cart" functionality on Products page
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card");
      const title = productCard.getAttribute("data-title");
      const price = productCard.getAttribute("data-price");
      const cart = getCart();
      cart.push({ title, price });
      updateCartStorage(cart);
      updateCartCount();
      // Optional GSAP animation on click (if GSAP is available)
      if (typeof gsap !== "undefined") {
        gsap.to(button, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
      }
      alert(`${title} added to cart!`);
    });
  });

  // On Cart Page: display cart items
  const cartItemsElem = document.getElementById("cartItems");
  if (cartItemsElem) {
    const cart = getCart();
    if (cart.length === 0) {
      cartItemsElem.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      const ul = document.createElement("ul");
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${item.title} - ₹${item.price} 
          <button class="btn remove-btn" data-index="${index}">Remove</button>
        `;
        ul.appendChild(li);
      });
      cartItemsElem.innerHTML = "";
      cartItemsElem.appendChild(ul);

      // Remove cart item functionality
      document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          const cart = getCart();
          cart.splice(index, 1);
          updateCartStorage(cart);
          updateCartCount();
          location.reload();
        });
      });
    }
  }

  // Checkout button functionality on Cart page
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
      alert(`Proceeding to checkout. Total amount: ₹${total}`);
      updateCartStorage([]);
      updateCartCount();
      location.reload();
    });
  }

  // Animate hero content on Home page using GSAP (if GSAP is loaded)
  const heroContent = document.querySelector(".hero-content");
  if (heroContent && typeof gsap !== "undefined") {
    gsap.to(heroContent, { duration: 1.2, opacity: 1, y: 0, ease: "power2.out" });
  }

  // Use IntersectionObserver + GSAP for fade-in animations on container elements
  const faders = document.querySelectorAll(".container");
  const appearOptions = { threshold: 0.2 };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (typeof gsap !== "undefined") {
        gsap.fromTo(entry.target, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
      }
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach((fader) => appearOnScroll.observe(fader));
});