import { Sparkles, Droplets, Leaf, ShieldCheck } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: Sparkles,
    title: 'Anti-Tarnish',
    subtitle: 'Stays Shiny Longer',
    description: 'Our advanced anti-tarnish coating ensures your jewellery stays as radiant as the day you bought it.'
  },
  {
    id: 2,
    icon: Droplets,
    title: 'Waterproof',
    subtitle: 'Perfect for Everyday',
    description: 'Swim, shower, sweat — our jewellery is engineered to withstand water and daily wear without losing its shine.'
  },
  {
    id: 3,
    icon: Leaf,
    title: 'Skin Friendly',
    subtitle: 'Gentle on Your Skin',
    description: 'Hypoallergenic materials mean no redness, no rashes, and no irritation. Safe for even the most sensitive skin.'
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: 'Premium Quality',
    subtitle: 'Crafted with Care',
    description: 'Every piece is carefully crafted and quality-checked to ensure you receive nothing but the very best.'
  }
];

const WhyChoose = () => {
  return (
    <section className="py-20 bg-[var(--color-primary-beige)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-serif text-[var(--color-text-dark)] mb-3">
            Why Choose Anti-Tarnish?
          </h2>
          <p className="text-[var(--color-text-muted)] text-lg">More than just jewellery, it's a promise.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-xl p-8 text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary-beige)] flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--color-text-dark)] mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs font-semibold tracking-wider text-[var(--color-accent-gold)] uppercase mb-3">
                  {feature.subtitle}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
