# 🌿 Green Earth — Plant a Tree, Grow a Future

A beautiful, responsive tree plantation web app where users can browse trees by category, add them to a cart, and sign up to donate.

## 📁 Project Structure

```
├── index.html       # Main HTML file
├── index.css        # Tailwind CSS import
├── script.js        # All app logic (data loading, cart, modal)
├── data.json        # Local plant & category data (21 plants, 10 categories)
└── assets/
    ├── about.png
    ├── hero-leaf1.png
    └── hero-leaf2.png
```

## 🚀 Getting Started

> You must use a local server — `fetch()` doesn't work with `file://` URLs.

**With VS Code Live Server:**

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

**With Node.js:**

```bash
npx serve .
```

## ✨ Features

- Browse 21 trees across 10 categories
- Filter by category with animated card transitions
- Add to cart with quantity controls
- Modal popup with full plant details
- Toast notifications on cart actions
- Sticky navbar + sticky sidebar cart
- Fully responsive (mobile hamburger menu)
- Donate / plant a tree form

## 🌳 Categories

All Trees · Fruit Tree · Flowering Tree · Shade Tree · Medicinal Tree · Timber Tree · Evergreen Tree · Ornamental Plant · Bamboo · Climber · Aquatic Plant

## 🛠 Tech Stack

- HTML5, Tailwind CSS v4 (browser CDN), DaisyUI v5
- Vanilla JavaScript (no frameworks)
- Font Awesome icons
- Local `data.json` for plant data
