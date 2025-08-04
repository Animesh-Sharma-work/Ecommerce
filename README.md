# E-commerce Storefront
This repository contains a complete, modern e-commerce web application built from the ground up. It demonstrates a full user journey, from browsing and filtering products to a secure, authenticated checkout process. The project is built with a focus on a clean user interface, component-based architecture, and best practices for security and state management.
Key Features:
Dynamic Product Catalog: Browse a grid of products loaded from a static data source.
Product Filtering: Filter products by category and price range.
Live Search: Instantly search for products by name or description.
Pagination: Easily navigate through multiple pages of products.
Interactive Shopping Cart:
Add/remove items from a slide-out cart panel.
Update item quantities directly in the cart.
View a running total and item count.
Secure User Authentication:
Full login and registration flow managed by Auth0.
UI updates based on authentication status (e.g., "Hello, {user}" vs. "Login").
Protected checkout process that requires users to be logged in.
Stripe Payment Integration:
A secure checkout modal using Stripe Elements.
Realistic card input form for collecting payment details.
Client-side validation and simulated payment processing for demo purposes.
Modern & Responsive UI:
Styled with Tailwind CSS for a clean, utility-first design.
Fully responsive layout for desktop, tablet, and mobile devices.
Interactive modals for product details and checkout.
Technology Stack:
Core: React 18, TypeScript, Vite
Styling: Tailwind CSS
Authentication: Auth0
Payments: Stripe.js / React Stripe.js
State Management: React Context API (for Cart and Auth)
Icons: Lucide React
