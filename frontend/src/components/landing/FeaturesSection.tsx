import {
  Brain,
  LineChart,
  Shield,
  Trophy,
  GraduationCap,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Trade Signals',
    description: 'Real-time Buy/Sell/Hold signals powered by advanced machine learning algorithms analyzing market patterns.',
    color: 'from-primary to-purple-400',
  },
  {
    icon: LineChart,
    title: 'Real-Time Market Data',
    description: 'Live streaming prices from global markets including forex, crypto, and stocks with sub-second updates.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Risk Management Engine',
    description: 'Automated drawdown protection and position sizing to keep your trading account safe and compliant.',
    color: 'from-success to-emerald-400',
  },
  {
    icon: Trophy,
    title: 'Community & Leaderboards',
    description: 'Compete with top traders, share strategies, and climb the ranks to prove your trading skills.',
    color: 'from-warning to-orange-400',
  },
  {
    icon: GraduationCap,
    title: 'Education Hub',
    description: 'MasterClass courses from beginner to advanced, including technical analysis and risk management.',
    color: 'from-pink-500 to-rose-400',
  },
  {
    icon: Users,
    title: 'Trader Community',
    description: 'Connect with like-minded traders, share insights, and learn from the community\'s collective wisdom.',
    color: 'from-cyan-500 to-purple-400',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Trade Smarter</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our AI-powered platform gives you the tools, insights, and capital to succeed in the markets.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-glow p-6 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
