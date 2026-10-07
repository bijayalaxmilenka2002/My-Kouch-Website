import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, MapPin, Sliders, Phone } from 'lucide-react';
import { useSofa } from '../context/SofaContext';
import SEO from '../components/SEO';

export default function AboutPage() {
  const { openCustomizeModal } = useSofa();

  return (
    <div style={{ background: '#FAF8F5', padding: '3rem 0 6rem' }}>
      <SEO
        title="About Us • Factory Craftsmanship in Bhubaneswar"
        description="Learn how myKouch crafts bespoke luxury sofas from scratch in Sunderipada, Bhubaneswar. Seasoned Sal wood frames, 40D HR foam, and factory-direct pricing with zero middlemen."
      />
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ maxWidth: '800px', marginBottom: '4rem' }}>
          <span className="section-tag">
            <span>MB Maaarketing • Est. Bhubaneswar</span>
          </span>
          <h1 className="section-title" style={{ fontSize: '3rem' }}>
            Crafting Comfort. Designing Lifestyle.
          </h1>
          <p className="section-subtitle">
            At <strong>myKouch</strong>, we believe every home deserves a sofa that doesn't just look stunning on day one, but remains deeply comfortable for a decade.
          </p>
        </div>

        {/* Feature Grid: Showroom & Factory */}
        <div className="about-feature-grid">
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)' }}>
            <img
              src="/assets/sofas/drawing_room_1_16.jpg"
              alt="myKouch Bhubaneswar sofa craftsmanship"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </div>

          <div>
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Direct From The Workshop
            </span>
            <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)', margin: '0.5rem 0 1.25rem', lineHeight: 1.25 }}>
              The myKouch Philosophy
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Mass-market furniture stores often use thin plywood and low-grade foam that sags within two years. We do things differently. Every single sofa bearing the <strong>myKouch</strong> emblem is crafted at our dedicated factory in Sunderipada, Bhubaneswar.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              We begin with seasoned, anti-borer treated solid Sal and Marandi wood for the internal chassis. We reinforce stress corners with interlocking joints and heavy-gauge carbon steel springs. Then, we apply 40-density high-resilience foam wrapped in your choice of breathable leatherette, royal velvet, or heavy bouclé.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-espresso)', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" />
                <span>10-Year Structural Frame Warranty on all sofas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-espresso)', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" />
                <span>Custom room measurements &amp; at-home fabric samples</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-espresso)', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" />
                <span>Direct factory pricing with zero distributor commission</span>
              </div>
            </div>

            <button onClick={() => openCustomizeModal()} className="btn btn-primary">
              <Sliders size={18} />
              <span>Discuss Your Custom Sofa</span>
            </button>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div style={{ background: '#FFFFFF', padding: '3.5rem 2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h3 style={{ fontSize: '1.85rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso)', marginBottom: '0.5rem' }}>
              Our Three Guiding Pillars
            </h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Identified directly from our founding company values at MB Maaarketing.
            </p>
          </div>

          <div className="about-pillars-grid">
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--color-espresso)' }}>
                Premium Quality
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                We handpick treated solid Sal wood logs, high-tensile carbon springs, and 40-density foam to guarantee unmatched structural longevity.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Award size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--color-espresso)' }}>
                Crafted To Perfection
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Every stitch, tuft, and armrest angle is tailored by master artisans who have perfected sofa upholstery over decades.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <HeartHandshake size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--color-espresso)' }}>
                Comfort For Every Home
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                By manufacturing in-house in Bhubaneswar and selling directly to families, we eliminate brand markups and pass 100% value to you.
              </p>
            </div>
          </div>
        </div>

        {/* Addresses Box */}
        <div className="about-addresses-grid">
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <MapPin size={20} />
              <span>Shop &amp; Showroom Location</span>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--color-espresso)', marginBottom: '0.75rem' }}>
              MB Maaarketing Showroom
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              AM42, Bhimatangi, Near Amabus Stop,
              <br />
              Bhubaneswar, Odisha - Pin 751002
            </p>
          </div>

          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <MapPin size={20} />
              <span>Manufacturing Factory Location</span>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--color-espresso)', marginBottom: '0.75rem' }}>
              MB Maaarketing Factory
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Jagannath Bihar, Plot No- 401, Sunderipada,
              <br />
              Near Champati Petrol Pump, Bhubaneswar, Dist- Khordha - Pin 751002
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
