/* ============================================
   CESDA — Static site behaviors
   - Shared navbar + footer (no build step)
   - Navbar scroll state, mobile menu, active link
   - Approach cycle auto-advance + manual click
   - EIDM Stream / Research shuffler / Calendly shuffler (animated cards)
   - IntersectionObserver reveal-on-scroll
   ============================================ */

/* ----- Inline icon set (mirrors lucide-react sizes used in source) ----- */
const ICONS = {
  arrowUpRight: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  quote: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  phone: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  pin: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  checkCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
  microscope: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>',
  layers: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.18-9.17 4.16a2 2 0 0 1-1.66 0L2 12.18"/><path d="m22 17.18-9.17 4.16a2 2 0 0 1-1.66 0L2 17.18"/></svg>',
  languages: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
  compass: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  compassNav: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  shieldCheck: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  shieldCheckL: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  award: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  clockL: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  graduationCap: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  graduationSm: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>',
  briefcaseSm: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  heartHandshake: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5z"/><path d="M12 5 9.04 7.96a2.06 2.06 0 0 0 0 2.94l1.42 1.42a2.06 2.06 0 0 0 2.94 0L17 9.5"/><path d="m12 12-1.42 1.42a2.06 2.06 0 0 0 0 2.94l1.42 1.42a2.06 2.06 0 0 0 2.94 0L17 14.5"/></svg>',
  beaker: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>',
  fileSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="M13.27 16.27 15 18"/></svg>',
  fileText: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
  network: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>',
  messageSquare: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  building: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  globe2: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  bookOpen: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
  arrowUpRightSm: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
  fileText14: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
};

/* ----- Shared navbar -----
   Structure: About · What We Do · Our Work · Evidence & Publications ·
   Training · Team · News & Insights · Contact
   (Dropdowns removed; About → #foundation, What We Do → #expertise-list)
   -------------------------------------------------------------------------- */

function navHref(href) {
  const onHome = location.pathname === '' || location.pathname.endsWith('index.html');
  if (href.startsWith('#')) return onHome ? href : `index.html${href}`;
  return href;
}

function renderNavbar() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const onHome = path === '' || path === 'index.html';

  // Top-level items. Each one is either:
  //   'link'     → in-page anchor on the home page
  //   'route'    → a dedicated .html page
  //   'dropdown' → a hover dropdown menu
  const top = [
    { kind: 'link', label: 'About', href: '#about' },
    {
      kind: 'dropdown', label: 'what we do', href: '#expertise', isRoute: true, items: [
        { label: 'Generating, synthesising & translating evidence for EIDM', href: '#expertise', isRoute: true },
        { label: 'Strengthening inter national, regional & national collaboration', href: '#expertise', isRoute: true },
        { label: 'Capacity strengthening for evidence informed decision making', href: '#expertise', isRoute: true },
      ]
    },
    { kind: 'link', label: 'Evidence & Publications', href: '#publications' },
    {
      kind: 'dropdown', label: 'Projects', href: 'projects.html', isRoute: true, items: [
        { label: 'Living Systematic Reviews on HPV Vaccine Delivery', href: 'projects.html#hpv-vaccine', isRoute: true },
        { label: 'Integrating Peer-assisted Learning into existing Gender Clubs', href: 'projects.html#gender-clubs', isRoute: true },
        { label: 'Learning together to advance Evidence and Equity in Policymaking', href: 'projects.html#africa-leeps', isRoute: true },
      ]
    },
    { kind: 'route', label: 'Team', href: 'team.html' },
    { kind: 'route', label: 'News & Insights', href: 'news.html' },
    { kind: 'link', label: 'Contact', href: '#contact' },
  ];

  const desktopLinks = top.map(item => {
    if (item.kind === 'route') {
      const active = path === item.href;
      return `<a href="${item.href}" class="nav-link ${active ? 'is-active' : ''}">${item.label}</a>`;
    }
    if (item.kind === 'dropdown') {
      const active = item.href && path === item.href;
      const href = item.href ? (item.isRoute ? item.href : navHref(item.href)) : '#';
      const onclick = item.href ? '' : 'onclick="return false;"';
      const dropdownItems = item.items.map(sub => {
        const subHref = sub.isRoute ? sub.href : navHref(sub.href);
        return `<a href="${subHref}" class="nav-dropdown-item">${sub.label}</a>`;
      }).join('');
      return `<div class="nav-dropdown-wrapper">
        <a href="${href}" class="nav-link nav-dropdown-trigger ${active ? 'is-active' : ''}" ${onclick}>${item.label} <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></a>
        <div class="nav-dropdown-menu">${dropdownItems}</div>
      </div>`;
    }
    // link
    return `<a href="${navHref(item.href)}" class="nav-link">${item.label}</a>`;
  }).join('');

  // Mobile menu: flatten the same structure, with section headers per group
  const mobileSections = top.map((item, idx) => {
    const baseDelay = idx * 40;
    if (item.kind === 'route') {
      return `<a href="${item.href}" style="transition-delay:${baseDelay}ms">${item.label}</a>`;
    }
    if (item.kind === 'link') {
      return `<a href="${navHref(item.href)}" style="transition-delay:${baseDelay}ms">${item.label}</a>`;
    }
    // dropdown → show as section with sub-links in mobile
    const header = item.href
      ? `<a href="${item.href}" class="mobile-section-label" style="text-decoration: underline; font-weight: 600;">${item.label}</a>`
      : `<p class="mobile-section-label">${item.label}</p>`;
    const sub = item.items.map((it, j) => {
      const href = it.isRoute ? it.href : navHref(it.href);
      return `<a href="${href}" class="mobile-sub" style="transition-delay:${baseDelay + 40 * (j + 1)}ms">${it.label}</a>`;
    }).join('');
    return `
      <div class="mobile-section" style="transition-delay:${baseDelay}ms">
        ${header}
        ${sub}
      </div>
    `;
  }).join('');

  return `
  <div class="noise-overlay"></div>
  <nav class="nav-shell" id="navShell">
    <a href="index.html" class="nav-logo"><img src="assets/logo.png" alt="CESDA"></a>
    <div class="nav-links">
      ${desktopLinks}
    </div>
    <div class="flex items-center gap-2">
      <a href="${onHome ? '#contact' : 'index.html#contact'}" class="nav-cta" id="navCta">Partner with us ${ICONS.arrowUpRight}</a>
      <button type="button" class="nav-toggle" id="navToggle" aria-label="Toggle menu">${ICONS.menu}</button>
    </div>
  </nav>
  <div class="mobile-menu" id="mobileMenu">
    <div class="backdrop"></div>
    <div class="panel">
      ${mobileSections}
      <a href="${onHome ? '#contact' : 'index.html#contact'}" class="btn-primary" id="mobileCta">Partner with us ${ICONS.arrowUpRight}</a>
    </div>
  </div>
  `;
}

/* ----- Shared footer ----- */
function renderFooter() {
  return `
  <footer class="site-footer">
    <span class="blob"></span>
    <div class="container-x">
      <div class="grid" style="grid-template-columns: 1fr;">
        <div>
          <a href="index.html" class="brand"><span class="logo"><img src="logo2.jpg" alt="CESDA"></span></a>
          
          <div class="live">
          </div>
        </div>
      </div>

      <div class="contact-strip">
        <div class="item">
          <span class="ico">${ICONS.mail}</span>
          <div>
            <p class="label">Email</p>
            <a class="val" href="mailto:info@cesdaf.org">info@cesdaf.org</a>
          </div>
        </div>
        <div class="item">
          <span class="ico">${ICONS.phone}</span>
          <div>
            <p class="label">Phone</p>
            <p class="val">+251 947 999 900 · +251 947 999 922</p>
          </div>
        </div>
        <div class="item">
          <span class="ico">${ICONS.pin}</span>
          <div>
            <p class="label">Location</p>
            <p class="val">Lideta Sub city, Woreda 9, Addis Ababa, Ethiopia</p>
          </div>
        </div>
      </div>

      <div class="bottom-row">
        <p class="copy">© 2026 CESDA — Center for Evidence Synthesis, Support &amp; Development in Africa. All rights reserved.</p>
        <div class="links">
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms of Use</a>
          <a href="index.html#home" class="back">Back to top ${ICONS.arrowUpRightSm}</a>
        </div>
      </div>
    </div>
  </footer>
  `;
}

/* ----- Navbar behaviors ----- */
function initNavbar() {
  const shell = document.getElementById('navShell');
  const cta = document.getElementById('navCta');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');

  const onScroll = () => {
    const scrolled = true;
    shell.classList.toggle('is-scrolled', scrolled);
    cta.classList.toggle('is-scrolled', scrolled);
    toggle.innerHTML = (menu.classList.contains('is-open') ? ICONS.x : ICONS.menu);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.innerHTML = open ? ICONS.x : ICONS.menu;
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // close menu when a link is clicked
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.innerHTML = ICONS.menu;
    document.body.style.overflow = '';
  }));
}

/* ----- Approach cycle (auto + manual) ----- */
function initCycle() {
  const root = document.getElementById('cycle');
  if (!root) return;
  const dots = root.querySelectorAll('.cycle-dot');
  const cards = root.querySelectorAll('.cycle-card');
  let active = 0;
  let timer = null;

  const setActive = (i) => {
    active = (i + cards.length) % cards.length;
    dots.forEach((d, j) => d.classList.toggle('is-active', j === active));
    cards.forEach((c, j) => {
      const on = j === active;
      c.classList.toggle('is-active', on);
      c.querySelectorAll('[data-on]').forEach(el => {
        if (el.dataset.on === 'idle') el.classList.toggle('idle', !on), el.classList.toggle('active', on);
      });
    });
  };
  dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(timer); setActive(i); restart(); }));
  cards.forEach((c, i) => c.addEventListener('click', () => { clearInterval(timer); setActive(i); restart(); }));

  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => setActive(active + 1), 2400);
  };

  // Start when in view
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) restart();
    else clearInterval(timer);
  }, { threshold: 0.4 });
  obs.observe(root);

  setActive(0);
}

/* ----- Research themes shuffler ------------------------------------------
---------------------------------------------------------------------- */
const SHUFFLE_THEMES = [
  { tag: 'Health', title: 'Maternal & adolescent', desc: 'Teenage pregnancy, maternal mortality' },
  { tag: 'Climate', title: 'Climate adaptation', desc: 'Resilience in pastoralist communities' },
  { tag: 'Education', title: 'Learning outcomes', desc: 'Foundational literacy & numeracy' },
  { tag: 'Economy', title: 'Youth employment', desc: 'Skills, jobs, and the informal sector' },
  { tag: 'Governance', title: 'Public service reform', desc: 'Accountability & transparency' },
];
function initShuffler() {
  document.querySelectorAll('.shuffler').forEach(host => {
    const stack = host.querySelector('.cards');
    let idx = 0;
    const render = () => {
      stack.innerHTML = SHUFFLE_THEMES.map((t, i) => {
        const offset = (i - idx + SHUFFLE_THEMES.length) % SHUFFLE_THEMES.length;
        const isFront = offset === 0;
        const isBack = offset === SHUFFLE_THEMES.length - 1;
        const isMid = offset === 1 || offset === SHUFFLE_THEMES.length - 2;
        const z = SHUFFLE_THEMES.length - offset;
        const bg = isFront
          ? 'linear-gradient(180deg, #FFFFFF 0%, #F4F8FC 100%)'
          : isBack ? 'rgba(255,255,255,0.4)'
            : isMid ? 'rgba(255,255,255,0.7)'
              : 'rgba(255,255,255,0.85)';
        const filter = offset > 0 ? `blur(${offset * 0.6}px) saturate(${1 - offset * 0.15})` : 'none';
        const opacity = offset > 2 ? 0.5 : 1;
        const transform = `translateY(${offset * 14}px) scale(${1 - offset * 0.05})`;
        return `
          <div class="scard" style="z-index:${z}; background:${bg}; filter:${filter}; opacity:${opacity}; transform:${transform}">
            <p class="tag">${t.tag}</p>
            <p class="ttl" style="color:${isFront ? 'var(--ink)' : 'rgba(10,37,64,0.8)'}">${t.title}</p>
            ${isFront ? `<p class="desc">${t.desc}</p>` : ''}
          </div>
        `;
      }).join('');
    };
    render();
    setInterval(() => { idx = (idx + 1) % SHUFFLE_THEMES.length; render(); }, 3000);
  });
}

/* ----- Consultation scheduler ----- */
function initScheduler() {
  document.querySelectorAll('.cal').forEach(host => {
    const grid = host.querySelector('.grid');
    const cursor = host.querySelector('.cursor');
    const status = host.querySelector('.status span');
    let step = 0;
    const day0 = 14;
    const render = () => {
      const day = day0 + (step % 5) * 4;
      grid.innerHTML = '';
      for (let i = 0; i < 28; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (i % 7 === 0 || i % 7 === 6) cell.classList.add('is-weekend');
        if (i === day && step >= 2) cell.classList.add('is-hover');
        if (i === day && step === 3) cell.classList.add('is-click');
        if (i === day && step === 4) cell.classList.add('is-confirm');
        cell.textContent = i + 1;
        grid.appendChild(cell);
      }
      const x = (day % 7) * 14.28 + 7;
      const y = Math.floor(day / 7) * 22 + 48;
      cursor.style.left = `${x}%`;
      cursor.style.top = `${y}px`;
      const labels = ['Select a date', 'Browse calendar', 'Hovering', 'Confirming...', 'Confirmed'];
      status.textContent = labels[step];
      status.parentElement.querySelector('svg')?.remove();
      if (step === 4) {
        const check = document.createElement('div');
        check.innerHTML = ICONS.checkCircle;
        status.parentElement.appendChild(check);
      }
    };
    render();
    setInterval(() => { step = (step + 1) % 5; render(); }, 1400);
  });
}

/* ----- Reveal-on-scroll ----- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(e => obs.observe(e));
}

/* ----- Contact form ----- */
const CONTACT_EMAIL = 'info@cesdaf.org';

function showFormSuccess(status, submitBtn) {
  status.innerHTML = `
    <div class="text-center" style="padding:2.5rem 0">
      <div style="display:inline-flex;height:4rem;width:4rem;align-items:center;justify-content:center;border-radius:9999px;background:rgba(179,158,101,0.20);margin-bottom:1.25rem">
        <span style="color:var(--accent)">${ICONS.checkCircle}</span>
      </div>
      <h4 class="h-card" style="font-size:1.875rem;margin-bottom:0.75rem">Thanks — we'll be in touch.</h4>
    </div>
  `;
  submitBtn.disabled = false;
}

function showFormError(status, submitBtn, message, defaultBtnHtml) {
  const error = document.createElement('p');
  error.className = 'form-error';
  error.textContent = message;
  error.style.cssText = 'margin:0 0 1rem;color:#b42318;font-size:0.875rem;text-align:center';
  status.insertBefore(error, status.firstChild);
  submitBtn.disabled = false;
  submitBtn.innerHTML = defaultBtnHtml;
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const defaultBtnHtml = form.querySelector('button[type="submit"]')?.innerHTML;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.querySelector('.form-error')?.remove();

    const required = ['name', 'email', 'subject', 'message'];
    for (const k of required) {
      const v = form.elements[k].value.trim();
      if (!v) return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending…';

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      organization: form.elements.organization.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim(),
      _subject: `CESDA website enquiry: ${form.elements.subject.value.trim()}`,
      _replyto: form.elements.email.value.trim(),
      _template: 'table',
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Request failed');

      showFormSuccess(status, submitBtn);
    } catch {
      showFormError(
        status,
        submitBtn,
        'Something went wrong sending your message. Please try again or email us directly at info@cesdaf.org.',
        defaultBtnHtml
      );
    }
  });
}

/* ----- Hero globe chroma-key ----- */
/* The MP4/WebM globe has a solid green canvas with only a thin wireframe.
   CSS mix-blend-mode can't remove the green because the hero background
   is a similar tone. So we hide the <video> and draw its frames to
   a <canvas>, where JS scales the alpha by "greenness" — true
   transparency, hero background shows through the wireframe.            */
function initGlobeChroma() {
  const video = document.querySelector('.hero-globe-video');
  const canvas = document.querySelector('.hero-globe-canvas');
  if (!video || !canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Green-screen key. For each pixel we compute a "greenness" score in
  // [0, 1]: 0 for non-green (wireframe stays fully opaque), 1 for a
  // pure-green background pixel (becomes fully transparent), and a
  // smooth gradient in between so the anti-aliased wireframe edges
  // feather cleanly against the hero background. Greenness is the gap
  // between the green channel and the max of red/blue, normalised so
  // a gap of GREEN_GAP (or more) is a full key-out.
  const GREEN_GAP = 60;

  let stopped = false;
  let isVisible = true;

  // Resize the canvas backing buffer to match the on-screen size once
  // the video has its real dimensions, capped at 640×640 for perf.
  function syncCanvasSize() {
    const w = Math.min(640, video.videoWidth || 640);
    const h = Math.min(640, video.videoHeight || 640);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
  }

  function draw() {
    if (stopped || !isVisible) return;
    if (video.readyState < 2 || video.paused || video.ended) {
      requestAnimationFrame(draw);
      return;
    }

    syncCanvasSize();

    // Draw the current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Pull the pixel buffer and walk it
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Background = green-dominant pixel. Scale alpha by greenness so
      // pure green is fully transparent and the wireframe stays opaque.
      const gap = g - Math.max(r, b);
      const key = gap <= 0 ? 0 : gap >= GREEN_GAP ? 1 : gap / GREEN_GAP;
      data[i + 3] = Math.round(data[i + 3] * (1 - key));
    }

    ctx.putImageData(frame, 0, 0);

    requestAnimationFrame(draw);
  }

  // Try to autoplay (muted, so it should work without a user gesture)
  const playPromise = video.play();
  if (playPromise && playPromise.catch) {
    playPromise.catch(() => {
      // Autoplay blocked — wait for the first user interaction
      const resume = () => {
        video.play();
        document.removeEventListener('click', resume);
        document.removeEventListener('touchstart', resume);
        document.removeEventListener('scroll', resume);
      };
      document.addEventListener('click', resume, { once: true });
      document.addEventListener('touchstart', resume, { once: true });
      document.addEventListener('scroll', resume, { once: true });
    });
  }

  video.addEventListener('play', () => {
    if (isVisible) requestAnimationFrame(draw);
  });

  const obsGlobe = document.querySelector('.hero-globe-stage');
  if (obsGlobe && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      if (!isVisible) {
        video.pause();
      } else {
        video.play().catch(() => { });
        requestAnimationFrame(draw);
      }
    });
    obs.observe(obsGlobe);
  }

  // Stop the loop if the user prefers reduced motion
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mql.matches) stopped = true;
  mql.addEventListener('change', e => { stopped = e.matches; if (!stopped) requestAnimationFrame(draw); });
}

/* ----- Report modal ----- */
function initReportModal() {
  const modal = document.getElementById('reportModal');
  const openBtn = document.getElementById('openReportModal');
  const closeBtn = document.getElementById('closeReportModal');
  const backdrop = document.getElementById('reportModalBackdrop');
  const ctaBtn = document.getElementById('reportModalCta');
  if (!modal || !openBtn) return;

  const open = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  if (ctaBtn) ctaBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}

/* ----- Partner Modal ----- */
const PARTNERS_INFO = {
  JBI: {
    name: "JBI — Joanna Briggs Institute",
    url: "https://jbi.global",
    logo: "jbi.png",
    desc: ""
  },
  ALIVE: {
    name: "ALIVE — Future Evidence",
    url: "https://aliveevidence.org",
    logo: "alive.png",
    desc: ""
  },
  Brink: {
    name: "Brink Foundation",
    url: "https://brink-foundation.org",
    logo: "brink.png",
    desc: ""
  },
  PACE: {
    name: "PACE — Pan African Collective for Evidence",
    url: "https://pace-evidence.org",
    logo: "pace.png",
    desc: ""
  },
  ACRES: {
    name: "ACRES — Center for Rapid Evidence Synthesis",
    url: "https://acres.or.ug",
    logo: "acres.png",
    desc: ""
  },
  OHB: {
    name: "OHB Oromia health bereau",
    url: "https://orhb.gov.et",
    logo: "OHB.png",
    desc: ""
  },
  PC: {
    name: "Pioneer collage",
    url: "https://pioneercollege.edu.et",
    logo: "PC.png",
    desc: ""
  },
  OEB: {
    name: "OEB Oromia Edducation bereau",
    url: "https://tmis.oeb.gov.et",
    logo: "OEB.png",
    desc: ""
  },
  JU: {
    name: "Jimma university",
    url: "https://ju.edu.et",
    logo: "JU.png",
    desc: ""
  }
};

window.openPartnerModal = function (partnerId) {
  const modal = document.getElementById('partnerModal');
  const content = document.getElementById('partnerModalContent');
  if (!modal || !content || !PARTNERS_INFO[partnerId]) return;

  const p = PARTNERS_INFO[partnerId];

  content.innerHTML = `
    <button type="button" class="report-modal-close" id="closePartnerBtn" aria-label="Close modal">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    </button>
    <div class="partner-modal-header" style="display:flex; flex-direction:column; align-items:center; text-align:center; margin-bottom: 2rem;">
      <div class="partner-logo-placeholder" style="width: 100px; height: 100px; border-radius: 50%; background: transparent; display:flex; align-items:center; justify-content:center; margin-bottom:1.25rem;">
        <img src="${p.logo}" alt="${p.name}" style="height: 80%; width: auto; object-fit: contain;" />
      </div>
      <h2 class="h-display" style="font-size: 1.75rem;">${p.name}</h2>
    </div>
    <p style="font-family: var(--font-body); font-size: 0.95rem; line-height: 1.75; color: var(--muted); margin-bottom: 1.5rem;">
      ${p.desc}
    </p>
    <div style="margin-top: 2rem; display:flex; justify-content:center;">
      <a href="${p.url}" target="_blank" class="btn-outline">Visit Website <span id="ic-arrR"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span></a>
    </div>
  `;

  document.getElementById('closePartnerBtn').addEventListener('click', () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

function initPartnerModalEvents() {
  const modal = document.getElementById('partnerModal');
  const backdrop = document.getElementById('partnerModalBackdrop');
  if (!modal || !backdrop) return;

  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}

/* ----- Training Modal ----- */
const TRAINING_INFO = {
  CSRTP: {
    name: "Comprehensive systematic review training (CSRTP)",
    desc: "The JBI-Ethiopian Knowledge Translation Center for Health and Development, hosted by CESDA, runs comprehensive systematic review training in Adama, Ethiopia — equipping researchers and programme staff to conduct and use JBI-style reviews."
  },
  KT: {
    name: "Knowledge translation & EIDM",
    desc: "Short courses and mentorship on translating evidence into policy briefs, summaries, and interactive tools — for teams that produce or broker evidence."
  },
  MENTORSHIP: {
    name: "Mentorship & institutional support",
    desc: "We work alongside ministries, research institutions, and networks — providing long-term capacity strengthening that embeds evidence practice into everyday work."
  },
  RESOURCES: {
    name: "Training resources",
    desc: "Curated reading lists, recorded sessions, and learning materials — released alongside each training round so that learning continues beyond the classroom."
  },
  SCOPING: {
    name: "Scoping Review Workshop",
    desc: "A practical workshop on scoping reviews — mapping the size and nature of an evidence base to inform policy, programming, and further research."
  },
  RAPID: {
    name: "Rapid Review",
    desc: "Methods for time-sensitive evidence synthesis — producing policy-relevant findings on a shortened timeline while maintaining rigour."
  },
  POLICY: {
    name: "Policy Brief",
    desc: "A hands-on workshop on translating complex evidence into concise, decision-ready policy briefs — structure, framing, and visual design."
  },
  INTRO_EIDM: {
    name: "Introduction to EIDM",
    desc: "Foundational concepts of evidence-informed decision-making — what evidence is, where it comes from, and how it is used in policy and programmes."
  }
};

window.openTrainingModal = function (trainingId) {
  const modal = document.getElementById('trainingModal');
  const content = document.getElementById('trainingModalContent');
  if (!modal || !content || !TRAINING_INFO[trainingId]) return;

  const t = TRAINING_INFO[trainingId];

  content.innerHTML = `
    <button type="button" class="report-modal-close" id="closeTrainingBtn" aria-label="Close modal">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    </button>
    <div class="partner-modal-header" style="display:flex; flex-direction:column; align-items:center; text-align:center; margin-top: 1rem; margin-bottom: 1.5rem;">
      <h2 class="h-display" style="font-size: 1.75rem;">${t.name}</h2>
    </div>
    <p style="font-family: var(--font-body); font-size: 0.95rem; line-height: 1.75; color: var(--muted); margin-bottom: 2rem;">
      ${t.desc}
    </p>
    <div style="display:flex; justify-content:center;">
       <button type="button" class="btn-primary" onclick="document.getElementById('trainingModal').classList.remove('is-open'); document.body.style.overflow = '';">Close</button>
    </div>
  `;

  document.getElementById('closeTrainingBtn').addEventListener('click', () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

function initTrainingModalEvents() {
  const modal = document.getElementById('trainingModal');
  const backdrop = document.getElementById('trainingModalBackdrop');
  if (!modal || !backdrop) return;

  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}

/* ----- Expertise Modal ----- */
const EXPERTISE_INFO = {
  // Pillar 1 — Evidence
  EVIDENCE_GEN: {
    name: "High-quality evidence generation",
    icon: ICONS.beaker,
    desc: "We design and implement rigorous research studies, evaluations, and surveys to generate credible, relevant evidence for addressing complex development challenges. Our approach combines quantitative and qualitative methods — including implementation research, mixed-methods evaluations, and large-scale surveys — to produce actionable evidence that directly informs policy and programming decisions across Africa."
  },
  EVIDENCE_SYNTH: {
    name: "Systematic evidence synthesis",
    icon: ICONS.fileSearch,
    desc: "We aggregate and analyse existing research through systematic reviews, meta-analyses, and rapid reviews to provide comprehensive insights on critical policy and programmatic issues. Our synthesis work follows internationally recognised standards — including JBI, Cochrane, and PRISMA methodologies — ensuring transparency, methodological rigour, and reproducibility across every review we undertake."
  },
  KT_PRODUCTS: {
    name: "Knowledge translation products",
    icon: ICONS.fileText,
    desc: "We develop policy briefs, evidence summaries, and interactive tools that transform complex evidence into accessible, actionable formats tailored to decision-makers. From concise two-page briefs to comprehensive evidence repositories, our knowledge translation products bridge the gap between research and the people who use it — policymakers, practitioners, programme managers, and development leaders."
  },
  // Pillar 2 — Collaboration
  NETWORKS: {
    name: "Networks & communities of practice",
    icon: ICONS.network,
    desc: "We establish and strengthen networks and communities of practice to foster collaboration among researchers, policymakers, practitioners, and other stakeholders. Through these networks, we create spaces for knowledge exchange, joint learning, and collective action — connecting evidence producers with evidence users across institutions, sectors, and borders."
  },
  CONVENINGS: {
    name: "Convenings & dialogues",
    icon: ICONS.messageSquare,
    desc: "We organise convenings, dialogues, and platforms for sharing knowledge, experiences, and best practices across sectors and borders. These range from policy dialogues and stakeholder workshops to regional conferences and evidence summits — creating structured opportunities for diverse actors to engage with evidence and co-develop solutions."
  },
  COCREATED: {
    name: "Co-created knowledge",
    icon: ICONS.sparkles,
    desc: "We co-create knowledge with stakeholders to ensure relevance, ownership, and impact so evidence lives where decisions are made. By embedding co-creation into the research process — from question formulation to dissemination — we ensure that findings are contextually grounded, practically applicable, and embraced by the communities and institutions they serve."
  },
  // Pillar 3 — Capacity Building
  CSRTP: {
    name: "Comprehensive Systematic Review Training (CSRTP)",
    icon: ICONS.graduationCap,
    desc: "The JBI-Ethiopian Knowledge Translation Center for Health and Development, hosted by CESDA, runs comprehensive systematic review training in Adama, Ethiopia. This flagship programme equips researchers and programme staff to conduct and use JBI-style reviews — covering the full cycle from protocol development through search strategy, critical appraisal, data extraction, and synthesis."
  },
  SCOPING: {
    name: "Scoping Review Workshop",
    icon: ICONS.layers,
    desc: "A practical workshop on scoping reviews — mapping the size and nature of an evidence base to inform policy, programming, and further research. Participants learn to define broad research questions, systematically identify and chart relevant literature, and produce scoping review reports that provide a comprehensive overview of available evidence."
  },
  RAPID: {
    name: "Rapid Review",
    icon: ICONS.clockL,
    desc: "Methods for time-sensitive evidence synthesis — producing policy-relevant findings on a shortened timeline while maintaining rigour. This training covers streamlined search strategies, focused inclusion criteria, and accelerated appraisal techniques that enable teams to deliver actionable evidence within weeks rather than months."
  },
  POLICY: {
    name: "Policy Brief",
    icon: ICONS.fileText,
    desc: "A hands-on workshop on translating complex evidence into concise, decision-ready policy briefs — covering structure, framing, and visual design. Participants learn to distil key messages from large evidence bases, frame findings for specific audiences, and produce professional-quality briefs that communicate clearly and persuasively."
  },
  INTRO_EIDM: {
    name: "Introduction to EIDM",
    icon: ICONS.sparkles,
    desc: "Foundational concepts of evidence-informed decision-making — what evidence is, where it comes from, and how it is used in policy and programmes. This introductory course is designed for policymakers, programme managers, and emerging researchers who want to understand the principles and practice of using evidence to improve decisions."
  },
  MENTORSHIP: {
    name: "Mentorship & institutional support",
    icon: ICONS.globe,
    desc: "We work alongside ministries, research institutions, and networks — providing long-term capacity strengthening that embeds evidence practice into everyday work. Our mentorship goes beyond one-off training: we support teams through ongoing coaching, collaborative projects, and institutional systems development to build lasting evidence-use capacity."
  }
};

window.openExpertiseModal = function (expertiseId) {
  const modal = document.getElementById('expertiseModal');
  const content = document.getElementById('expertiseModalContent');
  if (!modal || !content || !EXPERTISE_INFO[expertiseId]) return;

  const e = EXPERTISE_INFO[expertiseId];

  content.innerHTML = `
    <button type="button" class="report-modal-close" id="closeExpertiseBtn" aria-label="Close modal">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    </button>
    <div class="partner-modal-header" style="display:flex; flex-direction:column; align-items:center; text-align:center; margin-top: 0.5rem; margin-bottom: 1.5rem;">
      <div style="display:inline-flex;height:3.5rem;width:3.5rem;align-items:center;justify-content:center;border-radius:1rem;background:rgba(179,158,101,0.20);color:var(--accent);margin-bottom:1.25rem">
        ${e.icon || ''}
      </div>
      <h2 class="h-display" style="font-size: 1.75rem;">${e.name}</h2>
    </div>
    <p style="font-family: var(--font-body); font-size: 0.95rem; line-height: 1.75; color: var(--muted); margin-bottom: 2rem;">
      ${e.desc}
    </p>
    <div style="display:flex; justify-content:center;">
       <button type="button" class="btn-primary" onclick="document.getElementById('expertiseModal').classList.remove('is-open'); document.body.style.overflow = '';">Close</button>
    </div>
  `;

  document.getElementById('closeExpertiseBtn').addEventListener('click', () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

function initExpertiseModalEvents() {
  const modal = document.getElementById('expertiseModal');
  const backdrop = document.getElementById('expertiseModalBackdrop');
  if (!modal || !backdrop) return;

  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}


/* ----- Boot ----- */
document.addEventListener('DOMContentLoaded', () => {
  const navHost = document.getElementById('navbar');
  if (navHost) navHost.innerHTML = renderNavbar();
  const footHost = document.getElementById('footer');
  if (footHost) footHost.innerHTML = renderFooter();

  initNavbar();
  initCycle();
  initShuffler();
  initScheduler();
  initReveal();
  initContactForm();
  // initLeaves(); // Leaf falling animation removed as per user request
  initCursorInteractions();
  initGlobeChroma();
  initReportModal();
  initPartnerModalEvents();
  initTrainingModalEvents();
  initExpertiseModalEvents();

  // Hero entrance choreography (mirrors the original GSAP timeline)
  const hero = document.querySelector('.hero');
  if (hero) {
    const reveal = (sel, delay, dy = 24) => {
      const el = hero.querySelector(sel);
      if (!el) return;
      el.style.opacity = 0;
      el.style.transform = `translateY(${dy}px)`;
      el.style.transition = 'opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';
      setTimeout(() => {
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, delay);
    };
    reveal('.hero-eyebrow', 200, 16);
    reveal('.hero-line-1', 350, 50);
    reveal('.hero-line-2', 550, 70);
    reveal('.hero-sub', 900, 20);
    reveal('.hero-cta', 1100, 24);
    reveal('.hero-quote', 1350, 24);
    reveal('.hero-scroll', 1650, 0);
  }

  // Smooth in-page anchor scroll with navbar offset
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});

/* ----- Falling leaves (right column of hero) ----- */
const LEAF_SHAPES = [
  // Almond / leaf-shape path centered on (12,12) in a 24x24 viewBox
  'M12 2 C17 5 20 10 18 17 C16 21 13 22 12 22 C11 22 8 21 6 17 C4 10 7 5 12 2 Z',
];
const LEAF_COLORS = [
  '#B39E65', // accent gold
  '#D6B27A', // lighter gold
  '#8E7B4A', // accent dark
  '#7BBDE8', // primary light
  '#0A4074', // primary
  '#A47E48', // warm brown
];

function initLeaves() {
  const layer = document.getElementById('leavesLayer');
  if (!layer) return;

  const COUNT = 22;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < COUNT; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';

    const size = 14 + Math.random() * 18;                 // 14–32 px
    const left = Math.random() * 100;                     // horizontal start %
    const dur = 9 + Math.random() * 9;                   // 9–18s
    const delay = -Math.random() * dur;                    // negative → pre-staggered
    const sway = (Math.random() * 50 + 15).toFixed(0);    // ±15–65px
    const rot0 = (Math.random() * 360).toFixed(0);
    const rotSpd = (180 + Math.random() * 360).toFixed(0);  // total spin across the fall
    const opacity = (0.55 + Math.random() * 0.35).toFixed(2);
    const color = LEAF_COLORS[(Math.random() * LEAF_COLORS.length) | 0];
    const flip = Math.random() < 0.5 ? 1 : -1;            // mirror half the leaves

    leaf.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      --sway: ${sway}px;
      --r0: ${rot0}deg;
      --rs: ${rotSpd}deg;
      --op: ${opacity};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;

    leaf.innerHTML = `
      <svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
           style="transform: scaleX(${flip})">
        <defs>
          <linearGradient id="lg-${i}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stop-color="${color}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.55"/>
          </linearGradient>
        </defs>
        <path d="${LEAF_SHAPES[0]}" fill="url(#lg-${i})" stroke="${color}" stroke-width="0.5" stroke-opacity="0.6"/>
        <path d="M12 4 L12 21" stroke="${color}" stroke-width="0.5" stroke-opacity="0.7"/>
      </svg>
    `;

    frag.appendChild(leaf);
  }
  layer.appendChild(frag);
}

/* ----- Cursor-aware card interactions ------------------------------------
   - cycle-card    : spotlight that follows the cursor
   - feature-card  : subtle 3D tilt
   - pillar-card   : tiny parallax shift
   - work-card img : parallax zoom driven by cursor (CSS reads --dx / --dy)
   - btn-primary   : magnetic pull toward the cursor (only on desktop)
   Uses rAF + a single document-level listener for efficiency.
--------------------------------------------------------------------------- */
function initCursorInteractions() {
  document.querySelectorAll('.cycle-card, .feature-card, .pillar-card, .work-img img, .hero-cta .btn-primary, .hero-cta .btn-secondary').forEach(el => {
    let rafId = null;
    let mode = '';
    if (el.classList.contains('cycle-card')) mode = 'spotlight';
    else if (el.classList.contains('feature-card')) mode = 'tilt';
    else if (el.classList.contains('pillar-card')) mode = 'parallax';
    else if (el.tagName.toLowerCase() === 'img') mode = 'work-img';
    else mode = 'magnetic';

    el.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = el.getBoundingClientRect();
        const mx = e.clientX;
        const my = e.clientY;
        const px = ((mx - rect.left) / rect.width) * 100;
        const py = ((my - rect.top) / rect.height) * 100;

        if (mode === 'spotlight') {
          el.style.setProperty('--mx', px + '%');
          el.style.setProperty('--my', py + '%');
        } else if (mode === 'tilt') {
          const rx = ((py - 50) / 50) * -4;   // -4deg .. +4deg
          const ry = ((px - 50) / 50) * 4;
          el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        } else if (mode === 'parallax') {
          const tx = ((px - 50) / 50) * 6;
          const ty = ((py - 50) / 50) * 6;
          el.style.transform = `translate(${tx}px, ${ty}px) translateY(-4px)`;
        } else if (mode === 'work-img') {
          const dx = ((50 - px) / 50) * 10;   // image slides opposite to cursor
          const dy = ((50 - py) / 50) * 10;
          el.style.setProperty('--ox', px + '%');
          el.style.setProperty('--oy', py + '%');
          el.style.setProperty('--dx', dx + 'px');
          el.style.setProperty('--dy', dy + 'px');
        } else if (mode === 'magnetic') {
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const pullX = (mx - cx) * 0.18;     // up to ~9px pull on a 100px-wide button
          const pullY = (my - cy) * 0.18;
          el.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.03) translateY(-1px)`;
        }
      });
    });

    el.addEventListener('mouseleave', () => {
      if (mode === 'tilt' || mode === 'parallax' || mode === 'magnetic') {
        el.style.transform = '';
      }
    });
  });
}
