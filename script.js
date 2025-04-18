document.addEventListener("DOMContentLoaded", () => {
  // Remove the loader after page load
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => loader.remove(), 500);
    }, 1000);
  }
  
  // Initialize cart in sessionStorage if not already set
  if (!sessionStorage.getItem("cart")) {
    sessionStorage.setItem("cart", JSON.stringify([]));
  }
  const getCart = () => JSON.parse(sessionStorage.getItem("cart"));
  const updateCartStorage = (cart) => sessionStorage.setItem("cart", JSON.stringify(cart));
  
  // Update Cart Count in Header
  const updateCartCount = () => {
    const cartCountElem = document.getElementById("cartCount");
    if (cartCountElem) {
      cartCountElem.textContent = getCart().length;
    }
  };
  updateCartCount();
  
  // "Add to Cart" functionality for Products Page with GSAP animation
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card");
      const title = productCard.getAttribute("data-title");
      const price = productCard.getAttribute("data-price");
      const cart = getCart();
      cart.push({ title, price });
      updateCartStorage(cart);
      updateCartCount();
      if (typeof gsap !== "undefined") {
        gsap.to(button, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
      }
      alert(`${title} added to cart!`);
    });
  });
  
  // --- Search, Sort & Filter on Products Page ---
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const filterSelect = document.getElementById("filterSelect");
  const productGrid = document.querySelector(".product-grid");
  
  function updateProductsDisplay() {
    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
    let productCards = Array.from(document.querySelectorAll(".product-card"));
    
    // Filter by search keyword
    if (searchValue) {
      productCards = productCards.filter((card) => {
        const title = card.getAttribute("data-title").toLowerCase();
        return title.includes(searchValue);
      });
    }
    
    // Filter by category
    const filterValue = filterSelect ? filterSelect.value : "";
    if (filterValue) {
      productCards = productCards.filter((card) => {
        const category = card.getAttribute("data-category");
        return category === filterValue;
      });
    }
    
    // Sort by price if applicable
    const sortValue = sortSelect ? sortSelect.value : "";
    if (sortValue === "priceAsc") {
      productCards.sort((a, b) => parseInt(a.getAttribute("data-price")) - parseInt(b.getAttribute("data-price")));
    } else if (sortValue === "priceDesc") {
      productCards.sort((a, b) => parseInt(b.getAttribute("data-price")) - parseInt(a.getAttribute("data-price")));
    }
    
    // Update the product grid in the DOM
    if (productGrid) {
      productGrid.innerHTML = "";
      productCards.forEach((card) => productGrid.appendChild(card));
    }
  }
  
  if (searchInput) searchInput.addEventListener("input", updateProductsDisplay);
  if (sortSelect) sortSelect.addEventListener("change", updateProductsDisplay);
  if (filterSelect) filterSelect.addEventListener("change", updateProductsDisplay);
  
  // --- Cart Page: Display Cart Items ---
  const cartItemsElem = document.getElementById("cartItems");
  if (cartItemsElem) {
    const cart = getCart();
    if (!cart || cart.length === 0) {
      cartItemsElem.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      const ul = document.createElement("ul");
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${item.title} - ₹${item.price} 
          <button class="btn remove-btn" data-index="${index}">Remove</button>`;
        ul.appendChild(li);
      });
      cartItemsElem.innerHTML = "";
      cartItemsElem.appendChild(ul);
      document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          let cart = getCart();
          cart.splice(index, 1);
          updateCartStorage(cart);
          updateCartCount();
          location.reload();
        });
      });
    }
  }
  
  // Checkout functionality on Cart Page
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
  
  // Animate hero content on Home Page using GSAP
  const heroContent = document.querySelector(".hero-content");
  if (heroContent && typeof gsap !== "undefined") {
    gsap.to(heroContent, { duration: 1.2, opacity: 1, y: 0, ease: "power2.out" });
  }
  
  // IntersectionObserver for fade-in effects on containers using GSAP
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
