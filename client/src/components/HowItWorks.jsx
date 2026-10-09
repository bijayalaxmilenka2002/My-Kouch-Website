import React from 'react';
import {
  Compass,
  CheckSquare,
  Sliders,
  PhoneCall,
  Sparkles,
  Truck,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Explore Collections',
    description: 'Browse our curated sofas, luxury mattresses, and premium pillows crafted at our factory.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Select Model & Comfort',
    description: 'Pick the silhouette that matches your home aesthetic, seating, and sleep requirements.',
    icon: CheckSquare,
  },
  {
    number: '03',
    title: 'Customize Your Specs',
    description: 'Tell us your exact dimensions, select from 100+ fabrics, and pick your ideal foam density or mattress firmness.',
    icon: Sliders,
  },
  {
    number: '04',
    title: 'Connect With Artisan',
    description: 'Send an enquiry to connect directly with the shopkeeper and comfort experts and master craftsmen via Call or WhatsApp.',
    icon: PhoneCall,
  },
  {
    number: '05',
    title: 'Finalize Pricing & Polish',
    description: 'Review transparent factory-direct pricing, custom material details, and get your personalized timeline.',
    icon: Sparkles,
  },
  {
    number: '06',
    title: 'Get Your Dream Setup',
    description: 'Your order is precision-built, quality-inspected, and delivered with white-glove installation right to your home.',
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works-section section-padding">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">
            <Sparkles size={14} />
            <span>The myKouch Journey</span>
          </span>
          <h2 className="section-title">How To Build Your Dream Setup</h2>
          <p className="section-subtitle">
            From initial discovery to bespoke factory craftsmanship and home delivery, here is how easy it is to work with us.
          </p>
        </div>

        <div className="process-grid">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className={`process-step-card reveal-on-scroll delay-${(idx % 3) + 1}`}>
                <div className="process-step-number">{step.number}</div>
                <div className="process-icon-wrap">
                  <Icon size={26} />
                </div>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-desc">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
