/**
 * MEMORA STUDIO — Core Application Script
 * Handles: Header/Footer Hydration, Theme (Light/Dark), RTL/LTR Direction,
 * Before/After Sliders, Lightbox, Quick Upload Modal, Form Validation & Image Resilience
 */

(function () {
  // 1. Apply persisted Theme & RTL immediately to prevent layout shift
  const savedTheme = localStorage.getItem('memora_theme') || 'light';
  const savedDir = localStorage.getItem('memora_dir') || 'ltr';

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  document.documentElement.setAttribute('dir', savedDir);
})();

document.addEventListener('DOMContentLoaded', () => {
  initSharedHeaderFooter();
  initThemeAndDirectionToggles();
  initMobileNavigation();
  initBeforeAfterSliders();
  initGalleryFiltersAndLightbox();
  initUniversalModals();
  initFormsValidation();
  initFaqAccordions();
  initImageFallbacks();
  initAOSIfPresent();
});

/* ==========================================================================
   1. REUSABLE STICKY HEADER & CONSISTENT FOOTER
   ========================================================================== */
function getCurrentPageName() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page === '' ? 'index.html' : page;
}

function getActiveUser() {
  try {
    const raw = localStorage.getItem('memora_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function initSharedHeaderFooter() {
  const headerMount = document.getElementById('site-header');
  const footerMount = document.getElementById('site-footer');
  const currentPage = getCurrentPageName();
  const user = getActiveUser();
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  const isDark = document.documentElement.classList.contains('dark');

  if (headerMount) {
    document.body.classList.add('has-fixed-header');
  }

  const navItems = [
    { label: 'Home 1', href: 'index.html' },
    { label: 'Home 2', href: 'home-2.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'Pricing', href: 'pricing.html' },
    { label: 'Gallery', href: 'gallery.html' },
    { label: 'Contact', href: 'contact.html' },
    { label: 'Dashboard', href: 'dashboard.html' }
  ];

  if (headerMount) {
    const navLinksHtml = navItems
      .map((item) => {
        const isActive = currentPage === item.href;
        return `<a href="${item.href}" class="nav-link-editorial whitespace-nowrap ${isActive ? 'active font-semibold' : ''}">${item.label}</a>`;
      })
      .join('');

    const mobileNavLinksHtml = navItems
      .map((item) => {
        const isActive = currentPage === item.href;
        return `<a href="${item.href}" class="flex items-center justify-between py-3 px-4 rounded-xl text-base font-medium transition ${
          isActive
            ? 'bg-[#C5A46D]/20 text-theme-gold font-semibold'
            : 'text-theme-primary hover:bg-black/5 dark:hover:bg-white/5'
        }">
          <span>${item.label}</span>
          <i data-lucide="chevron-right" class="w-4 h-4 opacity-60 rtl-flip-icon"></i>
        </a>`;
      })
      .join('');

    headerMount.innerHTML = `
      <header id="main-header" class="fixed top-0 left-0 right-0 z-50 w-full bg-theme-glass border-b border-theme transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          <!-- Brand Logo -->
          <a href="index.html" class="flex items-center gap-3 group shrink-0 focus:outline-none" aria-label="MEMORA STUDIO Home">
            <div class="w-11 h-11 rounded-xl bg-[#30251F] dark:bg-[#C5A46D] text-[#F8F5EF] dark:text-[#14110F] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <circle cx="8.5" cy="9.5" r="1.5"/>
                <path d="M21 15l-5-5L5 20"/>
                <path d="M14 4v4h4"/>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="font-serif-editorial text-xl sm:text-2xl font-bold tracking-wider text-theme-primary leading-none">MEMORA</span>
              <span class="text-[10px] tracking-[0.28em] uppercase text-theme-muted font-semibold mt-0.5">ARCHIVE &amp; ATELIER</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden xl:flex items-center gap-5 xl:gap-7" aria-label="Main Navigation">
            ${navLinksHtml}
          </nav>

          <!-- Utility & Auth Controls -->
          <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <!-- Desktop RTL & Theme Toggles + Sign Up CTA (Visible on desktop >= 1280px) -->
            <div class="hidden xl:flex items-center gap-2">
              <!-- RTL Toggle (Left-Right Arrow Icon) -->
              <button type="button" data-action="toggle-rtl" class="w-10 h-10 rounded-full border border-theme-strong flex items-center justify-center text-theme-primary hover:border-[#C5A46D] hover:text-theme-gold transition" aria-label="Toggle LTR/RTL layout direction" title="Toggle LTR / RTL Direction">
                <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
              </button>

              <!-- Light / Dark Theme Toggle -->
              <button type="button" data-action="toggle-theme" class="w-10 h-10 rounded-full border border-theme-strong flex items-center justify-center text-theme-primary hover:border-[#C5A46D] hover:text-theme-gold transition" aria-label="Toggle Light/Dark Mode" title="Toggle Light/Dark Theme">
                <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-4 h-4"></i>
              </button>

              <!-- Sign Up CTA Button -->
              <a href="signup.html" class="btn-luxury-primary !py-2 !px-5 !min-h-0 !h-10 text-xs font-semibold rounded-full uppercase tracking-wider ml-1 shadow-sm">
                <span>Sign Up</span>
              </a>
            </div>

            <!-- Mobile Hamburger Trigger (Visible on 1028px, tablet, and mobile views) -->
            <button type="button" id="mobile-menu-open" class="xl:hidden w-10 h-10 rounded-full border border-theme-strong flex items-center justify-center text-theme-primary hover:border-[#C5A46D] hover:text-theme-gold transition" aria-label="Open Navigation Menu" aria-expanded="false">
              <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Responsive Drawer (Placed outside <header> to avoid backdrop-filter stacking-context clipping) -->
      <div id="mobile-menu-drawer" class="fixed inset-0 z-[1000] hidden xl:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div id="mobile-menu-backdrop" class="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"></div>
        <div id="mobile-menu-panel" class="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 w-full max-w-sm bg-theme-surface border-l rtl:border-l-0 rtl:border-r border-theme shadow-2xl flex flex-col justify-between p-6 overflow-y-auto z-10 transition-transform duration-300">
          <div>
            <div class="flex items-center justify-between pb-5 border-b border-theme">
              <a href="index.html" class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-lg bg-[#30251F] dark:bg-[#C5A46D] text-[#F8F5EF] dark:text-[#14110F] flex items-center justify-center">
                  <i data-lucide="camera" class="w-4 h-4"></i>
                </div>
                <div class="flex flex-col">
                  <span class="font-serif-editorial text-lg font-bold tracking-wider text-theme-primary leading-none">MEMORA</span>
                  <span class="text-[9px] tracking-[0.25em] uppercase text-theme-muted font-semibold mt-0.5">ARCHIVE &amp; ATELIER</span>
                </div>
              </a>
              <button type="button" id="mobile-menu-close" class="w-9 h-9 rounded-full border border-theme flex items-center justify-center text-theme-primary hover:border-[#C5A46D] hover:text-theme-gold transition" aria-label="Close Menu">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>
            <nav class="mt-5 space-y-1">
              ${mobileNavLinksHtml}
            </nav>
          </div>

          <div class="pt-6 border-t border-theme space-y-4">
            <!-- Theme & RTL Controls inside Hamburger Menu (Icons Only) -->
            <div class="grid grid-cols-2 gap-3">
              <button type="button" data-action="toggle-theme" class="h-11 rounded-xl border border-theme-strong bg-theme-secondary flex items-center justify-center text-theme-primary hover:border-[#C5A46D] hover:text-theme-gold transition" aria-label="Toggle Light/Dark Mode" title="Toggle Light/Dark Theme">
                <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5 text-theme-gold"></i>
              </button>

              <button type="button" data-action="toggle-rtl" class="h-11 rounded-xl border border-theme-strong bg-theme-secondary flex items-center justify-center text-theme-primary hover:border-[#C5A46D] hover:text-theme-gold transition" aria-label="Toggle LTR/RTL Layout Direction" title="Toggle LTR/RTL Direction">
                <i data-lucide="arrow-left-right" class="w-5 h-5 text-theme-gold"></i>
              </button>
            </div>

            <a href="signup.html" class="btn-luxury-primary !py-2.5 !px-4 text-sm text-center w-full">Sign Up</a>
            <p class="text-xs text-center text-theme-muted">Preserving Memories, Restoring Emotions.</p>
          </div>
        </div>
      </div>
    `;
  }

  if (footerMount) {
    const isHome1 = currentPage === 'index.html' || currentPage === '';
    const preFooterHtml = isHome1
      ? `
      <!-- Pre-Footer Newsletter & Atelier Callout (Home 1 Exclusive) -->
      <section class="py-14 bg-theme-primary border-t border-theme relative z-10" aria-label="The Archival Journal Subscription">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="rounded-3xl bg-[#EDE4D6] dark:bg-[#2E241E] text-theme-primary dark:text-[#F8F5EF] border border-theme-strong p-8 sm:p-10 lg:p-12 xl:p-14 shadow-theme-elevated grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div class="lg:col-span-6 xl:col-span-7 space-y-3">
              <span class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-theme-gold font-semibold">
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> The Archival Journal
              </span>
              <h3 class="font-serif-editorial text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-theme-primary leading-snug">
                Preserve Your Family Legacy Before Time Fades It
              </h3>
              <p class="text-sm sm:text-base text-theme-secondary leading-relaxed">
                Receive seasonal guides on heirloom photograph care, archival digitization tips, and private invitations to our bespoke album exhibitions.
              </p>
            </div>
            <div class="lg:col-span-6 xl:col-span-5 w-full">
              <form class="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3" data-validate-form="newsletter">
                <div class="relative flex-1 min-w-0">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    class="w-full h-12 px-5 py-3 rounded-full bg-theme-surface border border-theme-strong text-theme-primary placeholder-theme-muted text-sm focus:outline-none focus:border-[#C5A46D] focus:ring-2 focus:ring-[#C5A46D]/20 transition"
                    aria-label="Newsletter email address"
                  />
                </div>
                <button type="submit" class="btn-gold !min-h-[3rem] !h-12 !py-2.5 !px-7 text-sm whitespace-nowrap shadow-md shrink-0 flex items-center justify-center gap-2">
                  <span>Subscribe</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 rtl-flip-icon"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>`
      : '';

    footerMount.innerHTML = `
      ${preFooterHtml}

      <footer class="bg-[#F8F5EF] dark:bg-[#1A1410] text-[#30251F] dark:text-[#F5EFE6] border-t border-theme-strong pt-16 pb-10 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Main Footer Columns (Balanced 4-Column Layout at 1024px and Desktop) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-10 pb-12 border-b border-theme items-start">
            <!-- Col 1: Brand Identity -->
            <div class="lg:col-span-3 xl:col-span-4 space-y-4">
              <a href="index.html" class="inline-flex items-center gap-3 group focus:outline-none" aria-label="MEMORA STUDIO Home">
                <div class="w-11 h-11 rounded-xl bg-[#30251F] dark:bg-[#C5A46D] text-[#F8F5EF] dark:text-[#14110F] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <rect x="3" y="4" width="18" height="16" rx="2"/>
                    <circle cx="8.5" cy="9.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 20"/>
                    <path d="M14 4v4h4"/>
                  </svg>
                </div>
                <div class="flex flex-col">
                  <span class="font-serif-editorial text-xl sm:text-2xl font-bold tracking-wider text-theme-primary block leading-none">MEMORA</span>
                  <span class="text-[10px] tracking-[0.28em] uppercase text-theme-gold font-semibold mt-0.5">ARCHIVE &amp; ATELIER</span>
                </div>
              </a>
              <p class="text-sm text-theme-secondary leading-relaxed pr-0 xl:pr-4">
                Museum-grade photograph restoration, forensic colorization, and handcrafted Italian-leather heirloom albums. Every crease repaired by master digital conservationists.
              </p>
              <!-- Original Social Icons with Dedicated Brand Colors & Hover Effects -->
              <div class="flex items-center gap-3 pt-3">
                <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Follow MEMORA STUDIO on Instagram" title="Instagram" class="social-icon-btn social-instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Follow MEMORA STUDIO on Facebook" title="Facebook" class="social-icon-btn social-facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="Subscribe to MEMORA STUDIO on YouTube" title="YouTube" class="social-icon-btn social-youtube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener" aria-label="Explore MEMORA STUDIO on Pinterest" title="Pinterest" class="social-icon-btn social-pinterest">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.94-.13-2.38.03-3.41.14-.94.95-4.04.95-4.04s-.24-.49-.24-1.22c0-1.15.67-2 1.5-2 .71 0 1.05.53 1.05 1.17 0 .71-.46 1.78-.69 2.77-.2.83.42 1.5 1.23 1.5 1.48 0 2.62-1.56 2.62-3.81 0-1.99-1.43-3.38-3.48-3.38-2.37 0-3.76 1.78-3.76 3.62 0 .72.28 1.48.62 1.9.07.08.08.15.06.24-.07.28-.21.87-.24.99-.04.16-.13.19-.3.12-1.12-.52-1.82-2.16-1.82-3.48 0-2.83 2.06-5.43 5.94-5.43 3.12 0 5.54 2.22 5.54 5.19 0 3.1-1.95 5.59-4.66 5.59-.91 0-1.77-.47-2.06-1.03l-.56 2.14c-.2.78-.75 1.76-1.12 2.36A12 12 0 1 0 12 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Col 2: Quick Navigation -->
            <div class="lg:col-span-3 xl:col-span-2 space-y-3">
              <h4 class="font-serif-editorial text-[17px] xl:text-lg font-semibold text-theme-gold tracking-wide whitespace-nowrap">Navigation</h4>
              <ul class="space-y-2 text-sm text-theme-secondary">
                <li><a href="index.html" class="hover:text-theme-gold transition whitespace-nowrap">Home 1 (Main)</a></li>
                <li><a href="home-2.html" class="hover:text-theme-gold transition whitespace-nowrap">Home 2 (Editorial)</a></li>
                <li><a href="about.html" class="hover:text-theme-gold transition whitespace-nowrap">About Our Atelier</a></li>
                <li><a href="services.html" class="hover:text-theme-gold transition whitespace-nowrap">Services &amp; Craft</a></li>
                <li><a href="pricing.html" class="hover:text-theme-gold transition whitespace-nowrap">Packages &amp; Pricing</a></li>
                <li><a href="gallery.html" class="hover:text-theme-gold transition whitespace-nowrap">Restoration Gallery</a></li>
                <li><a href="contact.html" class="hover:text-theme-gold transition whitespace-nowrap">Contact &amp; Booking</a></li>
                <li><a href="dashboard.html" class="hover:text-theme-gold transition font-medium text-theme-gold whitespace-nowrap">Customer Dashboard</a></li>
              </ul>
            </div>

            <!-- Col 3: Restoration Services -->
            <div class="lg:col-span-3 xl:col-span-3 space-y-3">
              <h4 class="font-serif-editorial text-[17px] xl:text-lg font-semibold text-theme-gold tracking-wide whitespace-nowrap">Restoration Services</h4>
              <ul class="space-y-2 text-sm text-theme-secondary">
                <li><a href="services.html#restoration" class="hover:text-theme-gold transition whitespace-nowrap">Vintage &amp; Torn Photo Repair</a></li>
                <li><a href="services.html#colorization" class="hover:text-theme-gold transition whitespace-nowrap">Forensic B&amp;W Colorization</a></li>
                <li><a href="services.html#enhancement" class="hover:text-theme-gold transition whitespace-nowrap">Facial Reconstruction &amp; Clarity</a></li>
                <li><a href="services.html#damage" class="hover:text-theme-gold transition whitespace-nowrap">Water, Mold &amp; Fire Recovery</a></li>
                <li><a href="services.html#albums" class="hover:text-theme-gold transition whitespace-nowrap">Bespoke Layflat Wedding Albums</a></li>
                <li><a href="services.html#albums" class="hover:text-theme-gold transition whitespace-nowrap">Archival Family Heritage Books</a></li>
              </ul>
            </div>

            <!-- Col 4: Studio Contact -->
            <div class="lg:col-span-3 xl:col-span-3 space-y-3">
              <h4 class="font-serif-editorial text-[17px] xl:text-lg font-semibold text-theme-gold tracking-wide whitespace-nowrap">Flagship Conservation Studio</h4>
              <ul class="space-y-3 text-sm text-theme-secondary">
                <li class="flex items-start gap-2.5">
                  <i data-lucide="map-pin" class="w-4 h-4 text-theme-gold shrink-0 mt-1"></i>
                  <span class="leading-snug">Suite 402, Heritage Art District, Kala Ghoda, Fort, Mumbai 400001, India</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <i data-lucide="phone" class="w-4 h-4 text-theme-gold shrink-0 mt-0.5"></i>
                  <div class="flex flex-col xl:flex-row xl:items-center gap-0.5 xl:gap-1.5 leading-snug">
                    <a href="tel:+912267894321" class="hover:text-theme-gold transition whitespace-nowrap">+91 22 6789 4321</a>
                    <span class="text-theme-muted hidden xl:inline">/</span>
                    <a href="tel:+919820154321" class="hover:text-theme-gold transition whitespace-nowrap">+91 98201 54321</a>
                  </div>
                </li>
                <li class="flex items-center gap-2.5">
                  <i data-lucide="mail" class="w-4 h-4 text-theme-gold shrink-0"></i>
                  <a href="mailto:concierge@memorastudio.in" class="hover:text-theme-gold transition whitespace-nowrap break-all sm:break-normal">concierge@memorastudio.in</a>
                </li>
                <li class="flex items-start gap-2.5">
                  <i data-lucide="clock" class="w-4 h-4 text-theme-gold shrink-0 mt-0.5"></i>
                  <div class="flex flex-col xl:flex-row xl:items-center gap-0.5 xl:gap-1.5 leading-snug">
                    <span class="whitespace-nowrap font-medium text-theme-primary">Mon – Sat:</span>
                    <span class="whitespace-nowrap">10:00 AM – 7:30 PM IST</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom Copyright, Legal & Back-To-Top -->
          <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-theme-muted">
            <p class="text-center md:text-left">© ${new Date().getFullYear()} MEMORA STUDIO Pvt. Ltd. All Rights Reserved. Crafted with Archival Precision.</p>
            
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-5">
              <a href="about.html" class="hover:text-theme-gold transition whitespace-nowrap">Privacy Vault Policy</a>
              <a href="pricing.html" class="hover:text-theme-gold transition whitespace-nowrap">Terms &amp; Archival Guarantee</a>
              <a href="dashboard.html" class="hover:text-theme-gold transition whitespace-nowrap">Track Order Status</a>
            </div>

            <!-- Back to Top Arrow Button (Icon Only) -->
            <button type="button" data-action="back-to-top" class="back-to-top-btn shrink-0" aria-label="Scroll back to top of page" title="Back to Top">
              <i data-lucide="arrow-up" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </footer>
    `;
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* ==========================================================================
   2. THEME (LIGHT/DARK) & DIRECTION (LTR/RTL) TOGGLES
   ========================================================================== */
function initThemeAndDirectionToggles() {
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('[data-action="toggle-theme"]');
    if (themeBtn) {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('memora_theme', isDark ? 'dark' : 'light');
      document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
        const iconSize = btn.classList.contains('h-11') ? 'w-5 h-5 text-theme-gold' : 'w-4 h-4';
        btn.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}" class="${iconSize}"></i>`;
      });
      if (window.lucide) window.lucide.createIcons();
      showToast(isDark ? 'Dark Espresso mode activated' : 'Warm Ivory Light mode activated');
    }

    const rtlBtn = e.target.closest('[data-action="toggle-rtl"]');
    if (rtlBtn) {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('memora_dir', next);
      document.querySelectorAll('[data-rtl-label]').forEach((el) => {
        el.textContent = next.toUpperCase();
      });
      showToast(`Layout direction switched to ${next.toUpperCase()}`);
    }

    const backToTopBtn = e.target.closest('[data-action="back-to-top"]');
    if (backToTopBtn) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

/* ==========================================================================
   3. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const drawer = document.getElementById('mobile-menu-drawer');

  if (!openBtn || !drawer) return;

  const openMenu = () => {
    drawer.classList.remove('hidden');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  };

  const closeMenu = () => {
    drawer.classList.add('hidden');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('hidden')) {
      closeMenu();
    }
  });

  // Close when clicking any nav link inside drawer
  drawer.querySelectorAll('nav a, a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Automatically reset scroll lock if resized to desktop (>= 1280px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1280 && !drawer.classList.contains('hidden')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   4. INTERACTIVE BEFORE & AFTER COMPARISON SLIDERS
   ========================================================================== */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.ba-slider-container');

  sliders.forEach((slider) => {
    const beforeLayer = slider.querySelector('.ba-before-layer');
    const beforeImg = beforeLayer ? beforeLayer.querySelector('img') : null;
    const handle = slider.querySelector('.ba-handle');
    if (!beforeLayer || !handle) return;

    let isDragging = false;

    const syncImageWidth = () => {
      if (beforeImg) {
        beforeImg.style.width = `${slider.offsetWidth}px`;
        beforeImg.style.maxWidth = 'none';
      }
    };

    syncImageWidth();
    window.addEventListener('resize', syncImageWidth);

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(4, Math.min(96, pos));
      beforeLayer.style.width = `${pos}%`;
      handle.style.left = `${pos}%`;
    };

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      syncImageWidth();
      setPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    slider.addEventListener(
      'touchstart',
      (e) => {
        isDragging = true;
        syncImageWidth();
        if (e.touches[0]) setPosition(e.touches[0].clientX);
      },
      { passive: true }
    );

    slider.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return;
        if (e.touches[0]) setPosition(e.touches[0].clientX);
      },
      { passive: true }
    );

    slider.addEventListener('touchend', () => {
      isDragging = false;
    });
  });

  // Tabbed Before/After Case Switcher (used on Home 1 & Services)
  const BA_CASES = {
    'case-1': {
      before: 'assets/images/ba-case1-before.jpg',
      after: 'assets/images/ba-case1-after.jpg'
    },
    'case-2': {
      before: 'assets/images/ba-case2-before.jpg',
      after: 'assets/images/ba-case2-after.jpg'
    },
    'case-3': {
      before: 'assets/images/gallery-ba1-before.jpg',
      after: 'assets/images/gallery-ba1-after.jpg'
    }
  };

  const caseButtons = document.querySelectorAll('[data-ba-case]');
  if (caseButtons.length > 0) {
    caseButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const caseKey = btn.getAttribute('data-ba-case');
        const pair = BA_CASES[caseKey] || {};
        const targetId = btn.getAttribute('data-ba-target');
        const beforeSrc = btn.getAttribute('data-before-src') || pair.before;
        const afterSrc = btn.getAttribute('data-after-src') || pair.after;
        const title = btn.getAttribute('data-case-title');
        const desc = btn.getAttribute('data-case-desc');
        const badge = btn.getAttribute('data-case-badge');

        caseButtons.forEach((b) => {
          b.classList.remove('bg-[#30251F]', 'text-[#F8F5EF]', 'border-[#C5A46D]');
          b.classList.add('bg-theme-surface', 'text-theme-primary');
        });
        btn.classList.remove('bg-theme-surface', 'text-theme-primary');
        btn.classList.add('bg-[#30251F]', 'text-[#F8F5EF]', 'border-[#C5A46D]');

        const container = document.getElementById(targetId || 'main-ba-showcase');
        if (container) {
          const beforeImg = container.querySelector('[data-role="before-img"]');
          const afterImg = container.querySelector('[data-role="after-img"]');
          if (beforeImg && beforeSrc) beforeImg.src = beforeSrc;
          if (afterImg && afterSrc) afterImg.src = afterSrc;
        }

        const titleEl = document.getElementById('ba-active-title');
        const descEl = document.getElementById('ba-active-desc');
        const badgeEl = document.getElementById('ba-active-badge');
        if (titleEl && title) titleEl.textContent = title;
        if (descEl && desc) descEl.textContent = desc;
        if (badgeEl && badge) badgeEl.textContent = badge;
      });
    });
  }
}

/* ==========================================================================
   5. GALLERY CATEGORY FILTERS & INTERACTIVE LIGHTBOX
   ========================================================================== */
function initGalleryFiltersAndLightbox() {
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-category]');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-gallery-filter');

        filterBtns.forEach((b) => {
          b.classList.remove('bg-[#30251F]', 'text-[#F8F5EF]', 'dark:bg-[#C5A46D]', 'dark:text-[#14110F]');
          b.classList.add('bg-theme-surface', 'text-theme-primary');
        });
        btn.classList.remove('bg-theme-surface', 'text-theme-primary');
        btn.classList.add('bg-[#30251F]', 'text-[#F8F5EF]', 'dark:bg-[#C5A46D]', 'dark:text-[#14110F]');

        let visibleCount = 0;
        galleryItems.forEach((item) => {
          const itemCats = (item.getAttribute('data-gallery-category') || '').split(',');
          if (category === 'all' || itemCats.includes(category)) {
            item.classList.remove('hidden');
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        const countDisplay = document.getElementById('gallery-filter-count');
        if (countDisplay) {
          countDisplay.textContent = `Showing ${visibleCount} archival works`;
        }
      });
    });
  }

  // Lightbox Trigger
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox-src]');
    if (!trigger) return;

    const src = trigger.getAttribute('data-lightbox-src');
    const title = trigger.getAttribute('data-lightbox-title') || 'Archival Restoration Masterpiece';
    const meta = trigger.getAttribute('data-lightbox-meta') || 'MEMORA STUDIO Conservation Archive';
    openLightboxModal(src, title, meta);
  });
}

function openLightboxModal(src, title, meta) {
  let modal = document.getElementById('memora-lightbox');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'memora-lightbox';
    modal.className = 'fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md p-4';
    document.body.appendChild(modal);
  }
  modal.classList.remove('hidden');
  modal.innerHTML = `
    <div class="relative max-w-4xl w-full bg-[#1C1613] border border-[#C5A46D]/40 rounded-2xl overflow-hidden shadow-2xl">
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <span class="text-xs uppercase tracking-widest text-[#C5A46D] block">${meta}</span>
          <h3 class="font-serif-editorial text-xl font-bold text-[#F8F5EF]">${title}</h3>
        </div>
        <button type="button" id="close-lightbox-btn" class="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C5A46D] text-white hover:text-[#14110F] flex items-center justify-center transition" aria-label="Close Preview">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <div class="p-4 sm:p-6 bg-black/50 flex items-center justify-center max-h-[75vh] overflow-hidden">
        <img src="${src}" alt="${title}" class="max-h-[68vh] w-auto object-contain rounded-lg border border-[#C5A46D]/30">
      </div>
      <div class="px-6 py-4 bg-[#241C18] flex flex-wrap items-center justify-between gap-4">
        <p class="text-xs text-[#D5C7B8]">Restored at 1200 DPI optical archival resolution • 16-bit color profile</p>
        <a href="dashboard.html" class="btn-gold !py-2 !px-5 text-xs">Commission Similar Restoration</a>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();

  modal.querySelector('#close-lightbox-btn').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

/* ==========================================================================
   6. UNIVERSAL QUICK UPLOAD & PACKAGE ENQUIRY MODAL
   ========================================================================== */
function initUniversalModals() {
  document.addEventListener('click', (e) => {
    const uploadTrigger = e.target.closest('[data-open-upload-modal]');
    if (uploadTrigger) {
      e.preventDefault();
      const preselectedPackage = uploadTrigger.getAttribute('data-package-name') || 'Standard Photo Restoration';
      openQuickUploadModal(preselectedPackage);
    }
  });
}

function openQuickUploadModal(preselectedPackage) {
  let modal = document.getElementById('memora-quick-upload-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'memora-quick-upload-modal';
    modal.className = 'fixed inset-0 z-[80] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto';
    document.body.appendChild(modal);
  }
  modal.classList.remove('hidden');

  modal.innerHTML = `
    <div class="relative max-w-xl w-full bg-theme-surface border border-theme-strong rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
      <div class="flex items-start justify-between gap-4 pb-4 border-b border-theme">
        <div>
          <span class="text-xs uppercase tracking-[0.2em] text-theme-gold font-semibold">Instant Archival Assessment</span>
          <h3 class="font-serif-editorial text-2xl font-bold text-theme-primary mt-0.5">Upload Photograph or Select Package</h3>
        </div>
        <button type="button" id="close-upload-modal" class="w-9 h-9 rounded-full border border-theme flex items-center justify-center text-theme-primary hover:border-[#C5A46D]">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <form id="quick-modal-form" class="mt-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-theme-secondary mb-1.5">Selected Service / Package</label>
          <input type="text" name="service" value="${preselectedPackage}" class="input-luxury font-medium" required>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-theme-secondary mb-1.5">Upload Photograph (JPG, PNG, WEBP)</label>
          <label class="flex flex-col items-center justify-center border-2 border-dashed border-theme-strong rounded-xl p-5 cursor-pointer hover:border-[#C5A46D] transition bg-theme-primary/50 text-center">
            <i data-lucide="upload-cloud" class="w-8 h-8 text-theme-gold mb-2"></i>
            <span class="text-sm font-medium text-theme-primary" id="modal-file-name">Click to select vintage photograph or drag &amp; drop</span>
            <span class="text-xs text-theme-muted mt-1">Encrypted private vault • Up to 50MB per scan</span>
            <input type="file" id="modal-file-input" accept=".jpg,.jpeg,.png,.webp" class="hidden">
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-theme-secondary mb-1.5">Your Full Name</label>
            <input type="text" name="name" required placeholder="Aarav Mehta" class="input-luxury">
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-theme-secondary mb-1.5">Email or WhatsApp</label>
            <input type="text" name="contact" required placeholder="aarav@example.com" class="input-luxury">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-theme-secondary mb-1.5">Restoration Notes</label>
          <textarea name="notes" rows="2" placeholder="Describe tears, fading, colorization preferences, or album size..." class="input-luxury"></textarea>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <a href="dashboard.html" class="text-xs font-semibold text-theme-gold underline hover:opacity-80">Or open full Customer Dashboard →</a>
          <button type="submit" class="btn-luxury-primary w-full sm:w-auto">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
            <span>Submit to Conservation Desk</span>
          </button>
        </div>
      </form>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const fileInput = modal.querySelector('#modal-file-input');
  const fileNameLabel = modal.querySelector('#modal-file-name');
  if (fileInput && fileNameLabel) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        fileNameLabel.textContent = `Selected: ${fileInput.files[0].name}`;
        fileNameLabel.classList.add('text-theme-gold', 'font-semibold');
      }
    });
  }

  modal.querySelector('#close-upload-modal').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  modal.querySelector('#quick-modal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    modal.classList.add('hidden');
    showToast('Restoration request logged! You can track progress in your Customer Dashboard.');
  });
}

/* ==========================================================================
   7. FORM VALIDATION & TOAST NOTIFICATIONS
   ========================================================================== */
function initFormsValidation() {
  const forms = document.querySelectorAll('[data-validate-form]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formType = form.getAttribute('data-validate-form');

      // Check required inputs
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach((field) => {
        if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
          valid = false;
          field.classList.add('border-red-500');
        } else {
          field.classList.remove('border-red-500');
        }
      });

      if (!valid) {
        showToast('Please complete all required fields properly.', 'error');
        return;
      }

      if (formType === 'newsletter') {
        form.reset();
        showToast('Welcome to The Archival Journal! Subscription confirmed.');
      } else if (formType === 'contact' || formType === 'enquiry') {
        const statusBox = form.querySelector('[data-form-status]');
        if (statusBox) {
          statusBox.className = 'mt-4 p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/40 text-sm text-emerald-700 dark:text-emerald-300 block';
          statusBox.innerHTML = '<strong>Archival Concierge Desk:</strong> Thank you! Your inquiry has been assigned Reference ID <code>#MEM-' + Math.floor(1000 + Math.random() * 9000) + '</code>. A senior restoration specialist will respond within 2 business hours.';
        }
        form.reset();
        showToast('Inquiry received by our Senior Conservation Specialist!');
      } else if (formType === 'appointment') {
        const statusBox = form.querySelector('[data-form-status]');
        if (statusBox) {
          statusBox.className = 'mt-4 p-4 rounded-xl bg-[#C5A46D]/20 border border-[#C5A46D] text-sm text-theme-primary block';
          statusBox.innerHTML = '<strong>Studio Consultation Reserved:</strong> Your private one-on-one session is tentatively scheduled. Calendar invitation sent to your email.';
        }
        form.reset();
        showToast('Private Studio Consultation slot requested!');
      }
    });
  });
}

function initFaqAccordions() {
  const faqTriggers = document.querySelectorAll('[data-faq-trigger]');
  faqTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('[data-faq-icon]');
      const isOpen = !content.classList.contains('hidden');

      if (isOpen) {
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

function showToast(message, type = 'success') {
  let container = document.getElementById('memora-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'memora-toast-container';
    container.className = 'fixed bottom-5 right-5 z-[95] flex flex-col gap-2 max-w-sm';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const borderClass = type === 'error' ? 'border-red-500' : 'border-[#C5A46D]';
  toast.className = `px-4 py-3.5 rounded-xl bg-[#241C18] text-[#F8F5EF] border ${borderClass} shadow-2xl flex items-center gap-3 text-sm transition-all duration-300`;
  toast.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full ${type === 'error' ? 'bg-red-500' : 'bg-[#C5A46D]'} shrink-0"></span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

window.showMemoraToast = showToast;

/* ==========================================================================
   8. IMAGE RESILIENCE FALLBACK HANDLER
   ========================================================================== */
function initImageFallbacks() {
  const fallbackSvg = (label) =>
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#30251F"/>
            <stop offset="100%" stop-color="#5C493E"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#bg)"/>
        <rect x="32" y="32" width="736" height="536" fill="none" stroke="#C5A46D" stroke-opacity="0.45" stroke-width="2"/>
        <circle cx="400" cy="260" r="64" fill="none" stroke="#C5A46D" stroke-width="2"/>
        <text x="400" y="370" text-anchor="middle" fill="#F8F5EF" font-family="Georgia, serif" font-size="26">MEMORA ARCHIVAL PLATE</text>
        <text x="400" y="405" text-anchor="middle" fill="#C5A46D" font-family="sans-serif" font-size="15">${label || 'Restored Family Heirloom'}</text>
      </svg>
    `);

  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function () {
      if (!this.dataset.fallbackApplied) {
        this.dataset.fallbackApplied = 'true';
        this.src = fallbackSvg(this.alt || 'Archival Photograph');
      }
    });
  });
}

function initAOSIfPresent() {
  if (window.AOS) {
    window.AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }
}

