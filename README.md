## Buy.com — Modern E-commerce Experience

Buy.com is a fully featured e-commerce experience built with Next.js 14 and the App Router. It blends a high-end landing page, data-driven shopping flows, and customer tooling (favorites, cart, product detail, contact, etc.) with admin-style conveniences like product creation/editing. The UI is animated with Framer Motion and styled with Tailwind + shadcn/ui.

---

## 🧠 Tech Stack

- **Framework**: Next.js 14 (App Router, React Server Components)
- **State & Data**: Redux Toolkit, React Query, Axios, IndexedDB
- **UI/Styling**: Tailwind CSS, shadcn/ui, Framer Motion, Lucide icons, Google Fonts (Poppins)
- **Tooling**: TypeScript, ESLint, Vercel-ready configuration
- **APIs**: [DummyJSON](https://dummyjson.com) fake store API (products, categories, search)

### Environment Variable

```bash
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com/
```

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Visit http://localhost:3000 to explore the site. Editing files within `app/` will hot-reload changes automatically.

To create a production build:

```bash
npm run build
npm run start
```

---

## Screenshots

All captures live under `public/screenshots/`.

#### Landing Page

![Landing](public/screenshots/landing.png)

#### Shop (Grid)

![Shop](public/screenshots/shop.png)

#### Product Detail

![Product Detail](public/screenshots/product-detail.png)

#### Cart

![Cart](public/screenshots/cart.png)

#### My Listings

![My Listings](public/screenshots/my-ads.png)

---

## 📚 Additional Notes

- Product creation/editing stores local images in IndexedDB (`lib/db/myListings.ts`) so DummyJSON only receives metadata—handy for prototyping admin-like experiences.
- The mobile layout is fully responsive: headers collapse into a motion-animated drawer, filters stack, and the cart summary becomes sticky on larger breakpoints.
- Redux Toolkit slices (`lib/store`) manage favorites and cart, persisting to localStorage for a seamless return experience.

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs) – Latest features and API guides.
- [shadcn/ui](https://ui.shadcn.com/) – Component usage and theming tips.
- [Framer Motion](https://www.framer.com/motion/) – Declarative animation sequences.
- [DummyJSON API Docs](https://dummyjson.com/docs/products) – Endpoints used throughout the app.

---

## 📦 Deployment

you can find the live demo at [buy.com](https://buycom-psi.vercel.app/)

Enjoy exploring and extending Buy.com! 💼🛒
