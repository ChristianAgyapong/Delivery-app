/**
 * User Service - Handles user authentication, profile, and preferences
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserPreferences {
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newRestaurants: boolean;
    weeklyDigest: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
    halalOnly: boolean;
    kosherOnly: boolean;
  };
  ordering: {
    defaultTip: number;
    savePaymentMethods: boolean;
    autoReorder: boolean;
    confirmOrders: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareOrderHistory: boolean;
    personalizedAds: boolean;
    dataAnalytics: boolean;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'wallet';
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  nickname?: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteRestaurants: string[];
  loyaltyPoints: number;
  currentStreak: number;
  longestStreak: number;
  joinDate: string;
}

class UserService {
  private user: User | null = null;
  private preferences: UserPreferences | null = null;
  private paymentMethods: PaymentMethod[] = [];
  private isAuthenticated: boolean = false;
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Subscribe to user service events
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

  // Initialize mock user data
  private initializeMockData(): void {
    this.user = {
      id: 'user123',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      avatar: 'https://example.com/avatar.jpg',
      dateOfBirth: '1990-05-15',
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: '2023-01-15T00:00:00.000Z',
      lastLoginAt: new Date().toISOString(),
    };

    this.preferences = {
      notifications: {
        orderUpdates: true,
        promotions: true,
        newRestaurants: false,
        weeklyDigest: true,
        sms: true,
        email: true,
        push: true,
      },
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        nutFree: true,
        halalOnly: false,
        kosherOnly: false,
      },
      ordering: {
        defaultTip: 18,
        savePaymentMethods: true,
        autoReorder: false,
        confirmOrders: true,
      },
      privacy: {
        shareLocation: true,
        shareOrderHistory: false,
        personalizedAds: true,
        dataAnalytics: true,
      },
    };

    this.paymentMethods = [
      {
        id: 'pm1',
        type: 'card',
        isDefault: true,
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2027,
        holderName: 'John Doe',
        nickname: 'Main Card',
      },
      {
        id: 'pm2',
        type: 'paypal',
        isDefault: false,
        nickname: 'PayPal Account',
      },
      {
        id: 'pm3',
        type: 'apple_pay',
        isDefault: false,
        nickname: 'Apple Pay',
      },
    ];

    this.isAuthenticated = true;
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    user?: User;
  }> {
    try {
      // Mock login - in real app, this would validate credentials
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      if (email === 'john.doe@example.com' && password === 'password') {
        this.isAuthenticated = true;
        if (this.user) {
          this.user.lastLoginAt = new Date().toISOString();
        }
        
        this.notify('user_logged_in', this.user);
        
        return {
          success: true,
          message: 'Login successful',
          user: this.user!,
        };
      }

      return {
        success: false,
        message: 'Invalid email or password',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{
    success: boolean;
    message: string;
    user?: User;
  }> {
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        isEmailVerified: false,
        isPhoneVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      this.user = newUser;
      this.isAuthenticated = true;
      
      // Initialize default preferences for new user
      this.initializeDefaultPreferences();
      
      this.notify('user_registered', newUser);
      
      return {
        success: true,
        message: 'Registration successful',
        user: newUser,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.notify('user_logged_out');
  }

  // User data methods
  getCurrentUser(): User | null {
    return this.isAuthenticated ? this.user : null;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  async updateProfile(updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.isAuthenticated || !this.user) {
        return { success: false, message: 'User not authenticated' };
      }

      this.user = { ...this.user, ...updates };
      this.notify('profile_updated', this.user);
      
      return {
        success: true,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Failed to update profile',
      };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.isAuthenticated) {
        return { success: false, message: 'User not authenticated' };
      }

      // Mock password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, validate current password first
      if (currentPassword !== 'password') {
        return { success: false, message: 'Current password is incorrect' };
      }

      this.notify('password_changed');
      
      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        message: 'Failed to change password',
      };
    }
  }

  // Preferences methods
  getPreferences(): UserPreferences | null {
    return this.isAuthenticated ? this.preferences : null;
  }

  async updatePreferences(updates: Partial<UserPreferences>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.isAuthenticated || !this.preferences) {
        return { success: false, message: 'User not authenticated' };
      }

      this.preferences = { 
        ...this.preferences,
        ...updates,
        notifications: { ...this.preferences.notifications, ...updates.notifications },
        dietary: { ...this.preferences.dietary, ...updates.dietary },
        ordering: { ...this.preferences.ordering, ...updates.ordering },
        privacy: { ...this.preferences.privacy, ...updates.privacy },
      };
      
      this.notify('preferences_updated', this.preferences);
      
      return {
        success: true,
        message: 'Preferences updated successfully',
      };
    } catch (error) {
      console.error('Preferences update error:', error);
      return {
        success: false,
        message: 'Failed to update preferences',
      };
    }
  }

  // Payment methods
  getPaymentMethods(): PaymentMethod[] {
    return this.isAuthenticated ? [...this.paymentMethods] : [];
  }

  getDefaultPaymentMethod(): PaymentMethod | null {
    if (!this.isAuthenticated) return null;
    return this.paymentMethods.find(pm => pm.isDefault) || null;
  }

  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<{
    success: boolean;
    message: string;
    paymentMethodId?: string;
  }> {
    try {
      if (!this.isAuthenticated) {
        return { success: false, message: 'User not authenticated' };
      }

      const newPaymentMethod: PaymentMethod = {
        ...paymentMethod,
        id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // If this is set as default, unset others
      if (newPaymentMethod.isDefault) {
        this.paymentMethods.forEach(pm => pm.isDefault = false);
      }

      // If this is the first payment method, make it default
      if (this.paymentMethods.length === 0) {
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
      console.error('Add payment method error:', error);
      return {
        success: false,
        message: 'Failed to add payment method',
      };
    }
  }

  async removePaymentMethod(paymentMethodId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.isAuthenticated) {
        return { success: false, message: 'User not authenticated' };
      }

      const index = this.paymentMethods.findIndex(pm => pm.id === paymentMethodId);
      if (index === -1) {
        return { success: false, message: 'Payment method not found' };
      }

      const wasDefault = this.paymentMethods[index].isDefault;
      this.paymentMethods.splice(index, 1);

      // If removed method was default, make first remaining method default
      if (wasDefault && this.paymentMethods.length > 0) {
        this.paymentMethods[0].isDefault = true;
      }

      this.notify('payment_method_removed', { paymentMethodId });
      
      return {
        success: true,
        message: 'Payment method removed successfully',
      };
    } catch (error) {
      console.error('Remove payment method error:', error);
      return {
        success: false,
        message: 'Failed to remove payment method',
      };
    }
  }

  async setDefaultPaymentMethod(paymentMethodId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.isAuthenticated) {
        return { success: false, message: 'User not authenticated' };
      }

      const paymentMethod = this.paymentMethods.find(pm => pm.id === paymentMethodId);
      if (!paymentMethod) {
        return { success: false, message: 'Payment method not found' };
      }

      // Unset all defaults
      this.paymentMethods.forEach(pm => pm.isDefault = false);
      
      // Set new default
      paymentMethod.isDefault = true;
      
      this.notify('default_payment_method_changed', paymentMethod);
      
      return {
        success: true,
        message: 'Default payment method updated',
      };
    } catch (error) {
      console.error('Set default payment method error:', error);
      return {
        success: false,
        message: 'Failed to update default payment method',
      };
    }
  }

  // User statistics
  async getUserStats(): Promise<UserStats | null> {
    try {
      if (!this.isAuthenticated || !this.user) return null;

      // Mock stats - in real app, this would come from backend
      const stats: UserStats = {
        totalOrders: 47,
        totalSpent: 1247.83,
        averageOrderValue: 26.55,
        favoriteRestaurants: ['rest1', 'rest3', 'rest2'],
        loyaltyPoints: 2450,
        currentStreak: 3,
        longestStreak: 12,
        joinDate: this.user.createdAt,
      };

      return stats;
    } catch (error) {
      console.error('Get user stats error:', error);
      return null;
    }
  }

  // Email/phone verification
  async sendVerificationEmail(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isAuthenticated || !this.user) {
        return { success: false, message: 'User not authenticated' };
      }

      // Mock email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.notify('verification_email_sent', { email: this.user.email });
      
      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      console.error('Send verification email error:', error);
      return {
        success: false,
        message: 'Failed to send verification email',
      };
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isAuthenticated || !this.user) {
        return { success: false, message: 'User not authenticated' };
      }

      // Mock verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.user.isEmailVerified = true;
      this.notify('email_verified');
      
      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Failed to verify email',
      };
    }
  }

  // Initialize default preferences for new users
  private initializeDefaultPreferences(): void {
    this.preferences = {
      notifications: {
        orderUpdates: true,
        promotions: true,
        newRestaurants: true,
        weeklyDigest: true,
        sms: true,
        email: true,
        push: true,
      },
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        nutFree: false,
        halalOnly: false,
        kosherOnly: false,
      },
      ordering: {
        defaultTip: 18,
        savePaymentMethods: true,
        autoReorder: false,
        confirmOrders: true,
      },
      privacy: {
        shareLocation: true,
        shareOrderHistory: false,
        personalizedAds: true,
        dataAnalytics: true,
      },
    };
  }

  // Delete user account
  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isAuthenticated) {
        return { success: false, message: 'User not authenticated' };
      }

      // Mock password validation
      if (password !== 'password') {
        return { success: false, message: 'Incorrect password' };
      }

      // Clear all user data
      this.user = null;
      this.preferences = null;
      this.paymentMethods = [];
      this.isAuthenticated = false;
      
      this.notify('account_deleted');
      
      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        message: 'Failed to delete account',
      };
    }
  }
}

// Export singleton instance
export const userService = new UserService();