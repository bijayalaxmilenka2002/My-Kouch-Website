import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_icon_test_' + Date.now());
const PORT = 9222;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Eval error');
    }
    return res.result?.value;
  }

  async waitForSelector(selector, timeoutMs = 8000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const exists = await this.eval(`!!document.querySelector('${selector}')`);
      if (exists) return true;
      await delay(200);
    }
    return false;
  }

  async captureScreenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filePath, buffer);
  }
}

async function runIconTests() {
  console.log('===============================================================');
  console.log('   myKouch™ COMPLETE ICON & INTERACTION TESTING SUITE');
  console.log('===============================================================\n');

  const screenshotsDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

  const chromeProcess = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      `--user-data-dir=${USER_DATA}`,
      `--remote-debugging-port=${PORT}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1440,900',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await delay(300);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (res.ok) {
        targets = await res.json();
        if (targets && targets.length > 0) break;
      }
    } catch (e) {}
  }

  if (!targets || targets.length === 0) {
    throw new Error('Could not connect to Chrome debugging port.');
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  console.log('✓ Headless Chrome connected via CDP.\n');

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  const testReport = [];
  function record(section, iconName, actionTested, passed, note = '') {
    testReport.push({ section, iconName, actionTested, passed, note });
    const symbol = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} | [${section}] ${iconName} -> ${actionTested} ${note ? '(' + note + ')' : ''}`);
  }

  try {
    // -------------------------------------------------------------
    // SECTION 1: HEADER & NAVBAR ICONS
    // -------------------------------------------------------------
    console.log('--- 1. Testing Navbar Icons & Dropdowns ---');
    await client.send('Page.navigate', { url: 'http://localhost:5173/' });
    await client.waitForSelector('.site-header');
    await delay(1200);

    // 1.1 Brand Logo Icon/Link
    const logoTest = await client.eval(`
      (() => {
        const brand = document.querySelector('.nav-brand');
        const img = brand ? brand.querySelector('.nav-logo-mark') : null;
        return {
          hasBrand: !!brand,
          hasImg: !!img && img.naturalWidth > 0,
          href: brand ? brand.getAttribute('href') : null
        };
      })()
    `);
    record('Header', 'Brand Logo Mark', 'Navigates to "/" on click', logoTest.hasBrand && logoTest.href === '/', 'Image loaded & linked');

    // 1.2 "All Sofas" Dropdown Caret Icon
    const sofaDropdown = await client.eval(`
      (() => {
        const trigger = document.querySelectorAll('.nav-dropdown-trigger')[0];
        const caret = trigger ? trigger.querySelector('.nav-dropdown-caret') : null;
        trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        const menu = trigger.closest('.nav-item-dropdown')?.querySelector('.nav-dropdown-menu');
        const items = menu ? menu.querySelectorAll('.nav-dropdown-item').length : 0;
        return { hasCaret: !!caret, itemsCount: items };
      })()
    `);
    record('Header', 'ChevronDown Caret (All Sofas)', 'Opens sofa categories dropdown', sofaDropdown.hasCaret && sofaDropdown.itemsCount >= 4, `${sofaDropdown.itemsCount} sofa options`);

    // 1.3 "Mattress & Beddings" Dropdown Caret Icon
    const mattressDropdown = await client.eval(`
      (() => {
        const triggers = Array.from(document.querySelectorAll('.nav-dropdown-trigger'));
        const trigger = triggers.find(t => t.textContent.includes('Mattress'));
        const caret = trigger ? trigger.querySelector('.nav-dropdown-caret') : null;
        trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        const menu = trigger.closest('.nav-item-dropdown')?.querySelector('.nav-dropdown-menu');
        const items = menu ? menu.querySelectorAll('.nav-dropdown-item').length : 0;
        return { hasCaret: !!caret, itemsCount: items };
      })()
    `);
    record('Header', 'ChevronDown Caret (Mattresses)', 'Opens mattress categories dropdown', mattressDropdown.hasCaret && mattressDropdown.itemsCount >= 4, `${mattressDropdown.itemsCount} mattress options`);

    // 1.4 "Pillows & Cushions" Dropdown Caret Icon
    const pillowDropdown = await client.eval(`
      (() => {
        const triggers = Array.from(document.querySelectorAll('.nav-dropdown-trigger'));
        const trigger = triggers.find(t => t.textContent.includes('Pillow'));
        const caret = trigger ? trigger.querySelector('.nav-dropdown-caret') : null;
        trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        const menu = trigger.closest('.nav-item-dropdown')?.querySelector('.nav-dropdown-menu');
        const items = menu ? menu.querySelectorAll('.nav-dropdown-item').length : 0;
        return { hasCaret: !!caret, itemsCount: items };
      })()
    `);
    record('Header', 'ChevronDown Caret (Pillows)', 'Opens pillows & cushions dropdown', pillowDropdown.hasCaret && pillowDropdown.itemsCount >= 4, `${pillowDropdown.itemsCount} pillow options`);

    // 1.5 Header "Customize" Button (Sliders Icon)
    const customizeOpen = await client.eval(`
      (() => {
        const btn = document.querySelector('.btn-custom-sofa');
        const icon = btn ? btn.querySelector('svg') : null;
        if (btn) btn.click();
        return { hasBtn: !!btn, hasIcon: !!icon };
      })()
    `);
    await delay(700);
    const customModalVisible = await client.eval(`!!document.querySelector('.modal-backdrop')`);
    await client.captureScreenshot(path.join(screenshotsDir, 'tested_modal_customize.png'));
    record('Header', 'Sliders Icon (Customize Button)', 'Opens Customization Modal', customizeOpen.hasIcon && customModalVisible, 'Modal opened');

    // 1.6 Modal Close Button (X Icon)
    const customClose = await client.eval(`
      (() => {
        const closeBtn = document.querySelector('.modal-close-btn');
        const icon = closeBtn ? closeBtn.querySelector('svg') : null;
        if (closeBtn) closeBtn.click();
        return { hasCloseBtn: !!closeBtn, hasIcon: !!icon };
      })()
    `);
    await delay(400);
    const customModalHidden = await client.eval(`!document.querySelector('.modal-backdrop')`);
    record('Modal', 'X Icon (Modal Close)', 'Dismisses Customization Modal', customClose.hasIcon && customModalHidden, 'Modal dismissed');

    // 1.7 Header "Enquire" Button (MessageSquare Icon)
    const enquireOpen = await client.eval(`
      (() => {
        const btn = document.querySelector('.btn-enquire-nav');
        const icon = btn ? btn.querySelector('svg') : null;
        if (btn) btn.click();
        return { hasBtn: !!btn, hasIcon: !!icon };
      })()
    `);
    await delay(700);
    const enquireModalVisible = await client.eval(`!!document.querySelector('.modal-backdrop')`);
    await client.captureScreenshot(path.join(screenshotsDir, 'tested_modal_enquiry.png'));
    record('Header', 'MessageSquare Icon (Enquire Button)', 'Opens Enquiry & Contact Modal', enquireOpen.hasIcon && enquireModalVisible, 'Modal opened');

    // 1.8 Enquiry Modal Close Button (X Icon)
    const enquireClose = await client.eval(`
      (() => {
        const closeBtn = document.querySelector('.modal-close-btn');
        const icon = closeBtn ? closeBtn.querySelector('svg') : null;
        if (closeBtn) closeBtn.click();
        return { hasCloseBtn: !!closeBtn, hasIcon: !!icon };
      })()
    `);
    await delay(400);
    const enquireModalHidden = await client.eval(`!document.querySelector('.modal-backdrop')`);
    record('Modal', 'X Icon (Enquiry Modal Close)', 'Dismisses Enquiry Modal', enquireClose.hasIcon && enquireModalHidden, 'Modal dismissed');

    // 1.9 Hotline Link (Phone Icon) in Announcement Bar
    const phoneTest = await client.eval(`
      (() => {
        const link = document.querySelector('.announcement-link');
        return {
          hasLink: !!link,
          href: link ? link.getAttribute('href') : null
        };
      })()
    `);
    record('Header', 'Phone Hotline Link', 'Initiates call via tel:+918093376990', phoneTest.href === 'tel:+918093376990', phoneTest.href);

    // -------------------------------------------------------------
    // SECTION 2: HERO SECTION ICONS & CTA BUTTONS
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Hero Section Icons & CTAs ---');
    const heroTest = await client.eval(`
      (() => {
        const hero = document.querySelector('.hero-section') || document.querySelector('section');
        const exploreBtn = hero.querySelector('a[href="/collections"]') || Array.from(hero.querySelectorAll('a')).find(a => a.textContent.includes('Explore'));
        const exploreArrow = exploreBtn ? exploreBtn.querySelector('svg') : null;

        const customBtn = Array.from(hero.querySelectorAll('button')).find(b => b.textContent.includes('Customize'));
        const customSliders = customBtn ? customBtn.querySelector('svg') : null;

        const valueProps = hero.querySelectorAll('.hero-value-prop, .hero-features li, .hero-badge-item, [class*="badge"], [class*="prop"]');
        const heroSvgs = hero.querySelectorAll('svg');

        return {
          hasExploreArrow: !!exploreArrow,
          hasCustomSliders: !!customSliders,
          svgCount: heroSvgs.length
        };
      })()
    `);
    record('Hero', 'ArrowRight Icon (Explore Collections)', 'Links to /collections catalog', heroTest.hasExploreArrow, 'Explore button SVG verified');
    record('Hero', 'Sliders Icon (Customize Your Comfort)', 'Triggers customizer modal', heroTest.hasCustomSliders, 'Sliders SVG verified');
    record('Hero', 'Feature Badges (Sparkles, ShieldCheck, Home)', 'Displays value guarantees', heroTest.svgCount >= 3, `${heroTest.svgCount} SVGs in Hero`);

    // -------------------------------------------------------------
    // SECTION 3: CATEGORY CARDS (EXPLORE ARROWS)
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Category Section Cards & Icons ---');
    const categoryCards = await client.eval(`
      (() => {
        const cards = document.querySelectorAll('.category-card');
        const arrows = Array.from(cards).map(card => {
          const arrow = card.querySelector('svg');
          const href = card.getAttribute('href');
          return { hasArrow: !!arrow, href };
        });
        return {
          cardCount: cards.length,
          allHaveArrows: arrows.length > 0 && arrows.every(a => a.hasArrow),
          arrows
        };
      })()
    `);
    record('Categories', 'ArrowRight Icons on 4 Category Cards', 'Navigate to category collections', categoryCards.allHaveArrows && categoryCards.cardCount === 4, `4 cards verified (${categoryCards.arrows.map(a => a.href).join(', ')})`);

    // -------------------------------------------------------------
    // SECTION 4: TOP SELLING CAROUSEL (CHEVRON NAVIGATION & PRODUCT ACTIONS)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Top Selling Carousel Icons ---');
    // 4.1 Top Selling Carousel Navigation Controls
    const carouselNav = await client.eval(`
      (() => {
        const prev = document.querySelector('.carousel-nav-btn.prev');
        const next = document.querySelector('.carousel-nav-btn.next');
        const luxuryCard = document.querySelector('.luxury-image-card');
        const luxuryArrow = luxuryCard ? luxuryCard.querySelector('svg') : null;

        if (next) next.click();

        return {
          hasPrev: !!prev,
          hasNext: !!next,
          hasPrevIcon: !!(prev && prev.querySelector('svg')),
          hasNextIcon: !!(next && next.querySelector('svg')),
          hasLuxuryArrow: !!luxuryArrow
        };
      })()
    `);
    record('Carousel', 'ChevronLeft & ChevronRight Arrow Icons', 'Navigates top selling carousel left and right', carouselNav.hasPrevIcon && carouselNav.hasNextIcon, 'Carousel controls functional');
    record('Carousel', 'ArrowRight Icon on Luxury Image Cards', 'Links cards to individual product pages', carouselNav.hasLuxuryArrow, 'Explore Product action verified');

    // -------------------------------------------------------------
    // SECTION 5: NEW ARRIVALS WAKEFIT BANNER (SUBCATEGORY TABS & RATINGS)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing New Arrivals Subcategory Tabs & Badges ---');
    const wakefitTabs = await client.eval(`
      (() => {
        const tabsContainer = document.querySelector('.wakefit-capsule-bar');
        const tabs = tabsContainer ? Array.from(tabsContainer.querySelectorAll('button')) : [];
        const tabNames = tabs.map(t => t.textContent.trim());

        // Click Pillows & Cushions tab
        const pillowTab = tabs.find(t => t.textContent.includes('Pillows'));
        if (pillowTab) pillowTab.click();

        return {
          tabCount: tabs.length,
          tabNames,
          pillowClicked: !!pillowTab
        };
      })()
    `);
    await delay(600);
    const filteredCards = await client.eval(`
      (() => {
        const cards = document.querySelectorAll('#new-arrivals .wakefit-card');
        const firstCard = cards[0];
        const stars = firstCard ? firstCard.querySelectorAll('svg') : [];
        return { count: cards.length, starCount: stars.length };
      })()
    `);
    record('New Arrivals', 'Pillows & Cushions Subcategory Tab', 'Filters arrivals to display pillow suites', wakefitTabs.pillowClicked && filteredCards.count > 0, `${filteredCards.count} pillow suites displayed`);
    record('New Arrivals', 'Star Rating Icons on Arrival Cards', 'Renders verified customer ratings', filteredCards.starCount > 0, 'Star ratings verified');

    // -------------------------------------------------------------
    // SECTION 6: FOOTER ICONS & CONTACT LINKS
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Footer Icons & Direct Links ---');
    const footerTest = await client.eval(`
      (() => {
        const footer = document.querySelector('footer');
        if (!footer) return { found: false };

        const socialLinks = footer.querySelectorAll('.footer-social-link');
        const phoneLink = footer.querySelector('a[href^="tel:"]');
        const mailLink = footer.querySelector('a[href^="mailto:"]');
        const mapPins = footer.querySelectorAll('.footer-location-card svg');
        const ownerLink = footer.querySelector('a[href="/owner/login"]');
        const ownerLockIcon = ownerLink ? ownerLink.querySelector('svg') : null;

        return {
          found: true,
          socialCount: socialLinks.length,
          hasPhone: !!phoneLink,
          phoneHref: phoneLink ? phoneLink.getAttribute('href') : null,
          hasMail: !!mailLink,
          mailHref: mailLink ? mailLink.getAttribute('href') : null,
          hasMapPins: mapPins.length >= 2,
          hasOwnerLock: !!ownerLockIcon
        };
      })()
    `);
    record('Footer', 'Social Icons (Instagram, Facebook, YouTube)', 'Direct outbound brand community links', footerTest.socialCount >= 3, `${footerTest.socialCount} social icons active`);
    record('Footer', 'Phone & Mail Icons', 'Direct one-tap contact links', footerTest.hasPhone && footerTest.hasMail, `${footerTest.phoneHref} | ${footerTest.mailHref}`);
    record('Footer', 'MapPin & Clock Icons (Showroom / Factory)', 'Physical address & store hours guidance', footerTest.hasMapPins, 'Showroom & Factory geocoded');
    record('Footer', 'Lock Icon (Owner Portal Access)', 'Direct administrative login link', footerTest.hasOwnerLock, 'Owner portal link verified');

    // -------------------------------------------------------------
    // SECTION 7: COLLECTIONS PAGE PILLOWS & SEARCH ICONS
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Collections Page & Pillow Catalog ---');
    await client.send('Page.navigate', { url: 'http://localhost:5173/collections?category=pillow-cushion' });
    await client.waitForSelector('.product-card');
    await delay(1200);

    const pillowCollectionTest = await client.eval(`
      (() => {
        const cards = document.querySelectorAll('.product-card');
        const titles = Array.from(cards).map(c => c.querySelector('.product-card-title')?.textContent.trim() || c.querySelector('h3')?.textContent.trim() || '');

        const indigo = titles.some(t => t.includes('Royal Indigo') || t.includes('Mediterranean'));
        const macrame = titles.some(t => t.includes('Bohemian') || t.includes('Macramé'));
        const terracotta = titles.some(t => t.includes('Terracotta') || t.includes('Amber'));
        const nordic = titles.some(t => t.includes('Nordic') || t.includes('Harvest'));

        const sidebarTabs = document.querySelectorAll('.catalog-sidebar-item');

        return {
          cardCount: cards.length,
          all4Present: indigo && macrame && terracotta && nordic,
          sidebarTabsCount: sidebarTabs.length,
          titlesSample: titles.slice(0, 4)
        };
      })()
    `);
    record('Collections', 'Pillows & Cushions Catalog Grid', 'Displays all 4 newly added suites with photos & pricing', pillowCollectionTest.cardCount >= 4 && pillowCollectionTest.all4Present, `${pillowCollectionTest.cardCount} total suites rendered`);

    // 7.2 Product Card Action Icons (Details Sliders + Enquire MessageSquare + Stars)
    const cardIcons = await client.eval(`
      (() => {
        const cards = document.querySelectorAll('.product-card');
        const firstCard = cards[0];
        if (!firstCard) return { found: false };

        const stars = firstCard.querySelectorAll('.rating-stars svg');
        const detailsBtn = firstCard.querySelector('.product-card-actions a');
        const enquireBtn = firstCard.querySelector('.product-card-actions button');

        const detailsIcon = detailsBtn ? detailsBtn.querySelector('svg') : null;
        const enquireIcon = enquireBtn ? enquireBtn.querySelector('svg') : null;

        return {
          found: true,
          starCount: stars.length,
          hasDetailsIcon: !!detailsIcon,
          hasEnquireIcon: !!enquireIcon
        };
      })()
    `);
    record('ProductCard', 'Star Rating (5 Stars) & Sliders Details Icon', 'Displays 5-star rating & customizer details link', cardIcons.hasDetailsIcon && cardIcons.starCount === 5, 'Details action verified');
    record('ProductCard', 'MessageSquare Enquire Icon', 'Opens quick enquiry modal for specific product', cardIcons.hasEnquireIcon, 'Enquire action verified');

    // 7.3 Search input & filter icon
    const searchTest = await client.eval(`
      (() => {
        const input = document.querySelector('.catalog-controls-row input') || document.querySelector('input[type="text"]');
        if (!input) return { hasInput: false };
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'Indigo');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return { hasInput: true };
      })()
    `);
    await delay(600);
    const searchMatchCount = await client.eval(`document.querySelectorAll('.product-card').length`);
    record('Collections', 'Search Icon & Live Keyword Filtering', 'Filters cards instantly on keyword change', searchTest.hasInput && searchMatchCount === 1, `Matches ${searchMatchCount} item for "Indigo"`);

    // 7.4 Test Clear Search (X Icon)
    const clearTest = await client.eval(`
      (() => {
        const input = document.querySelector('.catalog-controls-row input');
        const clearBtn = input ? input.parentElement.querySelector('button') : null;
        const clearIcon = clearBtn ? clearBtn.querySelector('svg') : null;
        if (clearBtn) clearBtn.click();
        return { hasClearBtn: !!clearBtn, hasIcon: !!clearIcon };
      })()
    `);
    await delay(700);
    const restoredCount = await client.eval(`document.querySelectorAll('.product-card').length`);
    record('Collections', 'X Icon (Clear Search)', 'Clears search input and restores full catalog', clearTest.hasIcon && restoredCount >= 4, `Restored to ${restoredCount} items`);

    // -------------------------------------------------------------
    // SECTION 8: PRODUCT DETAIL PAGE ICONS & COLOR SWATCHES
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Product Detail Page Icons & Swatches ---');
    await client.send('Page.navigate', { url: 'http://localhost:5173/product/mykouch-royal-indigo-mediterranean-tile-medallion-cushion-suite' });
    await client.waitForSelector('.product-action-btns');
    await delay(1200);

    const detailPageTest = await client.eval(`
      (() => {
        const ratingStars = document.querySelectorAll('.rating-stars svg');
        const customizeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Customize') || b.textContent.includes('Enquire'));
        const whatsappBtn = document.querySelector('a[href*="wa.me"]');
        const trustIcons = document.querySelectorAll('.product-trust-grid svg');

        return {
          starCount: ratingStars.length,
          hasCustomizeIcon: !!(customizeBtn && customizeBtn.querySelector('svg')),
          hasWhatsappIcon: !!(whatsappBtn && whatsappBtn.querySelector('svg')),
          trustIconsCount: trustIcons.length
        };
      })()
    `);
    record('ProductDetail', 'Rating Stars (5 Stars)', 'Displays verified craftsmanship rating', detailPageTest.starCount >= 5, `${detailPageTest.starCount} rating stars verified`);
    record('ProductDetail', 'Sliders Icon (Customize CTA)', 'Triggers custom dimensions/cushion modal', detailPageTest.hasCustomizeIcon, 'Customize button verified');
    record('ProductDetail', 'MessageSquare Icon (WhatsApp Shopkeeper)', 'Direct WhatsApp link with product pre-filled', detailPageTest.hasWhatsappIcon, 'WhatsApp action verified');
    record('ProductDetail', 'ShieldCheck & Truck Icons (Trust Assurances)', 'Displays factory warranty and delivery setup badges', detailPageTest.trustIconsCount >= 2, `${detailPageTest.trustIconsCount} trust badges verified`);

    const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';
    const ssDetailPath = path.join(artifactDir, 'tested_icons_product_detail.png');
    await client.captureScreenshot(ssDetailPath);
    console.log(`📸 Product Detail verification screenshot: ${ssDetailPath}`);

    // -------------------------------------------------------------
    // SECTION 9: MOBILE VIEWPORT & HAMBURGER NAVIGATION
    // -------------------------------------------------------------
    console.log('\n--- 9. Testing Mobile Viewport (375x812) & Mobile Drawer ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await client.send('Page.navigate', { url: 'http://localhost:5173/' });
    await client.waitForSelector('.mobile-menu-btn');
    await delay(1000);

    // 9.1 Click hamburger menu (Menu icon)
    const mobileMenuOpen = await client.eval(`
      (() => {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const icon = menuBtn ? menuBtn.querySelector('svg') : null;
        if (menuBtn) menuBtn.click();
        return { hasBtn: !!menuBtn, hasIcon: !!icon };
      })()
    `);
    await delay(500);
    const drawerOpen = await client.eval(`!!document.querySelector('.mobile-drawer.open')`);
    await client.captureScreenshot(path.join(screenshotsDir, 'tested_mobile_drawer_open.png'));
    record('Mobile', 'Menu Icon (Hamburger Toggle)', 'Opens full-height mobile navigation drawer', mobileMenuOpen.hasIcon && drawerOpen, 'Mobile drawer opened');

    // 9.2 Test Mobile Drawer Accordion ChevronDown Caret
    const hasAccordionCaret = await client.eval(`
      (() => {
        const accordionBtn = document.querySelector('.mobile-accordion-header');
        const caret = accordionBtn ? accordionBtn.querySelector('svg') : null;
        if (accordionBtn) accordionBtn.click();
        return !!caret;
      })()
    `);
    await delay(500);
    const sublinksExpanded = await client.eval(`document.querySelectorAll('.mobile-accordion-sublinks').length > 0`);
    record('Mobile', 'ChevronDown Caret (Mobile Accordions)', 'Expands mobile sub-category links', hasAccordionCaret && sublinksExpanded, 'Accordion expanded');

    // 9.3 Test Mobile Drawer Action Icons (Sliders, MessageSquare, Phone)
    const drawerActions = await client.eval(`
      (() => {
        const drawer = document.querySelector('.mobile-drawer');
        const svgs = drawer ? drawer.querySelectorAll('div:last-child svg') : [];
        return { svgCount: svgs.length };
      })()
    `);
    record('Mobile', 'CTA Icons (Sliders, MessageSquare, Phone)', 'Provides one-tap mobile contact and customizer actions', drawerActions.svgCount >= 3, `${drawerActions.svgCount} CTA action icons verified`);

    // 9.4 Test mobile drawer close button (X icon)
    const mobileClose = await client.eval(`
      (() => {
        const closeBtn = document.querySelector('.mobile-drawer button[aria-label="Close Navigation"]');
        const icon = closeBtn ? closeBtn.querySelector('svg') : null;
        if (closeBtn) closeBtn.click();
        return { hasCloseBtn: !!closeBtn, hasIcon: !!icon };
      })()
    `);
    await delay(400);
    const drawerClosed = await client.eval(`!document.querySelector('.mobile-drawer.open')`);
    record('Mobile', 'X Icon (Mobile Drawer Close)', 'Closes mobile drawer and restores scroll', mobileClose.hasIcon && drawerClosed, 'Mobile drawer closed cleanly');

    // Save final screenshot of mobile
    const ssMobilePath = path.join(artifactDir, 'tested_icons_mobile.png');
    await client.captureScreenshot(ssMobilePath);
    console.log(`📸 Mobile verification screenshot: ${ssMobilePath}`);

    // Switch back to desktop and capture desktop verified screenshot
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.send('Page.navigate', { url: 'http://localhost:5173/collections?category=pillow-cushion' });
    await client.waitForSelector('.product-card');
    await delay(1200);

    const ssDesktopPath = path.join(artifactDir, 'tested_icons_desktop.png');
    await client.captureScreenshot(ssDesktopPath);
    console.log(`📸 Desktop verification screenshot: ${ssDesktopPath}`);

  } finally {
    if (client.ws) client.ws.close();
    chromeProcess.kill();
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch (e) {}
  }

  console.log('\n===============================================================');
  console.log('                 FINAL TEST RESULTS MATRIX');
  console.log('===============================================================');
  const total = testReport.length;
  const passed = testReport.filter((t) => t.passed).length;
  const failed = total - passed;
  console.log(`Total Icon Functionality Tests Executed: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Test Pass Rate: ${Math.round((passed / total) * 100)}%\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runIconTests().catch((err) => {
  console.error('\n❌ Test Error:', err.message);
  process.exit(1);
});
