import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const reviews = [
  {
    id: 1,
    name: 'Priya S.',
    avatar: 'PS',
    rating: 5,
    text: '"Absolutely love the quality! I\'ve been wearing it daily for over a month and it still looks brand new. No tarnish at all!"',
    location: 'Mumbai'
  },
  {
    id: 2,
    name: 'Anika R.',
    avatar: 'AR',
    rating: 5,
    text: '"I was sceptical at first but this jewellery truly is waterproof. Wore my bracelet through swimming and it\'s still shining! Highly recommend."',
    location: 'Delhi'
  },
  {
    id: 3,
    name: 'Meera K.',
    avatar: 'MK',
    rating: 5,
    text: '"Super fast delivery and beautiful packaging. The necklace is exactly as shown. Perfect gift for my sister\'s birthday!"',
    location: 'Bangalore'
  }
];

const Reviews = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));

  const review = reviews[current];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-serif text-[var(--color-text-dark)] mb-2">What Our Customers Say</h2>
        <p className="text-[var(--color-text-muted)] mb-12">Real people. Real love.</p>

        <div className="relative">
          <div key={review.id} className="px-4">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#EAB308] text-[#EAB308]" />
              ))}
            </div>

            {/* Review text */}
            <p className="text-lg text-[var(--color-text-dark)] leading-relaxed mb-8 font-light italic">
              {review.text}
            </p>

            {/* Reviewer */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-beige)] flex items-center justify-center font-semibold text-sm text-[var(--color-text-dark)]">
                {review.avatar}
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--color-text-dark)] text-sm">{review.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{review.location}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button onClick={prev} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? 'bg-[var(--color-text-dark)]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
