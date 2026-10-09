const API = 'http://localhost:5000/api';
const FRONTEND = 'http://localhost:5173';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 STARTING COMPREHENSIVE END-TO-END FLOW TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: FRONTEND SERVER HEALTH & SEO METADATA
    // ----------------------------------------------------
    console.log('--- 1. Testing Frontend Server (Vite) ---');
    const feRes = await fetch(FRONTEND);
    assert(feRes.status === 200, 'Frontend server responds with HTTP 200');
    const feHtml = await feRes.text();
    assert(feHtml.includes('myKouch'), 'HTML contains myKouch brand');
    assert(feHtml.includes('Comfort That Feels Like Home'), 'HTML contains brand tagline');
    assert(feHtml.includes('Google Fonts'), 'HTML links Google Fonts Outfit / Playfair');

    // ----------------------------------------------------
    // TEST 2: BACKEND HEALTH CHECK
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Backend Server & MongoDB Connection ---');
    const healthRes = await fetch(`${API}/health`);
    const health = await healthRes.json();
    assert(health.status === 'online', 'Backend health check returns status online');
    assert(health.brand.includes('myKouch'), 'Health API confirms myKouch branding');

    // ----------------------------------------------------
    // TEST 3: CUSTOMER PRODUCT DISCOVERY & SOFA PURITY
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Product Discovery & Strict Sofa Purity ---');
    const prodRes = await fetch(`${API}/products`);
    const prodData = await prodRes.json();
    assert(prodData.success === true, 'Products API returns success');
    assert(prodData.count > 0, `Products found: ${prodData.count} sofas`);

    // Verify STRICTLY NO generic non-upholstered furniture
    const forbidden = ['dining table', 'study desk', 'wardrobe', 'shoe rack', 'tv unit'];
    const genericFurnitureFound = prodData.products.some(p => {
      const nameLower = p.name.toLowerCase();
      const catLower = p.category.toLowerCase();
      return forbidden.some(f => nameLower.includes(f) || catLower.includes(f));
    });
    assert(!genericFurnitureFound, 'Zero forbidden generic wooden furniture found — Pure sofa, mattress & cushion catalog');

    // Verify all categories are authentic myKouch pillars
    const validCategories = [
      'L-Shaped Sofas',
      '3 Seater Sofas',
      'Sofa Combos',
      'Recliner Sofas',
      '2 Seater Sofas',
      'Mattress & Beddings',
      'Pillow & Cushion',
    ];
    const allCategoriesValid = prodData.products.every(p => validCategories.includes(p.category));
    assert(allCategoriesValid, 'All products belong to authentic client categories (Sofas, Mattresses, Pillows)');

    // ----------------------------------------------------
    // TEST 4: TOP SELLING SOFAS & CAROUSEL DATA
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Top Selling Sofas ---');
    const topRes = await fetch(`${API}/products?isTopSelling=true`);
    const topData = await topRes.json();
    assert(topData.products.length > 0, `Top selling sofas found: ${topData.products.length}`);
    assert(topData.products[0].isTopSelling === true, 'Top selling flag verified');

    // ----------------------------------------------------
    // TEST 5: ACTIVE PROMOTIONAL OFFER
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Active Promotional Offer ---');
    const offerRes = await fetch(`${API}/offers/active`);
    const offerData = await offerRes.json();
    assert(offerData.success === true, 'Active offers API returns success');
    assert(offerData.offer !== null, `Active offer found: "${offerData.offer.title}"`);
    assert(offerData.offer.couponCode === 'COMFORT35', 'Coupon code verified: COMFORT35');
    assert(offerData.offer.discount && offerData.offer.discount.includes('OFF'), `Discount text verified: ${offerData.offer.discount}`);

    // ----------------------------------------------------
    // TEST 6: PRODUCT DETAIL & CRAFTSMANSHIP SPECS
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Product Details Page API ---');
    const sampleProduct = prodData.products.find(p => p.category.includes('Sofa')) || prodData.products[0];
    const detailRes = await fetch(`${API}/products/${sampleProduct._id}`);
    const detailData = await detailRes.json();
    assert(detailData.success === true, 'Product detail retrieved successfully');
    assert(detailData.product.specifications !== undefined, 'Sofa specifications object present');
    assert(
      detailData.product.specifications.frameMaterial.toLowerCase().includes('sal') ||
      detailData.product.specifications.frameMaterial.toLowerCase().includes('hardwood') ||
      detailData.product.specifications.frameMaterial.toLowerCase().includes('wood'),
      'Verified Treated Sal/Hardwood frame specification'
    );
    assert(
      detailData.product.specifications.warranty.includes('10 Years'),
      'Verified 10 Years Frame Warranty specification'
    );
    assert(Array.isArray(detailData.relatedProducts), 'Related sofas list returned');

    // ----------------------------------------------------
    // TEST 7: CUSTOM SOFA ENQUIRY SUBMISSION (CUSTOMER FLOW)
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Customer Custom Sofa Enquiry Flow ---');
    const customerEnquiryPayload = {
      customerName: 'Amitav Patnaik',
      phone: '+91 98530 55443',
      email: 'amitav.patnaik@gmail.com',
      product: 'myKouch Royal Emerald Velvet L-Shape Sectional',
      enquiryType: 'Customization',
      customizationDetails: {
        sofaType: 'L-Shaped Sofas',
        seatingPreference: '6 Seater Right Chaise',
        preferredSize: '112" x 70"',
        preferredColor: 'Royal Emerald Teal',
        fabricPreference: 'Royal Velvet (Water-Repellent)',
        roomDimensions: '16 ft x 14 ft living room',
        customRequirements: 'Need extra firm foam, champagne gold legs, and matching bolsters.',
      },
      message: 'Can I visit the Bhimatangi showroom to see the fabric swatches this weekend?',
    };

    const enqRes = await fetch(`${API}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerEnquiryPayload),
    });
    const enqData = await enqRes.json();
    assert(enqRes.status === 201, 'Customer enquiry submitted with HTTP 201 Created');
    assert(enqData.success === true, 'Enquiry submission acknowledged');
    assert(enqData.enquiryId !== undefined, `Enquiry ID generated: ${enqData.enquiryId}`);
    const createdEnquiryId = enqData.enquiryId;

    // ----------------------------------------------------
    // TEST 8: OWNER AUTHENTICATION & LOGIN
    // ----------------------------------------------------
    console.log('\n--- 8. Testing Owner Portal Authentication ---');
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@mykouch.in',
        password: 'MyKouch@2026',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Owner login successful with HTTP 200');
    assert(loginData.token !== undefined, 'Owner JWT token received');
    assert(loginData.owner.role === 'owner', 'Owner role verified');
    const ownerToken = loginData.token;

    // Test unauthorized access prevention
    const unauthRes = await fetch(`${API}/stats`);
    assert(unauthRes.status === 401, 'Unauthenticated request to owner stats is blocked with 401');

    // ----------------------------------------------------
    // TEST 9: OWNER DASHBOARD STATS
    // ----------------------------------------------------
    console.log('\n--- 9. Testing Owner Dashboard Stats ---');
    const statsRes = await fetch(`${API}/stats`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const statsData = await statsRes.json();
    assert(statsData.success === true, 'Owner stats retrieved successfully');
    assert(statsData.stats.totalProducts >= 14, `Total products: ${statsData.stats.totalProducts}`);
    assert(statsData.stats.totalEnquiries >= 1, `Total customer enquiries: ${statsData.stats.totalEnquiries}`);

    // ----------------------------------------------------
    // TEST 10: OWNER ADD NEW SOFA & VERIFY NEW ARRIVAL
    // ----------------------------------------------------
    console.log('\n--- 10. Testing Owner Adding New Sofa to New Arrivals ---');
    const newSofaPayload = {
      name: 'myKouch TEST Imperial Velvet Lounger',
      category: 'L-Shaped Sofas',
      description: 'Exclusive test sectional crafted for owner portal flow verification.',
      price: 64999,
      originalPrice: 89999,
      dimensions: '110" L x 70" W x 34" H',
      seatingCapacity: '6 Seater',
      badge: 'Brand New',
      images: ['/assets/sofas/drawing_room_1_2.jpg'],
      colors: ['Emerald Green', 'Royal Navy'],
      materials: ['Royal Velvet'],
      isNewArrival: true,
      isTopSelling: false,
      isActive: true,
    };

    const addProdRes = await fetch(`${API}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify(newSofaPayload),
    });
    const addProdData = await addProdRes.json();
    assert(addProdRes.status === 201, 'New sofa created with HTTP 201');
    assert(addProdData.product.isNewArrival === true, 'New sofa marked as isNewArrival: true');
    const createdProductId = addProdData.product._id;

    // Verify newly uploaded sofa appears on website New Arrivals query
    const newArrivalsRes = await fetch(`${API}/products?isNewArrival=true`);
    const newArrivalsData = await newArrivalsRes.json();
    const foundInNewArrivals = newArrivalsData.products.some(p => p._id === createdProductId);
    assert(foundInNewArrivals, 'New sofa automatically appears in New Arrivals on website!');

    // ----------------------------------------------------
    // TEST 11: OWNER EDIT & UPDATE PRODUCT
    // ----------------------------------------------------
    console.log('\n--- 11. Testing Owner Editing Sofa Details ---');
    const updateProdRes = await fetch(`${API}/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        price: 59999,
        badge: 'Special Edition',
      }),
    });
    const updateProdData = await updateProdRes.json();
    assert(updateProdData.product.price === 59999, 'Product price updated to 59,999');
    assert(updateProdData.product.badge === 'Special Edition', 'Product badge updated to Special Edition');

    // ----------------------------------------------------
    // TEST 12: OWNER OFFER MANAGEMENT FLOW
    // ----------------------------------------------------
    console.log('\n--- 12. Testing Owner Offer Creation & Lifecycle ---');
    const newOfferPayload = {
      title: 'Monsoon Comfort Carnival',
      subtitle: 'Exclusive Factory-Direct Sofa Discounts',
      description: 'Get extra 10% instant discount on all 3+1+1 living room suites.',
      discount: 'EXTRA 10% OFF',
      couponCode: 'MONSOON10',
      isActive: true,
    };
    const createOfferRes = await fetch(`${API}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify(newOfferPayload),
    });
    const createOfferData = await createOfferRes.json();
    assert(createOfferRes.status === 201, 'Owner successfully created new promotional offer');
    const createdOfferId = createOfferData.offer._id;

    // Verify offer appears in active offers
    const checkOfferRes = await fetch(`${API}/offers/active`);
    const checkOfferData = await checkOfferRes.json();
    assert(checkOfferData.offer.couponCode === 'MONSOON10', 'Newly created offer is immediately active on website');

    // Clean up test offer
    await fetch(`${API}/offers/${createdOfferId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    console.log('  Cleaned up test offer');

    // ----------------------------------------------------
    // TEST 13: OWNER ENQUIRIES VIEWING & STATUS UPDATE
    // ----------------------------------------------------
    console.log('\n--- 13. Testing Owner Enquiries Viewing & Workflow ---');
    const ownerEnqRes = await fetch(`${API}/enquiries`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const ownerEnqData = await ownerEnqRes.json();
    assert(ownerEnqData.success === true, 'Owner retrieved all enquiries');
    const targetEnquiry = ownerEnqData.enquiries.find(e => e._id === createdEnquiryId);
    assert(targetEnquiry !== undefined, `Found customer enquiry from "${targetEnquiry?.customerName}"`);
    assert(targetEnquiry.status === 'New', 'Initial enquiry status is "New"');

    // Update status to 'Contacted' with owner notes
    const updateEnqRes = await fetch(`${API}/enquiries/${createdEnquiryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        status: 'Contacted',
        ownerNotes: 'Called customer on WhatsApp, scheduled fabric demo at Bhimatangi showroom.',
      }),
    });
    const updateEnqData = await updateEnqRes.json();
    assert(updateEnqData.enquiry.status === 'Contacted', 'Enquiry status successfully updated to "Contacted"');
    assert(updateEnqData.enquiry.ownerNotes.includes('Bhimatangi'), 'Owner notes saved successfully');

    // ----------------------------------------------------
    // TEST 14: CLEANUP TEST PRODUCT
    // ----------------------------------------------------
    console.log('\n--- 14. Testing Product Cleanup ---');
    const delRes = await fetch(`${API}/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(delRes.status === 200, 'Test product deleted cleanly');

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log('\n====================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
