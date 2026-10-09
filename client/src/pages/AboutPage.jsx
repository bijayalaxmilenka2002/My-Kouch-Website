import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  CheckCircle2,
  MapPin,
  Sliders,
  Phone,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Ruler,
  Feather,
  Check,
  MessageSquare,
  Armchair,
  Bed,
} from 'lucide-react';
import { useSofa } from '../context/SofaContext';
import SEO from '../components/SEO';

export default function AboutPage() {
  const { openCustomizeModal, openEnquiryModal } = useSofa();

  return (
    <div style={{ background: '#FAF8F5', padding: '2.5rem 0 6rem' }}>
      <SEO
        title="About Us • Authentic Craftsmanship & Factory Direct Heritage | myKouch Bhubaneswar"
        description="Discover the craftsmanship heritage of myKouch by MB Marketing in Bhubaneswar. Learn how we engineer bespoke luxury sofas, orthopedic sleep systems, and designer cushions directly at our workshop with seasoned Sal wood and 40D HR foam."
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link> &gt;{' '}
          <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>About Us</span>
        </div>

        {/* 1. Hero Header */}
        <div className="about-hero-header reveal-on-scroll">
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>MB Marketing • Direct Factory Craftsmanship</span>
          </div>
          <h1 className="about-hero-title">
            Handcrafting Comfort. <br />
            <span style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>Shaping Modern Living.</span>
          </h1>
          <p className="about-hero-subtitle">
            Founded in Bhubaneswar under MB Marketing, <strong>myKouch</strong> was born to eliminate middlemen markups and mass-market compromises. We craft bespoke luxury sofas, orthopedic sleep systems, and plush designer bedding directly for your home.
          </p>
        </div>

        {/* 2. Direct Factory Heritage & Brand Philosophy Card */}
        <div className="brand-philosophy-card reveal-on-scroll">
          <div className="brand-philosophy-header">
            <span className="brand-philosophy-tag">
              <Sparkles size={14} />
              <span>CRAFTSMANSHIP PHILOSOPHY &amp; WORKSHOP HERITAGE</span>
            </span>
            <h2 className="brand-philosophy-title">
              Authentic Craftsmanship. Honest Direct Factory Pricing.
            </h2>
          </div>

          <div className="brand-philosophy-quote">
            &ldquo;For decades, furniture buyers in Odisha had two poor choices: paying exorbitant 50% retail markups at brand showrooms, or settling for flimsy particleboard furniture that sags within two years. myKouch was built to offer a third, honest choice: authentic heirloom-grade hardwood furniture, orthopedic sleep systems, and designer cushions handcrafted directly inside our Bhubaneswar workshop.&rdquo;
          </div>

          <p className="brand-philosophy-text">
            At our Sunderipada workshop, every Sal wood log is hand-inspected, every pocketed spring is zero-motion tested, and every fabric seam is double-piped by master artisans who treat comfort as an enduring art. When you bring myKouch into your home, you aren&apos;t just buying furniture — you are investing in comfort engineered to last a decade.
          </p>

          <div className="brand-philosophy-stats">
            <div className="philosophy-stat-box">
              <strong>100%</strong>
              <span>Direct In-House Factory</span>
            </div>
            <div className="philosophy-stat-box">
              <strong>10 Years</strong>
              <span>Structural Frame Warranty</span>
            </div>
            <div className="philosophy-stat-box">
              <strong>1,200+</strong>
              <span>Happy Homes in Odisha</span>
            </div>
            <div className="philosophy-stat-box">
              <strong>100+</strong>
              <span>Custom Fabric &amp; Foam Options</span>
            </div>
          </div>
        </div>

        {/* 3. In-Depth Product Engineering & Science (Details About Products) */}
        <div className="about-product-showcase">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="section-tag" style={{ margin: '0 auto 0.75rem' }}>
              <Layers size={14} />
              <span>Complete Product Science</span>
            </span>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)', marginBottom: '0.75rem' }}>
              Crafted With Care. Engineered To Last.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Here is what goes inside every product category we manufacture at our Sunderipada factory and display at our Bhimatangi showroom.
            </p>
          </div>

          {/* Product Category 1: Luxury Sofas & Recliners */}
          <div className="about-product-card reveal-on-scroll">
            <div className="about-product-img-box">
              <img
                src="/assets/sofas/corduroy_luxe_sofa.jpg"
                alt="myKouch handcrafted luxury sofa frame"
              />
              <div className="about-product-badge-float">
                <Armchair size={14} />
                <span>Living Room Pillar</span>
              </div>
            </div>
            <div className="about-product-body">
              <span className="category-tag">Bespoke Living Seating</span>
              <h3>1. Luxury Sofas, Sectionals &amp; Recliners</h3>
              <p>
                From expansive L-shaped corner loungers and stately 3+1+1 living suites to whisper-quiet motorized recliners, each sofa is custom-tailored to your room dimensions and preferred seating depth.
              </p>

              <div className="about-specs-list">
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Seasoned Sal &amp; Marandi Hardwood Frame:</strong> Kiln-dried, chemically borer-proofed timber with interlocking mortise-and-tenon joints engineered to resist climate warping.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>40-Density HR Supersoft Foam:</strong> High-resilience virgin foam layered with memory cushioning that adapts to your posture and prevents premature sagging.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Carbon Steel S-Spring Suspension:</strong> Heat-treated zig-zag steel springs paired with 3&rdquo; high-tensile poly-webbing for optimal weight distribution.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>100+ Designer Fabric Choices:</strong> Water-repellent royal velvets, tactile Italian bouclés, wide-wale corduroys, and breathable performance leatherettes.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/collections?category=All%20Sofas" className="btn btn-primary btn-sm">
                  <span>Explore Sofa Collections</span>
                  <ArrowRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => openCustomizeModal()}
                  className="btn btn-outline btn-sm"
                >
                  <Sliders size={14} />
                  <span>Custom Measurements</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Category 2: Orthopedic Mattresses & Sleep Systems */}
          <div className="about-product-card reverse reveal-on-scroll">
            <div className="about-product-body">
              <span className="category-tag">Restorative Sleep Science</span>
              <h3>2. Orthopedic &amp; Pocket Spring Mattresses</h3>
              <p>
                Engineered in collaboration with ergonomic principles to deliver pressure-free, spine-aligning sleep. Available in standard King, Queen, and custom master-bedroom dimensions.
              </p>

              <div className="about-specs-list">
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Dual-Zone Orthopedic Lumbar Alignment:</strong> Medium-firm orthopedic base layer providing scientific spine support with a buoyant pressure-relieving cloud top.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Zero-Motion Pocketed Coil Core:</strong> Individually heat-treated carbon springs encased in non-woven pockets that eliminate disturbance from a restless partner.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Cool-Gel Breathable Memory Foam:</strong> Infused with temperature-regulating micro-gel clusters that dissipate excess body heat during humid Indian nights.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Hand-Tufted Euro-Top Quilting:</strong> Deep rosette button tufting locking all layers permanently, enclosed in organic bamboo jacquard ticking.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/collections?category=mattress-beddings" className="btn btn-primary btn-sm">
                  <span>Explore Mattresses &amp; Beddings</span>
                  <ArrowRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiryModal({ name: 'Custom Mattress Sizing', category: 'Mattress & Beddings' })}
                  className="btn btn-outline btn-sm"
                >
                  <MessageSquare size={14} />
                  <span>Inquire Sizing</span>
                </button>
              </div>
            </div>

            <div className="about-product-img-box">
              <img
                src="/assets/mattresses/pocket_spring_cross_section.jpg"
                alt="myKouch pocket spring hybrid mattress 3D architectural cross-section"
              />
              <div className="about-product-badge-float">
                <Bed size={14} />
                <span>Triple-Layer Sleep Architecture</span>
              </div>
            </div>
          </div>

          {/* Product Category 3: Pillows, Cushions & Bedding Accents */}
          <div className="about-product-card reveal-on-scroll">
            <div className="about-product-img-box">
              <img
                src="/assets/pillows/emerald_sofa_cushions_lifestyle.jpg"
                alt="myKouch designer decorative cushions on emerald luxury sofa"
              />
              <div className="about-product-badge-float">
                <Feather size={14} />
                <span>Plush Accents Pillar</span>
              </div>
            </div>
            <div className="about-product-body">
              <span className="category-tag">Artisanal Living Accents</span>
              <h3>3. Designer Pillows, Cushions &amp; Bedding Suites</h3>
              <p>
                From living room decorative cushion ensembles to therapeutic cervical contour neck pillows and hotel presidential-suite bedding sets, every piece elevates everyday home comfort.
              </p>

              <div className="about-specs-list">
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Virgin Siliconized Micro-Down Loft (650 GSM):</strong> Down-alternative clusters that retain cloud-like plumpness and spring back instantly without clumping.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Designer Living Room Sets:</strong> Tailored in botanical woven jacquard, heavy chevron knit, and curly bouclé fleece with concealed brass YKK zippers.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Ergonomic Cervical Contour Neck Pillows:</strong> 50-density therapeutic memory foam designed to relieve neck strain, cervical compression, and stiffness.
                  </div>
                </div>
                <div className="about-spec-row">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Hotel Presidential-Suite Duvet &amp; Bedding:</strong> 400 to 600 thread-count Egyptian cotton satin-stripe pillow pairs and luxury duvet suites.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/collections?category=pillow-cushion" className="btn btn-primary btn-sm">
                  <span>Explore Pillows &amp; Cushions</span>
                  <ArrowRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiryModal({ name: 'Custom Cushion Fabrics', category: 'Pillow & Cushion' })}
                  className="btn btn-outline btn-sm"
                >
                  <MessageSquare size={14} />
                  <span>Fabric Samples</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. The Honest Difference: Factory Direct vs. Traditional Showrooms */}
        <div className="about-compare-section reveal-on-scroll">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.5rem' }}>
            <span className="section-tag" style={{ margin: '0 auto 0.75rem' }}>
              <ShieldCheck size={14} />
              <span>Transparent Comparison</span>
            </span>
            <h3 style={{ fontSize: '2.1rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)' }}>
              Why myKouch Stands Apart
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              See how our direct factory craftsmanship compares with conventional furniture retail.
            </p>
          </div>

          <table className="about-compare-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Quality Standard</th>
                <th className="mykouch-col" style={{ width: '36%' }}>myKouch Factory Direct</th>
                <th style={{ width: '36%', color: 'var(--text-muted)' }}>Traditional Furniture Stores</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Frame Wood</strong></td>
                <td className="mykouch-col">Seasoned solid Sal &amp; Marandi logs (termite treated)</td>
                <td>Cheap MDF, composite plywood, or unseasoned pine</td>
              </tr>
              <tr>
                <td><strong>Foam Quality</strong></td>
                <td className="mykouch-col">40-Density High Resilience (HR) + Memory Foam</td>
                <td>24-28 Density low-grade foam that sags in 1-2 years</td>
              </tr>
              <tr>
                <td><strong>Pricing Structure</strong></td>
                <td className="mykouch-col">100% Transparent direct factory pricing</td>
                <td>40% to 60% distributor markups and retail commissions</td>
              </tr>
              <tr>
                <td><strong>Customization</strong></td>
                <td className="mykouch-col">Custom inch-by-inch dimensions &amp; 100+ fabrics</td>
                <td>Rigid standard sizes; take it or leave it</td>
              </tr>
              <tr>
                <td><strong>Warranty Protection</strong></td>
                <td className="mykouch-col">10-Year Direct Factory Structural &amp; Sag Warranty</td>
                <td>1-Year limited warranty with third-party hassle</td>
              </tr>
              <tr>
                <td><strong>Delivery &amp; Setup</strong></td>
                <td className="mykouch-col">White-glove delivery by in-house factory artisans</td>
                <td>Third-party courier with DIY unboxing and assembly</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Factory & Showroom Locations in Bhubaneswar */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="section-tag" style={{ margin: '0 auto 0.75rem' }}>
              <MapPin size={14} />
              <span>Visit Us In Bhubaneswar</span>
            </span>
            <h3 style={{ fontSize: '2.1rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)' }}>
              Our Showroom &amp; Manufacturing Factory
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Experience fabrics, test sofa ergonomics, and watch live craftsmanship in person.
            </p>
          </div>

          <div className="about-addresses-grid">
            {/* Showroom Box */}
            <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                <MapPin size={22} />
                <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Experience Showroom</span>
              </div>
              <h4 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)', marginBottom: '0.75rem' }}>
                MB Marketing Showroom
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                AM42, Bhimatangi, Near Mo Bus Stop,<br />
                Bhubaneswar, Odisha - Pin 751002
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <Clock size={16} />
                <span>Open Everyday: 10:00 AM – 9:00 PM</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a href="tel:+918093376990" className="btn btn-primary btn-sm">
                  <Phone size={14} />
                  <span>Call +91 80933 76990</span>
                </a>
                <Link to="/contact" className="btn btn-outline btn-sm">
                  <span>Showroom Map &amp; Directions</span>
                </Link>
              </div>
            </div>

            {/* Manufacturing Factory Box */}
            <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                <MapPin size={22} />
                <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Manufacturing Workshop</span>
              </div>
              <h4 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)', marginBottom: '0.75rem' }}>
                MB Marketing Factory
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Jagannath Bihar, Plot No- 401, Sunderipada,<br />
                Near Champati Petrol Pump, Bhubaneswar, Dist. Khordha - Pin 751002
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <Clock size={16} />
                <span>Production Hours: 9:00 AM – 7:30 PM (Mon – Sat)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => openCustomizeModal()}
                  className="btn btn-primary btn-sm"
                >
                  <Sliders size={14} />
                  <span>Request Custom Build</span>
                </button>
                <a
                  href="https://wa.me/918093376990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp Workshop</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Bottom Call to Action Strip */}
        <div style={{ background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)', borderRadius: 'var(--radius-xl)', padding: '3.5rem 2.5rem', textAlign: 'center', color: '#FFFFFF', boxShadow: 'var(--shadow-xl)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>Start Your Home Comfort Journey</span>
          </span>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem', color: '#FFFFFF' }}>
            Ready to Build Your Dream Setup?
          </h2>
          <p style={{ maxWidth: '620px', margin: '0 auto 2rem', color: '#D6D3D1', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Whether you need custom measurements for a sectional sofa, a doctor-recommended orthopedic mattress, or plush accent cushions, our master craftsmen are ready to craft it for you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => openCustomizeModal()}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem' }}
            >
              <Sliders size={16} />
              <span>Customize Your Comfort</span>
            </button>
            <Link
              to="/collections"
              className="btn btn-outline"
              style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', padding: '0.85rem 1.75rem' }}
            >
              <span>Browse All Collections</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
