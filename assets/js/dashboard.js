/**
 * MEMORA STUDIO — Customer Dashboard Interactive Controller
 * Connects all 8 dashboard sections to persistent localStorage state:
 * 1. Overview  2. Upload Old Photos  3. My Restoration Projects
 * 4. Status Tracking (7 stages)  5. Proof Approval (Before/After + Revisions)
 * 6. My Albums  7. Orders & Payments (Demo clearly labeled)  8. Profile & Settings
 */

const SEVEN_STAGES = [
  'Request Received',
  'Under Review',
  'Restoration in Progress',
  'Proof Ready',
  'Waiting for Customer Approval',
  'Approved',
  'Completed'
];

const DEFAULT_PROJECTS = [
  {
    id: 'MEM-8492',
    title: '1951 Shimla Summer Estate Portrait',
    submittedDate: '06 Nov 2026',
    service: 'Premium Restoration & Colorization',
    status: 'Waiting for Customer Approval',
    stageIndex: 4,
    price: 4499,
    instructions: 'Heal diagonal crease across sky and restore archival contrast on family group.',
    beforeImg: 'assets/images/proof-original.jpg',
    afterImg: 'assets/images/proof-v1.jpg',
    revisions: [
      { author: 'Meenakshi Iyer (Lead Colorist)', date: '09 Nov 2026', note: 'Uploaded Proof v1 with archival border removal and tonal restoration.' }
    ]
  },
  {
    id: 'MEM-8475',
    title: '1968 Father’s Convocation Portrait',
    submittedDate: '04 Nov 2026',
    service: 'Standard Restoration',
    status: 'Restoration in Progress',
    stageIndex: 2,
    price: 2499,
    instructions: 'Remove monsoon fungus rings on lower border and sharpen eyes.',
    beforeImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    afterImg: 'assets/images/ba-case2-after.jpg',
    revisions: []
  },
  {
    id: 'MEM-8398',
    title: '1976 Classical Recital Studio Print',
    submittedDate: '29 Oct 2026',
    service: 'Face Enhancement & Upscaling',
    status: 'Proof Ready',
    stageIndex: 3,
    price: 2999,
    instructions: 'Upscale to 24x36 inch exhibition resolution and balance stage lighting.',
    beforeImg: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=600&q=80',
    afterImg: 'assets/images/gallery-ba1-after.jpg',
    revisions: []
  },
  {
    id: 'MEM-8410',
    title: '1944 Ancestral Courtyard Gathering',
    submittedDate: '18 Oct 2026',
    service: 'Complex Forensic Restoration',
    status: 'Completed',
    stageIndex: 6,
    price: 8500,
    instructions: 'Stitched 3 torn sections and reconstructed missing pillar background.',
    beforeImg: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
    afterImg: 'assets/images/hero-restored-family.jpg',
    revisions: []
  }
];

const DEFAULT_ALBUMS = [
  {
    id: 'ALB-304',
    title: 'The Singhania Golden Jubilee Volume',
    type: 'Luxury Leather Album (12×16")',
    cover: 'Tuscan Espresso Calfskin + 24k Gold Crest',
    pages: '70 Archival Cotton Rag Pages (400 GSM)',
    status: 'Spread Proof Ready',
    price: '₹21,500',
    previewImg: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'ALB-289',
    title: 'Calcutta to Mumbai Lineage Monograph',
    type: 'Custom Heritage Album (12×12")',
    cover: 'Belgian Oatmeal Linen + Clamshell Box',
    pages: '100 Pages + Fold-out Family Tree',
    status: 'Completed & Dispatched',
    price: '₹34,900',
    previewImg: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=700&q=80'
  }
];

const DEFAULT_ORDERS = [
  {
    invoiceId: 'INV-2026-904',
    date: '06 Nov 2026',
    item: 'MEM-8492 • Premium Restoration & Colorization',
    baseAmount: '₹3,813',
    gstAmount: '₹686 (18% GST)',
    totalAmount: '₹4,499',
    status: '30% Deposit Paid (Demo)'
  },
  {
    invoiceId: 'INV-2026-881',
    date: '01 Nov 2026',
    item: 'ALB-304 • Luxury Leather Album (70 Pages)',
    baseAmount: '₹18,220',
    gstAmount: '₹3,280 (18% GST)',
    totalAmount: '₹21,500',
    status: 'Paid in Full (Demo)'
  },
  {
    invoiceId: 'INV-2026-812',
    date: '18 Oct 2026',
    item: 'MEM-8410 • Complex Forensic Restoration + Print',
    baseAmount: '₹7,203',
    gstAmount: '₹1,297 (18% GST)',
    totalAmount: '₹8,500',
    status: 'Paid in Full (Demo)'
  }
];

const DEFAULT_ACTIVITIES = [
  { time: '2 hours ago', text: 'Lead Colorist Meenakshi Iyer uploaded Proof v1 for #MEM-8492 (Waiting for Customer Approval).' },
  { time: 'Yesterday', text: 'Optical 1200 DPI scan completed for #MEM-8475 (1968 Father’s Convocation Portrait).' },
  { time: '3 days ago', text: 'Custom brass monogram die approved for Album #ALB-304.' },
  { time: '18 Oct 2026', text: 'Master TIFF archive unlocked and downloaded for #MEM-8410.' }
];

let pendingUploadFiles = [];
let activeTrackingProjectId = 'MEM-8492';
let activeProofProjectId = 'MEM-8492';

document.addEventListener('DOMContentLoaded', () => {
  initDashboardState();
  initSidebarNavigation();
  renderAllDashboardViews();
  initPhotoUploader();
  initProofApprovalActions();
  initProfileAndSettings();
});

function getDashboardData() {
  const projects = JSON.parse(localStorage.getItem('memora_projects_v2') || 'null') || DEFAULT_PROJECTS;
  const albums = JSON.parse(localStorage.getItem('memora_albums') || 'null') || DEFAULT_ALBUMS;
  const orders = JSON.parse(localStorage.getItem('memora_orders') || 'null') || DEFAULT_ORDERS;
  const activities = JSON.parse(localStorage.getItem('memora_activities') || 'null') || DEFAULT_ACTIVITIES;
  const user = JSON.parse(localStorage.getItem('memora_user') || 'null') || {
    firstName: 'Aarav',
    lastName: 'Singhania',
    email: 'aarav.singhania@heritage.in',
    phone: '+91 98201 67890',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'
  };
  return { projects, albums, orders, activities, user };
}

function saveDashboardData({ projects, albums, orders, activities, user }) {
  if (projects) localStorage.setItem('memora_projects_v2', JSON.stringify(projects));
  if (albums) localStorage.setItem('memora_albums', JSON.stringify(albums));
  if (orders) localStorage.setItem('memora_orders', JSON.stringify(orders));
  if (activities) localStorage.setItem('memora_activities', JSON.stringify(activities));
  if (user) localStorage.setItem('memora_user', JSON.stringify(user));
}

function initDashboardState() {
  if (!localStorage.getItem('memora_projects_v2')) {
    localStorage.setItem('memora_projects_v2', JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem('memora_albums')) {
    localStorage.setItem('memora_albums', JSON.stringify(DEFAULT_ALBUMS));
  }
  if (!localStorage.getItem('memora_orders')) {
    localStorage.setItem('memora_orders', JSON.stringify(DEFAULT_ORDERS));
  }
  if (!localStorage.getItem('memora_activities')) {
    localStorage.setItem('memora_activities', JSON.stringify(DEFAULT_ACTIVITIES));
  }
}

/* ==========================================================================
   SIDEBAR TAB NAVIGATION & MOBILE COLLAPSIBLE SIDEBAR
   ========================================================================== */
function initSidebarNavigation() {
  const navBtns = document.querySelectorAll('[data-dash-tab]');
  const panels = document.querySelectorAll('[data-dash-panel]');
  const mobileSidebar = document.getElementById('dash-sidebar');
  const mobileOpen = document.getElementById('dash-mobile-open');
  const mobileClose = document.getElementById('dash-mobile-close');
  const mobileBackdrop = document.getElementById('dash-mobile-backdrop');

  const switchTab = (tabName) => {
    navBtns.forEach((b) => {
      const isActive = b.getAttribute('data-dash-tab') === tabName;
      b.classList.toggle('active', isActive);
    });

    panels.forEach((p) => {
      if (p.getAttribute('data-dash-panel') === tabName) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    });

    // Re-sync Before/After slider width when Proof Approval tab opens
    if (tabName === 'proofs') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 60);
    }

    // Reset scroll position of main workspace container
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;

    if (mobileSidebar && window.innerWidth < 1280) {
      mobileSidebar.classList.add('hidden');
      if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
    }
  };

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-dash-tab'));
    });
  });

  // Quick Jump Links inside panels
  document.addEventListener('click', (e) => {
    const jump = e.target.closest('[data-jump-tab]');
    if (jump) {
      const targetTab = jump.getAttribute('data-jump-tab');
      const projId = jump.getAttribute('data-project-id');
      if (projId) {
        activeTrackingProjectId = projId;
        activeProofProjectId = projId;
        renderStatusTrackingView();
        renderProofApprovalView();
      }
      switchTab(targetTab);
    }
  });

  if (mobileOpen && mobileSidebar) {
    mobileOpen.addEventListener('click', () => {
      mobileSidebar.classList.remove('hidden');
      if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
    });
  }
  if (mobileClose && mobileSidebar) {
    mobileClose.addEventListener('click', () => {
      mobileSidebar.classList.add('hidden');
      if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
    });
  }
  if (mobileBackdrop && mobileSidebar) {
    mobileBackdrop.addEventListener('click', () => {
      mobileSidebar.classList.add('hidden');
      mobileBackdrop.classList.add('hidden');
    });
  }
}

/* ==========================================================================
   RENDER ALL DASHBOARD VIEWS
   ========================================================================== */
function renderAllDashboardViews() {
  renderOverviewStatsAndActivities();
  renderProjectsTable();
  renderStatusTrackingView();
  renderProofApprovalView();
  renderAlbumsView();
  renderOrdersView();
  renderProfileView();
  if (window.lucide) window.lucide.createIcons();
}

function renderOverviewStatsAndActivities() {
  const { projects, activities, user } = getDashboardData();

  const welcomeNames = document.querySelectorAll('[data-user-fullname]');
  welcomeNames.forEach((el) => (el.textContent = `${user.firstName} ${user.lastName}`));

  const activeCount = projects.filter((p) => p.status !== 'Completed').length;
  const completedCount = projects.filter((p) => p.status === 'Completed' || p.status === 'Approved').length;
  const pendingProofs = projects.filter(
    (p) => p.status === 'Waiting for Customer Approval' || p.status === 'Proof Ready'
  ).length;

  const statTotal = document.getElementById('stat-total-photos');
  const statActive = document.getElementById('stat-active-projects');
  const statCompleted = document.getElementById('stat-completed-projects');
  const statProofs = document.getElementById('stat-pending-proofs');

  if (statTotal) statTotal.textContent = projects.length + 12; // Includes multi-photo album plates
  if (statActive) statActive.textContent = activeCount;
  if (statCompleted) statCompleted.textContent = completedCount;
  if (statProofs) statProofs.textContent = pendingProofs;

  const activityList = document.getElementById('overview-activity-list');
  if (activityList) {
    activityList.innerHTML = activities
      .slice(0, 6)
      .map(
        (act) => `
      <li class="flex items-start gap-3 pb-3.5 border-b border-theme last:border-none last:pb-0">
        <span class="w-2.5 h-2.5 rounded-full bg-[#C5A46D] mt-1.5 shrink-0"></span>
        <div class="flex-1">
          <p class="text-xs sm:text-sm text-theme-primary">${act.text}</p>
          <span class="text-[11px] font-mono-code text-theme-muted">${act.time}</span>
        </div>
      </li>
    `
      )
      .join('');
  }
}

/* ==========================================================================
   2. UPLOAD OLD PHOTOS (DRAG & DROP + MULTI PREVIEW + PROJECT CREATION)
   ========================================================================== */
function initPhotoUploader() {
  const dropzone = document.getElementById('dash-dropzone');
  const fileInput = document.getElementById('dash-file-input');
  const previewGrid = document.getElementById('dash-upload-previews');
  const uploadForm = document.getElementById('dash-upload-form');

  if (!dropzone || !fileInput || !uploadForm) return;

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        window.showMemoraToast('Only JPG, JPEG, PNG, and WEBP files are supported.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        pendingUploadFiles.push({
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          dataUrl: e.target.result
        });
        renderUploadPreviews();
      };
      reader.readAsDataURL(file);
    });
  };

  const renderUploadPreviews = () => {
    if (!previewGrid) return;
    if (pendingUploadFiles.length === 0) {
      previewGrid.innerHTML = '';
      return;
    }
    previewGrid.innerHTML = pendingUploadFiles
      .map(
        (f, idx) => `
      <div class="relative rounded-xl border border-theme-strong bg-theme-surface p-2 flex items-center gap-3">
        <img src="${f.dataUrl}" alt="${f.name}" class="w-14 h-14 rounded-lg object-cover border border-[#C5A46D]/40 shrink-0" />
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold text-theme-primary truncate">${f.name}</p>
          <p class="text-[11px] font-mono-code text-theme-muted">${f.size} • Ready</p>
        </div>
        <button type="button" data-remove-upload="${idx}" class="w-7 h-7 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center text-xs" title="Remove">✕</button>
      </div>
    `
      )
      .join('');
  };

  previewGrid.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-remove-upload]');
    if (rm) {
      const idx = parseInt(rm.getAttribute('data-remove-upload'), 10);
      pendingUploadFiles.splice(idx, 1);
      renderUploadPreviews();
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-[#C5A46D]', 'bg-[#C5A46D]/10');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-[#C5A46D]', 'bg-[#C5A46D]/10');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-[#C5A46D]', 'bg-[#C5A46D]/10');
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files) handleFiles(fileInput.files);
  });

  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('up-photo-title').value.trim();
    const service = document.getElementById('up-restoration-type').value;
    const instructions = document.getElementById('up-instructions').value.trim();

    if (!title || !service || !instructions) {
      window.showMemoraToast('Please enter a photo title, restoration type, and instructions.', 'error');
      return;
    }

    const { projects, orders, activities } = getDashboardData();
    const newId = `MEM-${Math.floor(8500 + Math.random() * 1400)}`;
    const previewUrl =
      pendingUploadFiles.length > 0
        ? pendingUploadFiles[0].dataUrl
        : 'assets/images/proof-original.jpg';

    const newProj = {
      id: newId,
      title,
      submittedDate: '10 Nov 2026',
      service,
      status: 'Request Received',
      stageIndex: 0,
      price: 2499,
      instructions,
      beforeImg: previewUrl,
      afterImg: previewUrl,
      revisions: [
        { author: 'System Archive Log', date: 'Just now', note: `Project created with ${pendingUploadFiles.length || 1} uploaded image(s).` }
      ]
    };

    projects.unshift(newProj);
    activities.unshift({
      time: 'Just now',
      text: `Submitted new restoration request #${newId} (${title} — ${service}).`
    });
    orders.unshift({
      invoiceId: `INV-2026-${Math.floor(910 + Math.random() * 89)}`,
      date: '10 Nov 2026',
      item: `${newId} • ${service}`,
      baseAmount: '₹2,118',
      gstAmount: '₹381 (18% GST)',
      totalAmount: '₹2,499',
      status: 'Pending Deposit (Demo)'
    });

    saveDashboardData({ projects, orders, activities });
    pendingUploadFiles = [];
    renderUploadPreviews();
    uploadForm.reset();
    activeTrackingProjectId = newId;
    renderAllDashboardViews();
    window.showMemoraToast(`Project #${newId} submitted! Added to My Restoration Projects.`);
  });
}

/* ==========================================================================
   3. MY RESTORATION PROJECTS TABLE
   ========================================================================== */
function renderProjectsTable() {
  const { projects } = getDashboardData();
  const tbody = document.getElementById('dash-projects-tbody');
  if (!tbody) return;

  const badgeStyle = (status) => {
    if (status === 'Completed' || status === 'Approved') {
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
    if (status === 'Waiting for Customer Approval' || status === 'Proof Ready') {
      return 'bg-[#C5A46D]/20 text-theme-gold border-[#C5A46D]/50';
    }
    return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
  };

  tbody.innerHTML = projects
    .map(
      (p) => `
    <tr class="border-b border-theme hover:bg-black/5 dark:hover:bg-white/5 transition">
      <td class="py-4 px-4 sm:px-6 min-w-[280px]">
        <div class="flex items-center gap-3">
          <img src="${p.beforeImg}" alt="${p.title}" class="w-12 h-12 rounded-lg object-cover border border-theme-strong shrink-0 shadow-sm" />
          <div class="min-w-0 pr-2">
            <p class="font-semibold text-theme-primary text-xs sm:text-sm leading-snug break-words">${p.title}</p>
            <p class="text-[11px] text-theme-muted truncate max-w-[220px] sm:max-w-xs mt-0.5">${p.instructions}</p>
          </div>
        </div>
      </td>
      <td class="py-4 px-4 font-mono-code text-xs font-semibold text-theme-gold whitespace-nowrap min-w-[110px]">#${p.id}</td>
      <td class="py-4 px-4 text-xs text-theme-secondary whitespace-nowrap min-w-[120px]">${p.submittedDate}</td>
      <td class="py-4 px-4 text-xs text-theme-primary font-medium min-w-[180px] leading-snug">${p.service}</td>
      <td class="py-4 px-4 min-w-[180px] whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono-code font-semibold border ${badgeStyle(p.status)} whitespace-nowrap">
          ${p.status}
        </span>
      </td>
      <td class="py-4 px-4 sm:px-6 text-right whitespace-nowrap min-w-[210px] space-x-2">
        <button type="button" data-jump-tab="tracking" data-project-id="${p.id}" class="px-3 py-1.5 rounded-lg border border-theme-strong text-xs font-semibold text-theme-primary hover:border-[#C5A46D] transition">
          Track Status
        </button>
        <button type="button" data-jump-tab="proofs" data-project-id="${p.id}" class="px-3 py-1.5 rounded-lg bg-[#30251F] text-[#F8F5EF] dark:bg-[#C5A46D] dark:text-[#14110F] text-xs font-semibold hover:opacity-90 transition">
          Inspect Proof
        </button>
      </td>
    </tr>
  `
    )
    .join('');
}

/* ==========================================================================
   4. RESTORATION STATUS TRACKING (7-STAGE VISUAL PIPELINE)
   ========================================================================== */
function renderStatusTrackingView() {
  const { projects } = getDashboardData();
  const selector = document.getElementById('tracking-project-selector');
  const pipelineMount = document.getElementById('tracking-pipeline-mount');
  if (!pipelineMount) return;

  const currentProj = projects.find((p) => p.id === activeTrackingProjectId) || projects[0];
  if (!currentProj) return;

  if (selector) {
    selector.innerHTML = projects
      .map(
        (p) =>
          `<option value="${p.id}" ${p.id === currentProj.id ? 'selected' : ''}>#${p.id} — ${p.title} (${p.status})</option>`
      )
      .join('');

    selector.onchange = (e) => {
      activeTrackingProjectId = e.target.value;
      renderStatusTrackingView();
    };
  }

  const stageIdx = SEVEN_STAGES.indexOf(currentProj.status) !== -1
    ? SEVEN_STAGES.indexOf(currentProj.status)
    : currentProj.stageIndex || 0;

  const progressPercent = Math.round(((stageIdx + 1) / SEVEN_STAGES.length) * 100);

  pipelineMount.innerHTML = `
    <div class="p-6 rounded-2xl bg-theme-secondary border border-theme mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-mono-code text-theme-gold font-semibold">PROJECT #${currentProj.id} • SUBMITTED ${currentProj.submittedDate.toUpperCase()}</span>
        <h3 class="font-serif-editorial text-2xl font-bold text-theme-primary mt-0.5">${currentProj.title}</h3>
        <p class="text-xs text-theme-secondary mt-1">Assigned Discipline: <strong>${currentProj.service}</strong></p>
      </div>
      <div class="text-left sm:text-right">
        <span class="text-xs font-mono-code text-theme-muted block">Conservation Completion</span>
        <span class="font-serif-editorial text-3xl font-bold text-theme-gold">${progressPercent}%</span>
      </div>
    </div>

    <!-- Visual Progress Bar -->
    <div class="w-full h-3 rounded-full bg-theme-secondary overflow-hidden mb-8 border border-theme">
      <div class="h-full bg-[#C5A46D] transition-all duration-500" style="width: ${progressPercent}%"></div>
    </div>

    <!-- 7-Stage Connected Pipeline -->
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-2.5 lg:gap-3 items-stretch">
      ${SEVEN_STAGES.map((stageName, idx) => {
        const isDone = idx < stageIdx;
        const isCurrent = idx === stageIdx;
        return `
          <div class="rounded-xl p-2.5 sm:p-3 xl:p-4 border transition h-full flex flex-col justify-between min-w-0 ${
            isCurrent
              ? 'bg-[#30251F] text-[#F8F5EF] border-[#C5A46D] shadow-lg'
              : isDone
              ? 'bg-emerald-500/10 border-emerald-500/30 text-theme-primary'
              : 'bg-theme-surface border-theme text-theme-muted opacity-70'
          }">
            <div class="flex items-center justify-between mb-1.5 sm:mb-2 shrink-0">
              <span class="font-mono-code text-[11px] sm:text-xs font-bold ${isCurrent ? 'text-[#C5A46D]' : ''}">0${idx + 1}</span>
              <span class="text-xs shrink-0">${isDone ? '✓' : isCurrent ? '●' : '○'}</span>
            </div>
            <div class="flex-1 flex items-center my-1">
              <p class="text-[11px] sm:text-xs font-bold leading-snug break-words">${stageName}</p>
            </div>
            <div class="mt-2 pt-1 border-t border-black/5 dark:border-white/10 shrink-0">
              <span class="text-[10px] block opacity-80">${
                isDone ? 'Verified' : isCurrent ? 'Active Stage' : 'Queued'
              }</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ==========================================================================
   5. PROOF APPROVAL & REVISION COMMENTS
   ========================================================================== */
function renderProofApprovalView() {
  const { projects } = getDashboardData();
  const currentProj = projects.find((p) => p.id === activeProofProjectId) || projects[0];
  if (!currentProj) return;

  const titleEl = document.getElementById('proof-project-title');
  const statusBadge = document.getElementById('proof-status-badge');
  const beforeImg = document.getElementById('proof-before-img');
  const afterImg = document.getElementById('proof-after-img');
  const revList = document.getElementById('proof-revision-history');

  if (titleEl) titleEl.textContent = `#${currentProj.id} — ${currentProj.title}`;
  if (statusBadge) statusBadge.textContent = currentProj.status;
  if (beforeImg) beforeImg.src = currentProj.beforeImg;
  if (afterImg) afterImg.src = currentProj.afterImg;

  if (revList) {
    const revs = currentProj.revisions || [];
    revList.innerHTML =
      revs.length === 0
        ? `<p class="text-xs text-theme-muted">No revision comments logged yet.</p>`
        : revs
            .map(
              (r) => `
          <div class="p-3.5 rounded-xl bg-theme-secondary border border-theme text-xs">
            <div class="flex items-center justify-between font-semibold text-theme-primary mb-1">
              <span>${r.author}</span>
              <span class="font-mono-code text-[10px] text-theme-muted">${r.date}</span>
            </div>
            <p class="text-theme-secondary">${r.note}</p>
          </div>
        `
            )
            .join('');
  }
}

function initProofApprovalActions() {
  const approveBtn = document.getElementById('btn-approve-proof');
  const requestChangesBtn = document.getElementById('btn-request-changes');
  const revisionInput = document.getElementById('proof-revision-comment');

  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      const { projects, activities } = getDashboardData();
      const proj = projects.find((p) => p.id === activeProofProjectId) || projects[0];
      if (!proj) return;

      proj.status = 'Approved';
      proj.stageIndex = 5;
      proj.revisions.unshift({
        author: 'Client (Approved Proof)',
        date: 'Just now',
        note: 'Proof officially approved for final master uncompressed TIFF & print delivery.'
      });

      activities.unshift({
        time: 'Just now',
        text: `Approved restoration proof for #${proj.id} (${proj.title}).`
      });

      saveDashboardData({ projects, activities });
      renderAllDashboardViews();
      window.showMemoraToast(`Proof for #${proj.id} Approved! Master print unlocked.`);
    });
  }

  if (requestChangesBtn) {
    requestChangesBtn.addEventListener('click', () => {
      const comment = revisionInput ? revisionInput.value.trim() : '';
      if (!comment) {
        window.showMemoraToast('Please enter your revision instructions in the comment box first.', 'error');
        return;
      }

      const { projects, activities } = getDashboardData();
      const proj = projects.find((p) => p.id === activeProofProjectId) || projects[0];
      if (!proj) return;

      proj.status = 'Restoration in Progress';
      proj.stageIndex = 2;
      proj.revisions.unshift({
        author: 'Client Revision Request',
        date: 'Just now',
        note: comment
      });

      activities.unshift({
        time: 'Just now',
        text: `Requested revision on #${proj.id}: "${comment.slice(0, 50)}..."`
      });

      if (revisionInput) revisionInput.value = '';
      saveDashboardData({ projects, activities });
      renderAllDashboardViews();
      window.showMemoraToast(`Revision notes sent to Lead Artist for #${proj.id}.`);
    });
  }
}

/* ==========================================================================
   6. MY ALBUMS & 7. ORDERS & PAYMENTS (DEMO TRANSPARENCY)
   ========================================================================== */
function renderAlbumsView() {
  const { albums } = getDashboardData();
  const grid = document.getElementById('dash-albums-grid');
  if (!grid) return;

  grid.innerHTML = albums
    .map(
      (a) => `
    <div class="rounded-2xl bg-theme-surface border border-theme-strong overflow-hidden flex flex-col md:flex-row shadow-theme-soft group hover:border-[#C5A46D] transition-all duration-300">
      <!-- Album Cover / Spread Image Preview -->
      <div class="md:w-5/12 relative overflow-hidden bg-black/5 min-h-[200px] max-h-[260px] md:max-h-none shrink-0">
        <img src="${a.previewImg}" alt="${a.title}" class="w-full h-full md:absolute md:inset-0 object-cover group-hover:scale-105 transition-transform duration-500" />
        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-sm text-[#C5A46D] font-mono-code text-[11px] font-bold border border-[#C5A46D]/30 shadow-sm">
          #${a.id}
        </span>
      </div>

      <!-- Album Details & Specifications -->
      <div class="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div>
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-[10px] uppercase font-mono-code text-theme-muted tracking-wider">Atelier Commission</span>
            <span class="px-2.5 py-0.5 rounded-full ${
              a.status.includes('Completed')
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-[#C5A46D]/20 text-theme-gold border border-[#C5A46D]/40'
            } text-[11px] font-mono-code font-semibold">
              ${a.status}
            </span>
          </div>

          <h3 class="font-serif-editorial text-xl sm:text-2xl font-bold text-theme-primary leading-snug">
            ${a.title}
          </h3>

          <!-- Specifications Structured Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3 border-t border-theme/60 text-xs text-theme-secondary">
            <div class="space-y-0.5">
              <span class="text-[10px] uppercase font-mono-code text-theme-muted block">Format &amp; Size</span>
              <p class="font-medium text-theme-primary leading-tight">${a.type}</p>
            </div>
            <div class="space-y-0.5">
              <span class="text-[10px] uppercase font-mono-code text-theme-muted block">Cover Specification</span>
              <p class="font-medium text-theme-primary leading-tight">${a.cover}</p>
            </div>
            <div class="space-y-0.5 sm:col-span-2">
              <span class="text-[10px] uppercase font-mono-code text-theme-muted block">Paper &amp; Leaves</span>
              <p class="font-medium text-theme-primary leading-tight">${a.pages}</p>
            </div>
          </div>
        </div>

        <!-- Footer Price & Action -->
        <div class="pt-3.5 border-t border-theme flex flex-wrap items-center justify-between gap-3">
          <div>
            <span class="text-[10px] uppercase font-mono-code text-theme-muted block leading-none mb-1">Commission Tariff</span>
            <span class="font-serif-editorial text-2xl font-bold text-theme-primary">${a.price}</span>
          </div>
          <a href="services.html#albums" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-theme-strong text-xs font-semibold text-theme-primary hover:border-[#C5A46D] hover:text-theme-gold transition">
            <span>Customize Spreads</span>
            <span class="text-theme-gold">→</span>
          </a>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

function renderOrdersView() {
  const { orders } = getDashboardData();
  const tbody = document.getElementById('dash-orders-tbody');
  if (!tbody) return;

  tbody.innerHTML = orders
    .map(
      (o, idx) => `
    <tr class="border-b border-theme hover:bg-black/5 dark:hover:bg-white/5 transition">
      <td class="p-4 font-mono-code text-xs font-bold text-theme-gold whitespace-nowrap">${o.invoiceId}</td>
      <td class="p-4 text-xs text-theme-secondary whitespace-nowrap">${o.date}</td>
      <td class="p-4 text-xs sm:text-sm font-semibold text-theme-primary min-w-[180px]">${o.item}</td>
      <td class="p-4 text-xs text-theme-secondary whitespace-nowrap">${o.baseAmount} + ${o.gstAmount}</td>
      <td class="p-4 font-serif-editorial text-lg font-bold text-theme-primary whitespace-nowrap">${o.totalAmount}</td>
      <td class="p-4 whitespace-nowrap">
        <span class="inline-block px-2.5 py-1 rounded-full bg-[#C5A46D]/20 text-theme-gold text-[11px] font-mono-code font-semibold whitespace-nowrap">
          ${o.status}
        </span>
      </td>
      <td class="p-4 text-right whitespace-nowrap">
        <button type="button" data-simulate-invoice="${idx}" class="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-theme-strong text-xs font-semibold text-theme-primary hover:border-[#C5A46D] whitespace-nowrap transition">
          View Demo Invoice
        </button>
      </td>
    </tr>
  `
    )
    .join('');

  tbody.querySelectorAll('[data-simulate-invoice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-simulate-invoice'), 10);
      const order = orders[idx];
      if (!order) return;
      window.showMemoraToast(
        `DEMO INVOICE ${order.invoiceId}: ${order.totalAmount} (${order.status}) — Sandbox environment, no real card charged.`
      );
    });
  });
}

/* ==========================================================================
   8. PROFILE & SETTINGS + LOGOUT
   ========================================================================== */
function renderProfileView() {
  const { user } = getDashboardData();
  const firstInput = document.getElementById('prof-first');
  const lastInput = document.getElementById('prof-last');
  const emailInput = document.getElementById('prof-email');
  const phoneInput = document.getElementById('prof-phone');
  const avatarImgs = document.querySelectorAll('[data-user-avatar]');

  if (firstInput) firstInput.value = user.firstName || 'Aarav';
  if (lastInput) lastInput.value = user.lastName || 'Singhania';
  if (emailInput) emailInput.value = user.email || 'aarav.singhania@heritage.in';
  if (phoneInput) phoneInput.value = user.phone || '+91 98201 67890';
  if (user.avatar) {
    avatarImgs.forEach((img) => (img.src = user.avatar));
  }
}

function initProfileAndSettings() {
  const profileForm = document.getElementById('dash-profile-form');
  const passwordForm = document.getElementById('dash-password-form');
  const avatarInput = document.getElementById('prof-avatar-input');
  const logoutBtns = document.querySelectorAll('[data-action="logout"]');

  if (avatarInput) {
    avatarInput.addEventListener('change', () => {
      if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const { user } = getDashboardData();
          user.avatar = e.target.result;
          saveDashboardData({ user });
          renderProfileView();
          window.showMemoraToast('Profile portrait updated!');
        };
        reader.readAsDataURL(avatarInput.files[0]);
      }
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { user } = getDashboardData();
      user.firstName = document.getElementById('prof-first').value.trim() || 'Aarav';
      user.lastName = document.getElementById('prof-last').value.trim() || 'Singhania';
      user.email = document.getElementById('prof-email').value.trim();
      user.phone = document.getElementById('prof-phone').value.trim();
      saveDashboardData({ user });
      renderAllDashboardViews();
      window.showMemoraToast('Personal details saved to your client profile.');
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPass = document.getElementById('prof-new-pass').value;
      if (!newPass || newPass.length < 8) {
        window.showMemoraToast('New password must be at least 8 characters.', 'error');
        return;
      }
      passwordForm.reset();
      window.showMemoraToast('Vault password updated successfully.');
    });
  }

  logoutBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('memora_user');
      window.showMemoraToast('Logged out of Client Vault. Redirecting to Home...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 650);
    });
  });
}

