const StaticPage = ({ title, children }) => (
  <div className="min-h-screen bg-[var(--color-primary-cream)] py-16">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif text-[var(--color-text-dark)] mb-8">{title}</h1>
      <div className="prose prose-gray max-w-none text-[var(--color-text-muted)] leading-relaxed space-y-5 text-sm">
        {children}
      </div>
    </div>
  </div>
);

export const AboutPage = () => (
  <StaticPage title="About Us">
    <p>Welcome to <strong className="text-[var(--color-text-dark)]">Anti-Tarnish</strong> — India's premier destination for premium anti-tarnish jewellery that stays beautiful forever.</p>
    <p>We were founded with a single mission: to make high-quality, long-lasting jewellery accessible to everyone. Our pieces are crafted with advanced anti-tarnish technology that ensures they remain radiant through sweat, water, and everyday wear.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-8 mb-3">Our Promise</h2>
    <p>Every piece of Anti-Tarnish jewellery is:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Anti-Tarnish</strong> — stays shiny for months, guaranteed.</li>
      <li><strong>Waterproof</strong> — safe for swimming, showering, and sweating.</li>
      <li><strong>Skin-Friendly</strong> — hypoallergenic, no rashes or irritation.</li>
      <li><strong>Premium Quality</strong> — every piece is quality-checked before dispatch.</li>
    </ul>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-8 mb-3">Our Story</h2>
    <p>Started in 2022, we set out to solve a common problem — beautiful jewellery that tarnishes within days. Today, we serve over 50,000 happy customers across India, with a 4.8★ average rating and a growing community of jewellery lovers.</p>
  </StaticPage>
);

export const ContactPage = () => (
  <StaticPage title="Contact Us">
    <p>We'd love to hear from you! Reach out to us through any of the channels below.</p>
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div><p className="font-semibold text-[var(--color-text-dark)]">📧 Email</p><p>oditechofficial@gmail.com</p></div>
      <div><p className="font-semibold text-[var(--color-text-dark)]">📱 WhatsApp</p><p>+91 91246 70012</p></div>
      <div><p className="font-semibold text-[var(--color-text-dark)]">⏰ Working Hours</p><p>Monday – Saturday, 10 AM – 6 PM IST</p></div>
      <div><p className="font-semibold text-[var(--color-text-dark)]">📍 Address</p><p>Anti-Tarnish HQ, Plot No-8p, J.n Marg, Acharya Vihar, Bhubaneswar, Odisha 751022</p></div>
    </div>
    <p className="mt-6">For order-related queries, please have your <strong>Order ID</strong> ready. We respond within 24 business hours.</p>
  </StaticPage>
);

export const FAQsPage = () => (
  <StaticPage title="Frequently Asked Questions">
    {[
      { q: 'How long does anti-tarnish last?', a: 'Our jewellery is designed to remain tarnish-free for 6–12 months with regular wear, depending on skin type and maintenance.' },
      { q: 'Is it really waterproof?', a: 'Yes! You can wear it while swimming, showering, or exercising. Just avoid prolonged exposure to chlorine or salt water.' },
      { q: 'Is it safe for sensitive skin?', a: 'Absolutely. All our jewellery is hypoallergenic and nickel-free, safe for all skin types.' },
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout.' },
      { q: 'What is your return policy?', a: 'We offer a 7-day hassle-free return or exchange policy. See our Returns page for full details.' },
      { q: 'How should I care for my jewellery?', a: 'Wipe clean with a soft, dry cloth. Store in the provided pouch. Avoid perfume and harsh chemicals directly on the jewellery.' },
    ].map(({ q, a }) => (
      <div key={q} className="bg-white rounded-xl p-5 border border-gray-100">
        <p className="font-semibold text-[var(--color-text-dark)] mb-2">{q}</p>
        <p>{a}</p>
      </div>
    ))}
  </StaticPage>
);

export const ShippingPage = () => (
  <StaticPage title="Shipping Policy">
    <p>We ship across India. Here's everything you need to know about our shipping process.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">Delivery Timelines</h2>
    <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-2">
      <p><strong>Standard Delivery:</strong> 3–5 business days</p>
      <p><strong>Express Delivery:</strong> 1–2 business days (additional charges apply)</p>
      <p><strong>Metro Cities:</strong> Often delivered within 2–3 days</p>
    </div>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">Shipping Charges</h2>
    <p>🎉 <strong>Free shipping</strong> on all orders above ₹999.</p>
    <p>Orders below ₹999 attract a flat shipping fee of ₹99.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">Order Tracking</h2>
    <p>Once shipped, you will receive a tracking link via SMS and email. You can also use the <strong>Track Order</strong> feature on our website.</p>
  </StaticPage>
);

export const ReturnsPage = () => (
  <StaticPage title="Return & Exchange">
    <p>We want you to love every piece you receive. If something's not right, we've made returns easy.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">Return Policy</h2>
    <ul className="list-disc pl-5 space-y-2">
      <li>Returns accepted within <strong>7 days</strong> of delivery.</li>
      <li>Item must be unused, unworn, and in original packaging.</li>
      <li>Refund is processed within 5–7 business days to original payment method.</li>
    </ul>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">Exchange Policy</h2>
    <ul className="list-disc pl-5 space-y-2">
      <li>Exchanges accepted within <strong>7 days</strong> of delivery.</li>
      <li>You can exchange for a different size or another product of equal value.</li>
    </ul>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">How to Initiate</h2>
    <p>Email us at <strong>returns@anti-tarnish.in</strong> with your Order ID and reason. Our team will arrange a free pickup within 24 hours.</p>
  </StaticPage>
);

export const TrackOrderPage = () => (
  <StaticPage title="Track Your Order">
    <p>Enter your Order ID below to track your shipment in real time.</p>
    <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <label className="block text-sm font-medium text-[var(--color-text-dark)] mb-2">Order ID</label>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="e.g. AT-2026-00123"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors"
        />
        <button className="px-6 py-3 bg-[#1A1A1A] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-accent-gold)] transition-colors">
          Track
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-3">Your Order ID can be found in your confirmation email.</p>
    </div>
    <p className="mt-6">For assistance, contact us at <strong>support@anti-tarnish.in</strong> or WhatsApp <strong>+91 91246 70012</strong>.</p>
  </StaticPage>
);

export const TermsPage = () => (
  <StaticPage title="Terms & Conditions">
    <p>By placing an order or using this website, you agree to the following terms.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">1. Use of Website</h2>
    <p>This website is intended for personal, non-commercial use. You may not resell or reproduce any content without written permission from Anti-Tarnish.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">2. Product Information</h2>
    <p>We make every effort to display products accurately. Colours may vary slightly due to screen settings. Product descriptions are subject to change without notice.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">3. Pricing</h2>
    <p>All prices are in Indian Rupees (INR) and inclusive of GST. We reserve the right to change prices without prior notice.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">4. Governing Law</h2>
    <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Noida, Uttar Pradesh.</p>
  </StaticPage>
);

export const PrivacyPage = () => (
  <StaticPage title="Privacy Policy">
    <p>Your privacy matters to us. This policy explains how we collect, use, and protect your information.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">Information We Collect</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Name, email, phone, and shipping address when you place an order.</li>
      <li>Payment information (processed securely; we do not store card details).</li>
      <li>Browsing behaviour on our website (via cookies) to improve your experience.</li>
    </ul>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">How We Use It</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>To process and deliver your orders.</li>
      <li>To send order updates and promotional emails (you can unsubscribe anytime).</li>
      <li>To improve our products and services.</li>
    </ul>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">Data Security</h2>
    <p>We use SSL encryption and industry-standard security measures to protect your data. We never sell or share your personal information with third parties.</p>
    <h2 className="text-xl font-serif text-[var(--color-text-dark)] mt-6 mb-3">Contact</h2>
    <p>For privacy-related concerns, email us at <strong>privacy@anti-tarnish.in</strong>.</p>
  </StaticPage>
);
