const categoryBtn = document.getElementById('category-buttons');
const cardContainer = document.getElementById('cards');
const allTreesBtn = document.getElementById('all-trees');
const modal = document.getElementById('tree-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const cartContainer = document.getElementById('items');
const totalPriceEl = document.getElementById('total-price');
const spinner = document.getElementById('spinner');
const hamburger = document.getElementById('hamburger');
const categoriesEl = document.getElementById('categories');

let allPlants = [];

const categoryEmojis = {
  'Fruit Tree': '🍎',
  'Flowering Tree': '🌸',
  'Shade Tree': '🌳',
  'Medicinal Tree': '🌿',
  'Timber Tree': '🪵',
  'Evergreen Tree': '🌲',
  'Ornamental Plant': '🌺',
  Bamboo: '🎍',
  Climber: '🌱',
  'Aquatic Plant': '🪷',
};

const loadData = () => fetch('./data.json').then((res) => res.json());

const renderCategories = (categories) => {
  categories.forEach((cat) => {
    const li = document.createElement('li');
    const emoji = categoryEmojis[cat.category_name] || '🌿';
    li.innerHTML = `
      <button id="category-${cat.id}"
        class="category-btn w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-700 hover:text-white transition cursor-pointer"
        data-id="${cat.id}">
        ${emoji} ${cat.category_name}
      </button>
    `;
    categoryBtn.appendChild(li);
  });
};

categoryBtn.addEventListener('click', (e) => {
  const btn = e.target.closest('.category-btn');
  if (!btn) return;
  const id = btn.dataset.id;
  if (!id) return;
  setActiveButton(`category-${id}`);
  showSpinner();
  setTimeout(() => {
    showTrees(allPlants.filter((p) => p.category_id === id));
    hideSpinner();
  }, 400);
});

allTreesBtn.addEventListener('click', () => {
  setActiveButton('all-trees');
  showSpinner();
  setTimeout(() => {
    showTrees(allPlants);
    hideSpinner();
  }, 400);
});

const showTrees = (plants) => {
  cardContainer.innerHTML = '';
  if (!plants || plants.length === 0) {
    cardContainer.innerHTML = `<p class="col-span-3 text-center text-gray-400 py-16">No trees found in this category.</p>`;
    return;
  }
  plants.forEach((plant) => {
    const card = document.createElement('div');
    card.className =
      'bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group';
    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          src="${plant.image}" alt="${plant.name}" />
        <span class="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
          ${categoryEmojis[plant.category] || '🌿'} ${plant.category}
        </span>
      </div>
      <div class="p-4 flex flex-col flex-1 gap-2">
        <h4 class="text-base font-bold text-gray-800 cursor-pointer hover:text-green-700 transition">${plant.name}</h4>
        <p class="text-xs text-gray-500 leading-relaxed flex-1">${plant.description}</p>
        <div class="flex items-center justify-between mt-2">
          <span class="text-lg font-extrabold text-green-700">৳${plant.price}</span>
          <button class="add-cart-btn bg-green-700 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition shadow">
            + Add to Cart
          </button>
        </div>
      </div>
    `;
    card.querySelector('h4').addEventListener('click', () => openModal(plant));
    card.querySelector('.add-cart-btn').addEventListener('click', () => {
      addToCart(plant);
      showToast(`${plant.name} added to cart!`);
    });
    cardContainer.appendChild(card);
  });
};

const openModal = (plant) => {
  modalContent.innerHTML = `
    <img class="w-full h-52 object-cover rounded-xl mb-4" src="${plant.image}" alt="${plant.name}" />
    <span class="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
      ${categoryEmojis[plant.category] || '🌿'} ${plant.category}
    </span>
    <h2 class="text-2xl font-bold text-gray-800 mb-2">${plant.name}</h2>
    <p class="text-gray-500 text-sm leading-relaxed mb-4">${plant.description}</p>
    <div class="flex items-center justify-between">
      <span class="text-2xl font-extrabold text-green-700">৳${plant.price}</span>
      <button id="modal-add-cart" class="bg-green-700 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full transition">
        + Add to Cart
      </button>
    </div>
  `;
  document.getElementById('modal-add-cart').addEventListener('click', () => {
    addToCart(plant);
    showToast(`${plant.name} added to cart!`);
    closeModal();
  });
  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

const closeModal = () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
};

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('hidden') && e.key === 'Escape') closeModal();
});

const addToCart = (plant) => {
  const existing = Array.from(cartContainer.children).find(
    (item) => item.dataset.id === plant.id
  );
  if (existing) {
    const qtyEl = existing.querySelector('.item-qty');
    qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
  } else {
    const item = document.createElement('div');
    item.className =
      'item flex justify-between items-start p-3 rounded-xl bg-green-50 border border-green-100';
    item.dataset.price = plant.price;
    item.dataset.id = plant.id;
    item.innerHTML = `
      <div class="flex-1">
        <p class="text-sm font-semibold text-gray-800">${plant.name}</p>
        <p class="text-xs text-gray-500 mt-0.5">৳${plant.price} × <span class="item-qty font-bold text-green-700">1</span></p>
        <div class="flex gap-1 mt-1.5">
          <button class="decrease w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full text-xs font-bold transition">−</button>
          <button class="increase w-6 h-6 bg-green-200 hover:bg-green-300 rounded-full text-xs font-bold transition">+</button>
        </div>
      </div>
      <button class="delete-btn text-gray-300 hover:text-red-400 transition ml-2 mt-0.5">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    item.querySelector('.increase').addEventListener('click', () => {
      item.querySelector('.item-qty').textContent =
        parseInt(item.querySelector('.item-qty').textContent) + 1;
      updateTotal();
    });
    item.querySelector('.decrease').addEventListener('click', () => {
      const q = parseInt(item.querySelector('.item-qty').textContent);
      if (q > 1) {
        item.querySelector('.item-qty').textContent = q - 1;
        updateTotal();
      }
    });
    item.querySelector('.delete-btn').addEventListener('click', () => {
      item.remove();
      updateTotal();
    });
    cartContainer.appendChild(item);
  }
  updateTotal();
};

const updateTotal = () => {
  let total = 0;
  cartContainer.querySelectorAll('.item').forEach((item) => {
    total +=
      parseFloat(item.dataset.price) *
      parseInt(item.querySelector('.item-qty').textContent);
  });
  totalPriceEl.textContent = `৳${total}`;
};

const showToast = (msg) => {
  const t = document.createElement('div');
  t.className =
    'fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-700 text-white text-sm px-6 py-3 rounded-full shadow-lg z-[100] transition-all';
  t.textContent = `🌿 ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
};

const showSpinner = () => spinner.classList.remove('hidden');
const hideSpinner = () => spinner.classList.add('hidden');

const setActiveButton = (activeId) => {
  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.classList.remove('bg-green-700', 'text-white');
    btn.classList.add('text-gray-700');
  });
  const active = document.getElementById(activeId);
  if (active) {
    active.classList.add('bg-green-700', 'text-white');
    active.classList.remove('text-gray-700');
  }
};

hamburger.addEventListener('click', () =>
  categoriesEl.classList.toggle('hidden')
);

window.addEventListener('DOMContentLoaded', () => {
  showSpinner();
  loadData().then((data) => {
    allPlants = data.plants;
    renderCategories(data.categories);
    showTrees(allPlants);
    hideSpinner();
    setActiveButton('all-trees');
  });
});
