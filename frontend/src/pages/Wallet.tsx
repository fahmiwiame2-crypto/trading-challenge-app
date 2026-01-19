import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  ArrowUpRight,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Crown,
  Zap,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '200 DH',
    account: '$5,000',
    icon: Star,
    features: ['Basic analytics', 'Community access', 'Email support'],
    color: 'from-slate-500 to-slate-600',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '500 DH',
    account: '$10,000',
    icon: Zap,
    features: ['AI signals', 'Advanced analytics', 'Priority support'],
    color: 'from-primary to-purple-400',
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '1000 DH',
    account: '$25,000',
    icon: Crown,
    features: ['All Pro features', '1-on-1 coaching', 'VIP community'],
    color: 'from-purple-500 to-pink-500',
  },
];

const paymentHistory = [
  {
    id: 'TXN-001',
    date: '2024-01-15',
    description: 'Pro Challenge Purchase',
    amount: '500 DH',
    status: 'completed',
    method: 'PayPal',
  },
  {
    id: 'TXN-002',
    date: '2024-01-10',
    description: 'Starter Challenge (Retry)',
    amount: '200 DH',
    status: 'completed',
    method: 'Credit Card',
  },
  {
    id: 'TXN-003',
    date: '2023-12-28',
    description: 'Starter Challenge Purchase',
    amount: '200 DH',
    status: 'completed',
    method: 'PayPal',
  },
  {
    id: 'TXN-004',
    date: '2023-12-20',
    description: 'Elite Upgrade Attempt',
    amount: '1000 DH',
    status: 'failed',
    method: 'Credit Card',
  },
];

const Wallet = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const currentPlan = {
    name: 'Pro',
    status: 'Active',
    startDate: '2024-01-15',
    expiryDate: '2024-02-15',
    daysRemaining: 21,
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    toast({
      title: 'Payment Processing',
      description: 'Redirecting to PayPal...',
    });
    setShowPaymentModal(false);
    // Simulate PayPal redirect
    setTimeout(() => {
      toast({
        title: 'Payment Successful!',
        description: 'Your challenge has been upgraded.',
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'failed':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Wallet & Payments</h1>
          <p className="text-muted-foreground">Manage your subscription and payment history</p>
        </div>

        {/* Current Plan */}
        <div className="glass-glow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{currentPlan.name} Challenge</h2>
                  <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium">
                    {currentPlan.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started {currentPlan.startDate} • {currentPlan.daysRemaining} days remaining
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleUpgrade('elite')}>
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`glass-glow p-6 ${plan.popular ? 'ring-2 ring-primary' : ''
                  }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="text-2xl font-bold gradient-text mb-1">{plan.price}</div>
                <p className="text-sm text-muted-foreground mb-4">{plan.account} account</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'hero' : 'outline'}
                  className="w-full"
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {currentPlan.name === plan.name ? 'Current Plan' : 'Select Plan'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="glass-glow">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Payment History</h2>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Transaction</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Method</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium">{payment.description}</div>
                        <div className="text-xs text-muted-foreground">{payment.id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{payment.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{payment.method}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium trading-number">{payment.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-glow p-6 max-w-md w-full animate-scale-in">
              <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
              <p className="text-muted-foreground mb-6">
                You will be redirected to PayPal to complete your payment securely.
              </p>

              <div className="p-4 rounded-lg bg-secondary/50 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Selected Plan</span>
                  <span className="font-bold">{plans.find(p => p.id === selectedPlan)?.name}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-primary">{plans.find(p => p.id === selectedPlan)?.price}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button variant="hero" className="flex-1" onClick={handlePayment}>
                  Pay with PayPal
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Wallet;