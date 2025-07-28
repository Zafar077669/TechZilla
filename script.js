document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('product-modal');
  const modalContent = modal.querySelector('.modal-body');
  const closeModalBtn = modal.querySelector('.close-modal');
  const cartBtn = document.getElementById('cart-btn');
  const cartPanel = document.getElementById('cart-panel');
  const cartItemsList = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const btnCheckout = cartPanel.querySelector('.btn-checkout');

  let cart = [];

  // Sample product data (should match HTML product cards)
  const products = [
    {
      id: 1,
      name: 'iPhone 14',
      price: 799,
      description: 'The latest iPhone 14 with improved camera and performance.',
      img: 'images/iphone14.jpg'
    },
    {
      id: 2,
      name: 'iPhone 13 Pro',
      price: 999,
      description: 'Powerful iPhone 13 Pro with stunning display and battery life.',
      img: 'images/iphone13pro.jpg'
    },
    {
      id: 3,
      name: 'iPhone 15 Pro Max',
      price: 1299,
      description: 'Flagship iPhone 15 Pro Max with best-in-class specs.',
      img: 'images/iphone15promax.jpg'
    }
  ];

  // Open modal with product details
  function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalContent.innerHTML = `
      <img src="${product.img}" alt="${product.name}" style="width:100%; border-radius: 12px; margin-bottom: 1rem;" />
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p><strong>Price:</strong> $${product.price}</p>
      <button id="modal-add-cart" class="btn-add-cart">Add to Cart</button>
    `;

    // Add to cart button inside modal
    const modalAddCartBtn = document.getElementById('modal-add-cart');
    modalAddCartBtn.addEventListener('click', () => {
      addToCart(productId);
      closeModal();
    });

    modal.classList.remove('hidden');
  }

  // Close modal
  function closeModal() {
    modal.classList.add('hidden');
  }

  closeModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside modal content
  window.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Add product to cart
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    renderCart();
  }

  // Render cart items and total
  function renderCart() {
    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;

      const li = document.createElement('li');
      li.innerHTML = `
        ${item.name} - $${item.price} x ${item.quantity}
        <button class="remove-item" data-id="${item.id}">❌</button>
      `;
      cartItemsList.appendChild(li);
    });

    cartTotalEl.textContent = total.toFixed(2);

    // Remove item buttons
    cartItemsList.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        removeFromCart(id);
      });
    });
  }

  // Remove item from cart
  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
  }

  // Toggle cart panel visibility
  cartBtn.addEventListener('click', () => {
    cartPanel.classList.toggle('show');
  });

  // Checkout button (simple alert for demo)
  btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
    } else {
      alert('Thank you for your purchase!');
      cart = [];
      renderCart();
      cartPanel.classList.remove('show');
    }
  });

  // Add event listeners to all "Details" buttons
  document.querySelectorAll('.btn-details').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      // Product IDs start from 1
      openModal(idx + 1);
    });
  });

  // Add event listeners to all "Add to Cart" buttons on product cards
  document.querySelectorAll('.btn-add-cart').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      addToCart(idx + 1);
    });
  });

});

// Modal elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById

const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');
const selectedLangSpan = langBtn.querySelector('.selected-lang');
const langItems = langDropdown.querySelectorAll('li');

// Ochish yopish funksiyasi
langBtn.addEventListener('click', () => {
  const expanded = langBtn.getAttribute('aria-expanded') === 'true';
  langBtn.setAttribute('aria-expanded', !expanded);
  langDropdown.classList.toggle('hidden');
  if (!expanded) {
    langItems[0].focus();
  }
});

// Tildan tanlash
langItems.forEach(item => {
  item.addEventListener('click', () => {
    selectedLangSpan.textContent = item.textContent;
    langDropdown.classList.add('hidden');
    langBtn.setAttribute('aria-expanded', 'false');
  });

  // Klaviatura uchun
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = item.nextElementSibling || langItems[0];
      next.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = item.previousElementSibling || langItems[langItems.length - 1];
      prev.focus();
    }
    if (e.key === 'Escape') {
      langDropdown.classList.add('hidden');
      langBtn.setAttribute('aria-expanded', 'false');
      langBtn.focus();
    }
  });
});

// Sahifaning boshqa joyiga bosilganda yopish
document.addEventListener('click', e => {
  if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
    langDropdown.classList.add('hidden');
    langBtn.setAttribute('aria-expanded', 'false');
  }
});

const CACHE_NAME = 'olov-sayt-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Service Worker o'rnatish (install)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache va tarmoq so'rovlarini boshqarish (fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Cache yangilash (activate)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
document.getElementById("searchInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    performSearch();
  }
});

const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let flames = [];

class Flame {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 5 + 2;
        this.speed = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.y -= this.speed;
        if (this.y < -this.size) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 150)}, 0, ${this.alpha})`;
        ctx.fill();
    }
}

function createFlames(count) {
    flames = [];
    for (let i = 0; i < count; i++) {
        flames.push(new Flame());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flames.forEach(f => {
        f.update();
        f.draw();
    });
    requestAnimationFrame(animate);
}

createFlames(150);
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createFlames(150);
});
