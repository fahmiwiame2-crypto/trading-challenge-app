import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  ChevronRight,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Challenge = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'paid';

  const challengeData = {
    demo: {
      type: 'Demo Account',
      badge: 'DEMO',
      badgeColor: 'bg-success/20 text-success',
      balance: 10000,
      equity: 10247.83,
      profitTarget: null,
      profitPercent: 2.48,
      dailyDrawdown: 1.2,
      dailyLimit: 5,
      totalDrawdown: 2.1,
      totalLimit: 10,
      daysRemaining: 5,
      totalDays: 7,
      status: 'ACTIVE',
      canBeFunded: false,
    },
    trial: {
      type: 'Free Trial',
      badge: 'TRIAL',
      badgeColor: 'bg-warning/20 text-warning',
      balance: 2000,
      equity: 2089.45,
      profitTarget: 8,
      profitPercent: 4.47,
      dailyDrawdown: 0.8,
      dailyLimit: 5,
      totalDrawdown: 1.5,
      totalLimit: 10,
      daysRemaining: 12,
      totalDays: 14,
      status: 'ACTIVE',
      canBeFunded: false,
    },
    paid: {
      type: 'Pro Challenge',
      badge: 'PRO',
      badgeColor: 'bg-primary/20 text-primary',
      balance: 10000,
      equity: 10778.90,
      profitTarget: 10,
      profitPercent: 7.79,
      dailyDrawdown: 2.1,
      dailyLimit: 5,
      totalDrawdown: 4.2,
      totalLimit: 10,
      daysRemaining: 21,
      totalDays: 30,
      status: 'ACTIVE',
      canBeFunded: true,
    },
  };

  const data = challengeData[mode as keyof typeof challengeData] || challengeData.paid;

  const rules = [
    {
      icon: Target,
      title: 'Profit Target',
      value: data.profitTarget ? `${data.profitTarget}%` : 'None',
      current: `${data.profitPercent}%`,
      progress: data.profitTarget ? (data.profitPercent / data.profitTarget) * 100 : 0,
      color: 'text-success',
      bgColor: 'bg-success',
      description: data.profitTarget ? 'Reach the profit target to pass' : 'No profit requirement for demo',
    },
    {
      icon: TrendingDown,
      title: 'Daily Drawdown',
      value: `${data.dailyLimit}%`,
      current: `${data.dailyDrawdown}%`,
      progress: (data.dailyDrawdown / data.dailyLimit) * 100,
      color: 'text-warning',
      bgColor: 'bg-warning',
      description: 'Maximum loss allowed in a single day',
    },
    {
      icon: AlertTriangle,
      title: 'Total Drawdown',
      value: `${data.totalLimit}%`,
      current: `${data.totalDrawdown}%`,
      progress: (data.totalDrawdown / data.totalLimit) * 100,
      color: 'text-destructive',
      bgColor: 'bg-destructive',
      description: 'Maximum total loss from peak balance',
    },
    {
      icon: Clock,
      title: 'Time Remaining',
      value: `${data.totalDays} days`,
      current: `${data.daysRemaining} left`,
      progress: ((data.totalDays - data.daysRemaining) / data.totalDays) * 100,
      color: 'text-primary',
      bgColor: 'bg-primary',
      description: 'Complete within the time limit',
    },
  ];

  const tradingRules = [
    'No trading during high-impact news (2 mins before/after)',
    'Maximum 3% risk per trade',
    'Must use stop-loss on all positions',
    'Weekend holding is allowed',
    'Minimum 5 trading days required',
    'No EA/Bot trading without approval',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">Challenge Progress</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.badgeColor}`}>
                {data.badge}
              </span>
            </div>
            <p className="text-muted-foreground">{data.type} • Track your trading challenge progress</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-xl text-sm font-bold ${data.status === 'ACTIVE' ? 'bg-primary/20 text-primary' :
                data.status === 'PASSED' ? 'bg-success/20 text-success' :
                  'bg-destructive/20 text-destructive'
              }`}>
              {data.status}
            </span>
            <Button variant="hero" asChild>
              <Link to="/dashboard/trading">Start Trading</Link>
            </Button>
          </div>
        </div>

        {/* Demo/Trial Notice */}
        {!data.canBeFunded && (
          <div className="glass-glow p-4 border-l-4 border-warning flex items-start gap-3">
            <Info className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">
                {mode === 'demo' ? 'Demo Mode Active' : 'Free Trial Mode'}
              </p>
              <p className="text-sm text-muted-foreground">
                {mode === 'demo'
                  ? 'This is a demo account for practice. You cannot become funded from a demo account.'
                  : 'This is a free trial to test challenge rules. Upgrade to a paid challenge to become funded.'}
              </p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link to="/register?type=paid">
                  Upgrade to Paid Challenge
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-glow p-6">
            <div className="text-sm text-muted-foreground mb-1">Starting Balance</div>
            <div className="text-2xl font-bold trading-number">${data.balance.toLocaleString()}</div>
          </div>
          <div className="glass-glow p-6">
            <div className="text-sm text-muted-foreground mb-1">Current Equity</div>
            <div className="text-2xl font-bold trading-number">${data.equity.toLocaleString()}</div>
          </div>
          <div className="glass-glow p-6">
            <div className="text-sm text-muted-foreground mb-1">Profit/Loss</div>
            <div className={`text-2xl font-bold trading-number ${data.profitPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
              {data.profitPercent >= 0 ? '+' : ''}{data.profitPercent}%
            </div>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule, index) => (
            <div key={index} className="glass-glow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${rule.bgColor}/20 flex items-center justify-center`}>
                  <rule.icon className={`w-5 h-5 ${rule.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{rule.title}</div>
                  <div className="text-xs text-muted-foreground">{rule.description}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold trading-number ${rule.color}`}>{rule.current}</span>
                <span className="text-sm text-muted-foreground">Limit: {rule.value}</span>
              </div>

              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${rule.bgColor} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(rule.progress, 100)}%` }}
                />
              </div>

              {rule.progress >= 80 && rule.title !== 'Profit Target' && (
                <p className="text-xs text-warning mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Approaching limit
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Trading Rules */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Trading Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tradingRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Status Guide */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Challenge Status Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">ACTIVE</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Challenge is in progress. Trade carefully and follow all rules.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-semibold text-success">PASSED</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Congratulations! You've passed and are ready to be funded.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="font-semibold text-destructive">FAILED</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Challenge failed due to rule violation. You can start a new challenge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Challenge;