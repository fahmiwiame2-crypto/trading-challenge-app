import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed Bennani',
    role: 'Funded Trader',
    avatar: 'AB',
    country: '🇲🇦 Morocco',
    profit: '+$4,250',
    content: 'TradeSense AI completely changed my trading game. The signals are incredibly accurate, and I passed the challenge in just 2 weeks!',
    rating: 5,
  },
  {
    name: 'Sarah El Amrani',
    role: 'Pro Trader',
    avatar: 'SA',
    country: '🇲🇦 Morocco',
    profit: '+$8,120',
    content: 'The risk management engine saved me multiple times. Best prop firm platform I\'ve ever used. The AI coaching is next level.',
    rating: 5,
  },
  {
    name: 'Youssef Tazi',
    role: 'Elite Trader',
    avatar: 'YT',
    country: '🇲🇦 Morocco',
    profit: '+$12,500',
    content: 'From a complete beginner to a funded trader in 3 months. The MasterClass courses and AI signals made all the difference.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by{' '}
            <span className="gradient-text">Traders</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of successful traders who have transformed their careers with TradeSense AI.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-glow p-6 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />

              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{testimonial.country}</span>
                  <span className="text-sm font-semibold text-success trading-number">{testimonial.profit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
