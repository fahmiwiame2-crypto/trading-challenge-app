"""
Risk Management Module for Prop Trading Firm

This module implements strict risk rules to protect capital and ensure compliance
with prop trading firm regulations.
"""

from datetime import datetime, timedelta
from ..models import User, Trade, db, UserChallenge
from sqlalchemy import desc


class RiskManager:
    """
    Handles all risk management operations for the prop trading platform.
    
    Rules enforced:
    1. Maximum Total Drawdown: 10% of initial capital
    2. Maximum Daily Loss: 5% of initial capital
    """
    
    # Risk Limits
    MAX_TOTAL_DRAWDOWN_PERCENT = 10.0  # 10% max loss from initial capital
    MAX_DAILY_LOSS_PERCENT = 5.0       # 5% max daily loss
    PROFIT_TARGET_PERCENT = 10.0       # 10% profit target to PASS the challenge
    
    @staticmethod
    def check_risk_rules(user_id):
        """
        Check if user has violated any risk rules.
        
        Args:
            user_id (int): The user ID to check
            
        Returns:
            dict: {
                'allowed': bool,
                'status': str,
                'reason': str or None,
                'violations': list
            }
        """
        user = User.query.get(user_id)
        if not user:
            return {
                'allowed': False,
                'status': 'ERROR',
                'reason': 'User not found',
                'violations': []
            }
        
        # Determine rules source (Active Challenge or Defaults)
        active_challenge = UserChallenge.query.filter_by(
            user_id=user_id, 
            challenge_status='active'
        ).first()
        
        # Default limits
        max_total_drawdown_pct = RiskManager.MAX_TOTAL_DRAWDOWN_PERCENT
        max_daily_loss_pct = RiskManager.MAX_DAILY_LOSS_PERCENT
        profit_target_pct = RiskManager.PROFIT_TARGET_PERCENT
        
        # Override if active challenge exists
        if active_challenge:
            max_total_drawdown_pct = active_challenge.max_total_loss
            max_daily_loss_pct = active_challenge.max_daily_loss
            profit_target_pct = active_challenge.profit_target
        
        # If already failed, no need to check
        if user.status == 'FAILED':
            return {
                'allowed': False,
                'status': 'FAILED',
                'reason': user.failure_reason or 'Account already failed',
                'violations': []
            }
        
        # If already passed, account is successful
        if user.status == 'PASSED':
            return {
                'allowed': False,
                'status': 'PASSED',
                'reason': 'Challenge réussi! Félicitations!',
                'violations': []
            }
        
        violations = []
        
        # Calculate current equity (balance + unrealized P&L from open positions)
        current_equity = RiskManager._calculate_current_equity(user_id)
        
        # Check 1: Reset daily equity if it's a new day
        RiskManager._reset_daily_equity_if_needed(user)
        
        # Check 2: Total Drawdown Rule
        total_loss = user.initial_capital - current_equity
        total_drawdown_percent = (total_loss / user.initial_capital) * 100
        
        if total_drawdown_percent >= max_total_drawdown_pct:
            violations.append({
                'rule': 'MAX_TOTAL_DRAWDOWN',
                'limit': f'{max_total_drawdown_pct}%',
                'current': f'{total_drawdown_percent:.2f}%',
                'amount': f'${total_loss:.2f}'
            })
        
        # Check 3: Daily Loss Rule
        daily_loss = user.daily_starting_equity - current_equity
        daily_loss_percent = (daily_loss / user.initial_capital) * 100
        
        if daily_loss_percent >= max_daily_loss_pct:
            violations.append({
                'rule': 'MAX_DAILY_LOSS',
                'limit': f'{max_daily_loss_pct}%',
                'current': f'{daily_loss_percent:.2f}%',
                'amount': f'${daily_loss:.2f}'
            })
        
        # If violations exist, fail the account
        if violations:
            failure_messages = []
            for v in violations:
                if v['rule'] == 'MAX_TOTAL_DRAWDOWN':
                    failure_messages.append(
                        f"Perte totale de {v['current']} ({v['amount']}) dépasse la limite de {v['limit']}"
                    )
                elif v['rule'] == 'MAX_DAILY_LOSS':
                    failure_messages.append(
                        f"Perte journalière de {v['current']} ({v['amount']}) dépasse la limite de {v['limit']}"
                    )
            
            failure_reason = " | ".join(failure_messages)
            
            # Update user status to FAILED
            user.status = 'FAILED'
            user.failure_reason = failure_reason
            
            # Update Challenge Status if exists
            if active_challenge:
                active_challenge.challenge_status = 'failed'
                active_challenge.completed_at = datetime.utcnow()
                
            db.session.commit()
            
            return {
                'allowed': False,
                'status': 'FAILED',
                'reason': failure_reason,
                'violations': violations
            }
        
        # Check 4: Profit Target Rule (SUCCESS condition)
        profit = current_equity - user.initial_capital
        profit_percent = (profit / user.initial_capital) * 100
        
        if profit_percent >= profit_target_pct:
            # Challenge PASSED - User reached profit target!
            user.status = 'PASSED'
            user.failure_reason = None  # Clear any previous failure reason
            
            # Update Challenge Status if exists
            if active_challenge:
                active_challenge.challenge_status = 'passed'
                active_challenge.completed_at = datetime.utcnow()
                
            db.session.commit()
            
            return {
                'allowed': False,  # No more trading needed - challenge won!
                'status': 'PASSED',
                'reason': f'Felicitations! Objectif de profit de {profit_target_pct}% atteint! (+{profit_percent:.2f}%)',
                'violations': [],
                'metrics': {
                    'current_equity': round(current_equity, 2),
                    'profit_percent': round(profit_percent, 2),
                    'profit_amount': round(profit, 2)
                }
            }
        
        # All checks passed - User can continue trading
        return {
            'allowed': True,
            'status': 'ACTIVE',
            'reason': None,
            'violations': [],
            'metrics': {
                'current_equity': round(current_equity, 2),
                'total_drawdown_percent': round(total_drawdown_percent, 2),
                'daily_loss_percent': round(daily_loss_percent, 2),
                'profit_percent': round(profit_percent, 2),
                'profit_to_target': round(profit_target_pct - profit_percent, 2)
            }
        }
    
    @staticmethod
    def _calculate_current_equity(user_id):
        """
        Calculate current equity including unrealized P&L from open positions.
        
        Args:
            user_id (int): The user ID
            
        Returns:
            float: Current equity value
        """
        from ..services.feed_service import FeedService
        
        user = User.query.get(user_id)
        if not user:
            return 0
        
        # Start with current balance
        equity = user.balance
        
        # Add unrealized P&L from open positions
        open_trades = Trade.query.filter_by(user_id=user_id, status='OPEN').all()
        
        for trade in open_trades:
            # Get current price
            price_data = FeedService.get_price_data(trade.symbol)
            current_price = trade.price  # Default to entry price
            
            if price_data:
                current_price = price_data[-1]['close']
            
            # Calculate unrealized P&L
            if trade.type == 'BUY':
                unrealized_pnl = (current_price - trade.price) * trade.quantity
            else:  # SELL
                unrealized_pnl = (trade.price - current_price) * trade.quantity
            
            equity += unrealized_pnl
        
        return equity
    
    @staticmethod
    def _reset_daily_equity_if_needed(user):
        """
        Reset daily starting equity if it's a new trading day (UTC).
        
        Args:
            user (User): User object
        """
        now = datetime.utcnow()
        
        # Check if last reset was on a different day
        if user.last_equity_reset:
            last_reset_date = user.last_equity_reset.date()
            current_date = now.date()
            
            if last_reset_date < current_date:
                # New day - reset daily equity
                current_equity = RiskManager._calculate_current_equity(user.id)
                user.daily_starting_equity = current_equity
                user.last_equity_reset = now
                db.session.commit()
        else:
            # First time - initialize
            current_equity = RiskManager._calculate_current_equity(user.id)
            user.daily_starting_equity = current_equity
            user.last_equity_reset = now
            db.session.commit()
    
    @staticmethod
    def can_trade(user_id):
        """
        Quick check if user is allowed to trade.
        
        Args:
            user_id (int): The user ID
            
        Returns:
            tuple: (bool, str or None) - (can_trade, reason_if_not)
        """
        user = User.query.get(user_id)
        if not user:
            return False, "User not found"
        
        if user.status == 'FAILED':
            return False, user.failure_reason or "Account has failed risk checks"
        
        if user.status == 'PASSED':
            return False, "Challenge réussi! Votre compte a atteint l'objectif de profit. Contactez-nous pour passer à l'étape suivante."
        
        # Check current risk status
        risk_check = RiskManager.check_risk_rules(user_id)
        
        if not risk_check['allowed']:
            return False, risk_check['reason']
        
        return True, None
    
    @staticmethod
    def get_risk_metrics(user_id):
        """
        Get current risk metrics for a user.
        
        Args:
            user_id (int): The user ID
            
        Returns:
            dict: Risk metrics including drawdown, daily loss, etc.
        """
        user = User.query.get(user_id)
        if not user:
            return None
        
        current_equity = RiskManager._calculate_current_equity(user_id)
        
        # Total drawdown
        total_loss = user.initial_capital - current_equity
        total_drawdown_percent = (total_loss / user.initial_capital) * 100
        
        # Daily loss
        daily_loss = user.daily_starting_equity - current_equity
        daily_loss_percent = (daily_loss / user.initial_capital) * 100
        
        # Profit calculation
        profit = current_equity - user.initial_capital
        profit_percent = (profit / user.initial_capital) * 100
        
        return {
            'status': user.status,
            'current_equity': round(current_equity, 2),
            'initial_capital': round(user.initial_capital, 2),
            'daily_starting_equity': round(user.daily_starting_equity, 2),
            'total_drawdown': {
                'amount': round(total_loss, 2),
                'percent': round(total_drawdown_percent, 2),
                'limit_percent': RiskManager.MAX_TOTAL_DRAWDOWN_PERCENT,
                'remaining_percent': round(RiskManager.MAX_TOTAL_DRAWDOWN_PERCENT - total_drawdown_percent, 2)
            },
            'daily_loss': {
                'amount': round(daily_loss, 2),
                'percent': round(daily_loss_percent, 2),
                'limit_percent': RiskManager.MAX_DAILY_LOSS_PERCENT,
                'remaining_percent': round(RiskManager.MAX_DAILY_LOSS_PERCENT - daily_loss_percent, 2)
            },
            'profit_target': {
                'amount': round(profit, 2),
                'percent': round(profit_percent, 2),
                'target_percent': RiskManager.PROFIT_TARGET_PERCENT,
                'remaining_percent': round(RiskManager.PROFIT_TARGET_PERCENT - profit_percent, 2)
            },
            'failure_reason': user.failure_reason
        }

