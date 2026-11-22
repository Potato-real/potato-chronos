/* ========================================
   Bloom Valley Nursery - main.js
   Touchstone 4: Interactivity & Client-Side Data
======================================== */

// ---------- Data structures ----------
// Array of product objects available in the gallery
const products = [
  { id: "string-of-pearls", name: "String of Pearls", price: 22.99 },
  { id: "dwarf-lemon", name: "Dwarf Lemon Tree", price: 49.99 },
  { id: "lavender-bundle", name: "Lavender Bundle (3)", price: 18.50 },
  { id: "succulents", name: "Assorted Succulents", price: 15.00 },
  { id: "herb-kit", name: "Herb Starter Kit", price: 27.99 },
  { id: "hibiscus", name: "Hibiscus (Potted)", price: 34.00 },
  { id: "monstera", name: "Monstera Deliciosa", price: 39.99 },
  { id: "japanese-maple", name: "Japanese Maple (Young)", price: 65.00 },
  { id: "potting-mix", name: "Organic Potting Mix", price: 12.99 }
];

// Wishlist array (objects) – loaded from localStorage
let wishlist = [];

// ---------- Wishlist functions ----------
function loadWishlist() {
  const saved = localStorage.getItem("bvWishlist");
  if (saved) {
    try {
      wishlist = JSON.parse(saved);
    } catch (e) {
      wishlist = [];
    }
  } else {
    wishlist = [];
  }
  updateWishlistUI();
}

function saveWishlist() {
  localStorage.setItem("bvWishlist", JSON.stringify(wishlist));
}

function addToWishlist(productId) {
  const product = products.find(function (p) {
    return p.id === productId;
  });

  if (!product) return;

  // Prevent duplicates
  const alreadyAdded = wishlist.some(function (item) {
    return item.id === productId;
  });

  if (alreadyAdded) {
    showWishlistMessage(product.name + " is already on your wishlist.");
    return;
  }

  wishlist.push({
    id: product.id,
    name: product.name,
    price: product.price
  });

  saveWishlist();
  updateWishlistUI();
  showWishlistMessage(product.name + " added to your wishlist!");
}

function removeFromWishlist(productId) {
  wishlist = wishlist.filter(function (item) {
    return item.id !== productId;
  });
  saveWishlist();
  updateWishlistUI();
}

function clearWishlist() {
  wishlist = [];
  saveWishlist();
  updateWishlistUI();
  showWishlistMessage("Wishlist cleared.");
}

function updateWishlistUI() {
  const countEl = document.getElementById("wishlist-count");
  const listEl = document.getElementById("wishlist-list");
  const emptyEl = document.getElementById("wishlist-empty");

  if (countEl) {
    countEl.textContent = wishlist.length;
  }

  if (!listEl) return;

  listEl.innerHTML = "";

  if (wishlist.length === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";

  wishlist.forEach(function (item) {
    const li = document.createElement("li");
    li.className = "wishlist-item";
    li.innerHTML =
      '<span class="wishlist-item-name">' + item.name + "</span>" +
      '<span class="wishlist-item-price">$' + item.price.toFixed(2) + "</span>" +
      '<button type="button" class="btn-remove" data-id="' + item.id + '" aria-label="Remove ' + item.name + '">Remove</button>';
    listEl.appendChild(li);
  });

  // Attach remove listeners
  const removeButtons = listEl.querySelectorAll(".btn-remove");
  removeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      removeFromWishlist(btn.getAttribute("data-id"));
    });
  });
}

function showWishlistMessage(message) {
  const msgEl = document.getElementById("wishlist-message");
  if (!msgEl) return;
  msgEl.textContent = message;
  msgEl.classList.add("show");
  setTimeout(function () {
    msgEl.classList.remove("show");
  }, 2500);
}

// ---------- Form validation functions ----------
function showFieldError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + "-error");
  const field = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
  if (field) {
    field.classList.add("input-error");
  }
}

function clearFieldError(fieldId) {
  const errorEl = document.getElementById(fieldId + "-error");
  const field = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
  if (field) {
    field.classList.remove("input-error");
  }
}

function validateName() {
  const nameField = document.getElementById("fullname");
  if (!nameField) return true;

  const value = nameField.value.trim();
  if (value.length === 0) {
    showFieldError("fullname", "Name is required.");
    return false;
  }
  if (value.length < 2) {
    showFieldError("fullname", "Name must be at least 2 characters.");
    return false;
  }
  clearFieldError("fullname");
  return true;
}

function validateEmail() {
  const emailField = document.getElementById("email");
  if (!emailField) return true;

  const value = emailField.value.trim();
  if (value.length === 0) {
    showFieldError("email", "Email is required.");
    return false;
  }
  // Simple email pattern check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    showFieldError("email", "Please enter a valid email address (example: name@email.com).");
    return false;
  }
  clearFieldError("email");
  return true;
}

function validateMessage() {
  const messageField = document.getElementById("message");
  if (!messageField) return true;

  const value = messageField.value.trim();
  if (value.length === 0) {
    showFieldError("message", "Message is required.");
    return false;
  }
  if (value.length < 10) {
    showFieldError("message", "Message must be at least 10 characters.");
    return false;
  }
  clearFieldError("message");
  return true;
}

function validateForm(event) {
  event.preventDefault();

  const nameOk = validateName();
  const emailOk = validateEmail();
  const messageOk = validateMessage();

  if (nameOk && emailOk && messageOk) {
    // Save name to localStorage so it can be remembered next visit
    const nameValue = document.getElementById("name").value.trim();
    localStorage.setItem("bvContactName", nameValue);

    const successEl = document.getElementById("form-success");
    if (successEl) {
      successEl.textContent = "Thank you! Your message has been sent.";
      successEl.style.display = "block";
    }

    // Optionally reset the form after success
    // document.getElementById("contact-form").reset();
  }
}

function loadSavedName() {
  const savedName = localStorage.getItem("bvContactName");
  const nameField = document.getElementById("name");
  if (savedName && nameField) {
    nameField.value = savedName;
  }
}

// ---------- Initialize ----------
document.addEventListener("DOMContentLoaded", function () {
  // Load wishlist on every page that has the UI
  loadWishlist();

  // Attach Add to Wishlist buttons (gallery page)
  const addButtons = document.querySelectorAll(".btn-add-wishlist");
  addButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-id");
      addToWishlist(id);
    });
  });

  // Clear wishlist button
  const clearBtn = document.getElementById("clear-wishlist");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearWishlist);
  }

  // Form validation (about page)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", validateForm);

    // Live validation helpers
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");

    if (nameField) {
      nameField.addEventListener("blur", validateName);
      nameField.addEventListener("input", function () {
        if (nameField.classList.contains("input-error")) validateName();
      });
    }
    if (emailField) {
      emailField.addEventListener("blur", validateEmail);
      emailField.addEventListener("input", function () {
        if (emailField.classList.contains("input-error")) validateEmail();
      });
    }
    if (messageField) {
      messageField.addEventListener("blur", validateMessage);
      messageField.addEventListener("input", function () {
        if (messageField.classList.contains("input-error")) validateMessage();
      });
    }

    // Pre-fill name from localStorage
    loadSavedName();
  }
});
