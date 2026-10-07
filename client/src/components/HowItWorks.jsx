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
    description: 'Browse our curated L-shapes, 3+1+1 living room suites, and motorized recliners crafted at our factory.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Select Model & Comfort',
    description: 'Pick the silhouette that matches your living room aesthetic and seating requirement.',
    icon: CheckSquare,
  },
  {
    number: '03',
    title: 'Customize Your Specs',
    description: 'Tell us your exact room dimensions, select from 100+ velvet, bouclé or leatherette fabrics, and pick foam density.',
    icon: Sliders,
  },
  {
    number: '04',
    title: 'Connect With Artisan',
    description: 'Send an enquiry to connect directly with the shopkeeper and sofa master craftsman via Call or WhatsApp.',
    icon: PhoneCall,
  },
  {
    number: '05',
    title: 'Finalize Pricing & Polish',
    description: 'Review transparent factory-direct pricing, custom woodwork details, and get your personalized timeline.',
    icon: Sparkles,
  },
  {
    number: '06',
    title: 'Get Your Dream Sofa',
    description: 'Your sofa is precision-built, quality-inspected, and delivered with white-glove installation right to your living room.',
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
          <h2 className="section-title">How To Get Your Dream Sofa</h2>
          <p className="section-subtitle">
            From initial discovery to bespoke factory craftsmanship and living room delivery, here is how easy it is to work with us.
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
