# MEMORA STUDIO — Archive & Atelier

> **"Preserving Memories, Restoring Emotions."**  
> Museum-grade photograph restoration, forensic colorization, and bespoke heirloom photo album making.

---

## 🏛️ Overview

**MEMORA STUDIO** is a luxury, ThemeForest-grade multi-page web platform created for master photo conservators and bespoke heirloom bookbinders. Built with pure modern web technologies (HTML5, Tailwind CSS, Lucide Icons, and Vanilla JavaScript), it features full Light/Dark mode transitions, dynamic LTR/RTL layout support, interactive before-and-after image sliders, and an encrypted client dashboard managed via persistent `localStorage`.

---

## ✨ Key Features

- **Multi-Page Archival Architecture**:
  - `index.html` — Main Editorial Landing Page (Home 1) with curated showcase, interactive before/after sliders, lookbook grid, and client testimonials.
  - `home-2.html` — Alternative Creative Homepage (Home 2) with bespoke hero typography, case dossiers, and condition assessment tools.
  - `about.html` — The Atelier & Heritage: master conservator bios, darkroom history, and 4-step conservation philosophy.
  - `services.html` — Full Conservation & Bindery Catalogue: structural repair, chromatic colorization, forensic recovery, and Italian-leather layflat volumes.
  - `pricing.html` — Transparent Archival Investment Packages: restoration tiers, bespoke album options, add-on pricing, and FAQ accordions.
  - `gallery.html` — Curated Exhibition Archive: dual interactive comparison sliders and categorized masonry portfolio with lightbox inspection.
  - `contact.html` — Flagship Conservation Studio Concierge: enquiry forms, studio appointment scheduler, location details, and direct contact options.
  - `dashboard.html` — Private Encrypted Client Vault: 8 interactive functional modules (Overview, Photo Uploader, Project Tracking, Proof Approval with B&A review, Album Vault, Orders & Payments Ledger, Profile & Settings).
  - `login.html` & `signup.html` — Client Authentication Portals with social provider authentication (Google, Apple, Facebook), toggleable password visibility, and password recovery.

- **Design & Typography**:
  - Warm vintage luxury palette (`#F8F5EF` Warm Ivory, `#EDE4D6` Soft Linen, `#C5A46D` Antique Gold, `#30251F` Deep Espresso, `#14110F` Obsidian).
  - Editorial serif titles (*Cormorant Garamond*), modern grotesque body copy (*Plus Jakarta Sans*), and archival monospace codes (*JetBrains Mono*).
  - Responsive layout optimized across mobile, tablet (iPad Air/Pro), 1024px, and ultra-wide displays.

- **Interactive Capabilities**:
  - **Light & Dark Mode**: Persistent theme switcher across all pages with custom KaTeX-safe styling and glassmorphism headers.
  - **LTR & RTL Bi-Directional Layout**: Dynamic Arabic/Hebrew/Urdu layout flipping with mirror-flipped chevrons and navigation alignment.
  - **Interactive Before & After Sliders**: Touch-enabled, zero-flicker split-screen restoration sliders with custom gold badges.
  - **Universal Upload Modal**: Available site-wide to trigger instantaneous digital photo assessment requests.

---

## 📁 Project Structure

```text
├── index.html                    # Home 1: Primary Archival Landing Page
├── home-2.html                   # Home 2: Alternative Editorial Creative Page
├── about.html                    # Atelier History & Conservator Bios
├── services.html                 # Comprehensive Restoration & Album Catalogue
├── pricing.html                  # Pricing Tiers & Package Calculator
├── gallery.html                  # Portfolio Exhibition & Interactive Sliders
├── contact.html                  # Flagship Concierge & Appointment Booking
├── dashboard.html                # Private Client Vault (8 Interactive Modules)
├── login.html                    # Client Login Portal
├── signup.html                   # Client Account Registration
├── assets/
│   ├── css/
│   │   └── styles.css            # Custom luxury styles, themes, and animations
│   ├── js/
│   │   ├── app.js                # Global header/footer, theme, RTL & modals
│   │   └── dashboard.js          # Client dashboard state controller
│   └── images/                   # High-resolution archival photography & assets
│       └── favicon.svg           # Brand emblem favicon
└── README.md
```

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser or serve via any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx serve
npx serve .
```

Navigate to `http://localhost:8000` to view the website.

---

## 📜 License

Created for **MEMORA STUDIO Pvt. Ltd.** Crafted with Archival Precision. All rights reserved.
