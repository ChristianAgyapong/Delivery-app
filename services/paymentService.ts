/**
 * Payment Service - Handles all payment operations and integrations
 * Supports multiple payment methods including mobile money, cards, and digital wallets
 */

export type PaymentMethodType = 'card' | 'mobile_money' | 'paypal' | 'apple_pay' | 'google_pay' | 'stripe' | 'cash' | 'wallet';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  isActive: boolean;
  
  // Card details
  cardDetails?: {
    last4: string;
    brand: 'visa' | 'mastercard' | 'amex' | 'discover';
    expiryMonth: number;
    expiryYear: number;
    holderName: string;
    nickname?: string;
  };
  
  // Mobile money details
  mobileMoneyDetails?: {
    provider: 'mtn' | 'airtel' | 'vodafone' | 'mpesa' | 'orange';
    phoneNumber: string;
    accountName: string;
    nickname?: string;
  };
  
  // Digital wallet details
  walletDetails?: {
    email?: string;
    accountId?: string;
    nickname?: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  orderId?: string;
  type: 'payment' | 'refund' | 'payout' | 'topup' | 'withdrawal';
  amount: number;
  currency: string;
  
  paymentMethod: {
    id: string;
    type: PaymentMethodType;
    details: string; // Masked details like "**** 4242" or "+233***789"
  };
  
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  
  fees: {
    processingFee: number;
    platformFee?: number;
    totalFees: number;
  };
  
  metadata: {
    description: string;
    reference: string;
    notes?: string;
  };
  
  timestamps: {
    initiated: string;
    processed?: string;
    completed?: string;
    failed?: string;
  };
  
  errorInfo?: {
    code: string;
    message: string;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  orderId?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number; // Partial refund if specified
  reason: string;
  metadata?: Record<string, any>;
}

export interface WalletBalance {
  userId: string;
  balance: number;
  currency: string;
  frozenAmount: number; // Amount on hold
  availableBalance: number;
  lastUpdated: string;
}

class PaymentService {
  private paymentMethods: PaymentMethod[] = [];
  private transactions: PaymentTransaction[] = [];
  private walletBalances: Map<string, WalletBalance> = new Map();
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Subscribe to payment events
  subscribe(callback: (event: string, data: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify listeners of events
  private notify(event: string, data: any = {}) {
    this.listeners.forEach(listener => listener(event, data));
  }

  // Initialize mock payment data
  private initializeMockData(): void {
    const userId = 'customer_123';

    // Mock payment methods
    this.paymentMethods = [
      {
        id: 'pm_card_001',
        userId,
        type: 'card',
        isDefault: true,
        isActive: true,
        cardDetails: {
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2027,
          holderName: 'John Doe',
          nickname: 'Main Card',
        },
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pm_momo_001',
        userId,
        type: 'mobile_money',
        isDefault: false,
        isActive: true,
        mobileMoneyDetails: {
          provider: 'mtn',
          phoneNumber: '+233241234567',
          accountName: 'John Doe',
          nickname: 'MTN MoMo',
        },
        createdAt: '2023-02-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pm_paypal_001',
        userId,
        type: 'paypal',
        isDefault: false,
        isActive: true,
        walletDetails: {
          email: 'john.doe@example.com',
          nickname: 'PayPal Account',
        },
        createdAt: '2023-02-15T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      },
    ];

    // Mock wallet balance
    this.walletBalances.set(userId, {
      userId,
      balance: 45.67,
      currency: 'USD',
      frozenAmount: 0,
      availableBalance: 45.67,
      lastUpdated: new Date().toISOString(),
    });

    // Mock transaction history
    this.transactions = [
      {
        id: 'txn_001',
        userId,
        orderId: 'ord_001',
        type: 'payment',
        amount: 41.56,
        currency: 'USD',
        paymentMethod: {
          id: 'pm_card_001',
          type: 'card',
          details: 'Visa **** 4242',
        },
        status: 'completed',
        fees: {
          processingFee: 1.25,
          platformFee: 0.50,
          totalFees: 1.75,
        },
        metadata: {
          description: 'Payment for Pizza Palace order',
          reference: 'REF_001_2024',
        },
        timestamps: {
          initiated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          processed: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString(),
          completed: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000).toISOString(),
        },
      },
    ];
  }

  // Get payment methods for user
  getPaymentMethods(userId: string): PaymentMethod[] {
    return this.paymentMethods.filter(pm => pm.userId === userId);
  }

  // Get default payment method
  getDefaultPaymentMethod(userId: string): PaymentMethod | null {
    return this.paymentMethods.find(pm => pm.userId === userId && pm.isDefault) || null;
  }

  // Add payment method
  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
    success: boolean;
    message: string;
    paymentMethodId?: string;
  }> {
    try {
      // Validate payment method data
      if (paymentMethod.type === 'card' && !paymentMethod.cardDetails) {
        return { success: false, message: 'Card details are required' };
      }
      
      if (paymentMethod.type === 'mobile_money' && !paymentMethod.mobileMoneyDetails) {
        return { success: false, message: 'Mobile money details are required' };
      }

      // Simulate payment method validation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPaymentMethod: PaymentMethod = {
        ...paymentMethod,
        id: `pm_${paymentMethod.type}_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // If this is set as default, unset others
      if (newPaymentMethod.isDefault) {
        this.paymentMethods
          .filter(pm => pm.userId === newPaymentMethod.userId)
          .forEach(pm => pm.isDefault = false);
      }

      // If this is the first payment method, make it default
      const userMethods = this.paymentMethods.filter(pm => pm.userId === newPaymentMethod.userId);
      if (userMethods.length === 0) {
        newPaymentMethod.isDefault = true;
      }

      this.paymentMethods.push(newPaymentMethod);
      this.notify('payment_method_added', newPaymentMethod);

      return {
        success: true,
        message: 'Payment method added successfully',
        paymentMethodId: newPaymentMethod.id,
      };
    } catch (error) {
      console.error('Error adding payment method:', error);
      return {
        success: false,
        message: 'Failed to add payment method',
      };
    }
  }

  // Remove payment method
  async removePaymentMethod(paymentMethodId: string, userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const index = this.paymentMethods.findIndex(pm => 
        pm.id === paymentMethodId && pm.userId === userId
      );
      
      if (index === -1) {
        return { success: false, message: 'Payment method not found' };
      }

      const paymentMethod = this.paymentMethods[index];
      
      // Check if method is being used in pending transactions
      const pendingTransactions = this.transactions.filter(txn => 
        txn.paymentMethod.id === paymentMethodId && 
        (txn.status === 'pending' || txn.status === 'processing')
      );

      if (pendingTransactions.length > 0) {
        return { 
          success: false, 
          message: 'Cannot remove payment method with pending transactions' 
        };
      }

      this.paymentMethods.splice(index, 1);

      // If removed method was default, make first remaining method default
      if (paymentMethod.isDefault) {
        const remainingMethods = this.paymentMethods.filter(pm => pm.userId === userId);
        if (remainingMethods.length > 0) {
          remainingMethods[0].isDefault = true;
        }
      }

      this.notify('payment_method_removed', { paymentMethodId, userId });

      return {
        success: true,
        message: 'Payment method removed successfully',
      };
    } catch (error) {
      console.error('Error removing payment method:', error);
      return {
        success: false,
        message: 'Failed to remove payment method',
      };
    }
  }

  // Set default payment method
  async setDefaultPaymentMethod(paymentMethodId: string, userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const paymentMethod = this.paymentMethods.find(pm => 
        pm.id === paymentMethodId && pm.userId === userId
      );

      if (!paymentMethod) {
        return { success: false, message: 'Payment method not found' };
      }

      // Unset all defaults for user
      this.paymentMethods
        .filter(pm => pm.userId === userId)
        .forEach(pm => pm.isDefault = false);

      // Set new default
      paymentMethod.isDefault = true;
      paymentMethod.updatedAt = new Date().toISOString();

      this.notify('default_payment_method_changed', paymentMethod);

      return {
        success: true,
        message: 'Default payment method updated',
      };
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return {
        success: false,
        message: 'Failed to update default payment method',
      };
    }
  }

  // Process payment
  async processPayment(request: PaymentRequest & { userId: string }): Promise<{
    success: boolean;
    message: string;
    transactionId?: string;
    transaction?: PaymentTransaction;
  }> {
    try {
      const paymentMethod = this.paymentMethods.find(pm => 
        pm.id === request.paymentMethodId && pm.userId === request.userId
      );

      if (!paymentMethod || !paymentMethod.isActive) {
        return { success: false, message: 'Invalid or inactive payment method' };
      }

      // Create transaction
      const transaction: PaymentTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: request.userId,
        orderId: request.orderId,
        type: 'payment',
        amount: request.amount,
        currency: request.currency,
        paymentMethod: {
          id: paymentMethod.id,
          type: paymentMethod.type,
          details: this.getMaskedPaymentDetails(paymentMethod),
        },
        status: 'pending',
        fees: this.calculateFees(request.amount, paymentMethod.type),
        metadata: {
          description: request.description,
          reference: `REF_${Date.now()}`,
          notes: JSON.stringify(request.metadata || {}),
        },
        timestamps: {
          initiated: new Date().toISOString(),
        },
      };

      this.transactions.unshift(transaction);
      this.notify('payment_initiated', transaction);

      // Simulate payment processing
      setTimeout(async () => {
        transaction.status = 'processing';
        transaction.timestamps.processed = new Date().toISOString();
        this.notify('payment_processing', transaction);

        // Simulate processing delay
        setTimeout(() => {
          // Randomly succeed or fail (90% success rate)
          const success = Math.random() > 0.1;
          
          if (success) {
            transaction.status = 'completed';
            transaction.timestamps.completed = new Date().toISOString();
            this.notify('payment_completed', transaction);
          } else {
            transaction.status = 'failed';
            transaction.timestamps.failed = new Date().toISOString();
            transaction.errorInfo = {
              code: 'CARD_DECLINED',
              message: 'Payment was declined by your bank',
            };
            this.notify('payment_failed', transaction);
          }
        }, 2000);
      }, 1000);

      return {
        success: true,
        message: 'Payment initiated successfully',
        transactionId: transaction.id,
        transaction,
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        message: 'Payment processing failed',
      };
    }
  }

  // Process refund
  async processRefund(request: RefundRequest & { userId: string }): Promise<{
    success: boolean;
    message: string;
    refundTransactionId?: string;
  }> {
    try {
      const originalTransaction = this.transactions.find(txn => 
        txn.id === request.transactionId && txn.userId === request.userId
      );

      if (!originalTransaction) {
        return { success: false, message: 'Original transaction not found' };
      }

      if (originalTransaction.status !== 'completed') {
        return { success: false, message: 'Can only refund completed transactions' };
      }

      const refundAmount = request.amount || originalTransaction.amount;
      
      if (refundAmount > originalTransaction.amount) {
        return { success: false, message: 'Refund amount cannot exceed original payment' };
      }

      // Create refund transaction
      const refundTransaction: PaymentTransaction = {
        id: `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: request.userId,
        orderId: originalTransaction.orderId,
        type: 'refund',
        amount: -refundAmount, // Negative amount for refund
        currency: originalTransaction.currency,
        paymentMethod: originalTransaction.paymentMethod,
        status: 'processing',
        fees: { processingFee: 0, totalFees: 0 },
        metadata: {
          description: `Refund for transaction ${originalTransaction.id}`,
          reference: `REFUND_${Date.now()}`,
          notes: request.reason,
        },
        timestamps: {
          initiated: new Date().toISOString(),
          processed: new Date().toISOString(),
        },
      };

      this.transactions.unshift(refundTransaction);
      this.notify('refund_initiated', refundTransaction);

      // Simulate refund processing
      setTimeout(() => {
        refundTransaction.status = 'completed';
        refundTransaction.timestamps.completed = new Date().toISOString();
        
        // Update original transaction status
        originalTransaction.status = 'refunded';
        
        this.notify('refund_completed', refundTransaction);
      }, 3000);

      return {
        success: true,
        message: 'Refund initiated successfully',
        refundTransactionId: refundTransaction.id,
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        message: 'Refund processing failed',
      };
    }
  }

  // Get transaction history
  getTransactionHistory(userId: string, limit?: number): PaymentTransaction[] {
    const userTransactions = this.transactions
      .filter(txn => txn.userId === userId)
      .sort((a, b) => new Date(b.timestamps.initiated).getTime() - new Date(a.timestamps.initiated).getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  // Get transaction by ID
  getTransaction(transactionId: string, userId: string): PaymentTransaction | null {
    return this.transactions.find(txn => 
      txn.id === transactionId && txn.userId === userId
    ) || null;
  }

  // Get wallet balance
  getWalletBalance(userId: string): WalletBalance | null {
    return this.walletBalances.get(userId) || null;
  }

  // Top up wallet
  async topUpWallet(userId: string, amount: number, paymentMethodId: string): Promise<{
    success: boolean;
    message: string;
    transactionId?: string;
  }> {
    try {
      const paymentResult = await this.processPayment({
        userId,
        amount,
        currency: 'USD',
        paymentMethodId,
        description: 'Wallet top-up',
      });

      if (!paymentResult.success) {
        return paymentResult;
      }

      // Update wallet balance after successful payment
      const currentBalance = this.walletBalances.get(userId);
      if (currentBalance) {
        currentBalance.balance += amount;
        currentBalance.availableBalance += amount;
        currentBalance.lastUpdated = new Date().toISOString();
        this.notify('wallet_topped_up', { userId, amount, newBalance: currentBalance.balance });
      }

      return {
        success: true,
        message: 'Wallet topped up successfully',
        transactionId: paymentResult.transactionId,
      };
    } catch (error) {
      console.error('Error topping up wallet:', error);
      return {
        success: false,
        message: 'Wallet top-up failed',
      };
    }
  }

  // Calculate fees based on payment method
  private calculateFees(amount: number, paymentType: PaymentMethodType): {
    processingFee: number;
    platformFee?: number;
    totalFees: number;
  } {
    let processingFee = 0;
    const platformFee = amount * 0.012; // 1.2% platform fee

    switch (paymentType) {
      case 'card':
        processingFee = amount * 0.029 + 0.30; // 2.9% + $0.30
        break;
      case 'mobile_money':
        processingFee = amount * 0.02; // 2%
        break;
      case 'paypal':
        processingFee = amount * 0.034 + 0.30; // 3.4% + $0.30
        break;
      case 'apple_pay':
      case 'google_pay':
        processingFee = amount * 0.029 + 0.30; // Same as card
        break;
      case 'wallet':
        processingFee = 0; // No processing fee for wallet
        break;
      default:
        processingFee = amount * 0.03; // Default 3%
    }

    return {
      processingFee: Math.round(processingFee * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      totalFees: Math.round((processingFee + platformFee) * 100) / 100,
    };
  }

  // Get masked payment details for display
  private getMaskedPaymentDetails(paymentMethod: PaymentMethod): string {
    switch (paymentMethod.type) {
      case 'card':
        return `${paymentMethod.cardDetails?.brand?.toUpperCase()} **** ${paymentMethod.cardDetails?.last4}`;
      case 'mobile_money':
        const phone = paymentMethod.mobileMoneyDetails?.phoneNumber || '';
        return `${paymentMethod.mobileMoneyDetails?.provider?.toUpperCase()} ${phone.slice(0, 4)}***${phone.slice(-3)}`;
      case 'paypal':
        const email = paymentMethod.walletDetails?.email || '';
        return `PayPal ${email.slice(0, 3)}***@${email.split('@')[1]}`;
      default:
        return paymentMethod.type.replace('_', ' ').toUpperCase();
    }
  }

  // Get payment statistics
  getPaymentStats(userId: string): {
    totalSpent: number;
    totalTransactions: number;
    averageTransactionAmount: number;
    successRate: number;
    mostUsedMethod: string;
  } {
    const userTransactions = this.transactions.filter(txn => 
      txn.userId === userId && txn.type === 'payment'
    );

    const completedTransactions = userTransactions.filter(txn => txn.status === 'completed');
    const totalSpent = completedTransactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Count payment methods usage
    const methodCount = new Map<string, number>();
    userTransactions.forEach(txn => {
      const method = txn.paymentMethod.type;
      methodCount.set(method, (methodCount.get(method) || 0) + 1);
    });

    const mostUsedMethod = Array.from(methodCount.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    return {
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalTransactions: userTransactions.length,
      averageTransactionAmount: userTransactions.length > 0 ? 
        Math.round((totalSpent / completedTransactions.length) * 100) / 100 : 0,
      successRate: userTransactions.length > 0 ? 
        Math.round((completedTransactions.length / userTransactions.length) * 100) : 0,
      mostUsedMethod: mostUsedMethod.replace('_', ' ').toUpperCase(),
    };
  }
}

// Export singleton instance
export const paymentService = new PaymentService();