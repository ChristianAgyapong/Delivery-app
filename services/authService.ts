/**
 * Authentication Service - Handles multi-role authentication system
 * Supports Customer, Restaurant, Delivery, and Admin authentication
 */

export type UserRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  restaurantId?: string; // For restaurant users
  businessName?: string; // For restaurant users
  vehicleInfo?: VehicleInfo; // For delivery users
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface VehicleInfo {
  type: 'bicycle' | 'motorcycle' | 'car' | 'scooter';
  licensePlate?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export interface SignupData {
  email: string;
  phone?: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  businessName?: string; // Required for restaurant role
  vehicleInfo?: VehicleInfo; // Required for delivery role
}

export interface PasswordResetRequest {
  email?: string;
  phone?: string;
  method: 'email' | 'sms' | 'otp';
}

export interface OTPVerification {
  identifier: string; // email or phone
  otp: string;
  purpose: 'login' | 'signup' | 'password_reset' | 'phone_verification' | 'email_verification';
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private isAuthenticated: boolean = false;
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    // Initialize without auto-login for proper authentication flow
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  // Subscribe to auth events
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

  // Login with email/phone and password
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    message: string;
    user?: AuthUser;
    requiresOTP?: boolean;
  }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock users for different roles
      const mockUsers = {
        'john.customer@example.com': {
          id: 'customer_123',
          email: 'john.customer@example.com',
          phone: '+1234567890',
          role: 'customer' as UserRole,
          firstName: 'John',
          lastName: 'Doe',
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
          createdAt: '2023-01-15T00:00:00.000Z',
        },
        'restaurant@pizzapalace.com': {
          id: 'restaurant_456',
          email: 'restaurant@pizzapalace.com',
          phone: '+1234567891',
          role: 'restaurant' as UserRole,
          firstName: 'Mario',
          lastName: 'Rossi',
          restaurantId: 'rest_001',
          businessName: 'Pizza Palace',
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
          createdAt: '2023-02-01T00:00:00.000Z',
        },
        'rider@delivery.com': {
          id: 'delivery_789',
          email: 'rider@delivery.com',
          phone: '+1234567892',
          role: 'delivery' as UserRole,
          firstName: 'Mike',
          lastName: 'Johnson',
          vehicleInfo: {
            type: 'motorcycle' as const,
            licensePlate: 'ABC123',
            brand: 'Honda',
            model: 'CB125F',
            year: 2022,
            color: 'Red',
          },
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
          createdAt: '2023-02-15T00:00:00.000Z',
        },
        'admin@fooddelivery.com': {
          id: 'admin_101',
          email: 'admin@fooddelivery.com',
          role: 'admin' as UserRole,
          firstName: 'Admin',
          lastName: 'User',
          isEmailVerified: true,
          isPhoneVerified: false,
          isActive: true,
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      };

      const email = credentials.email?.toLowerCase();
      const mockUser = email ? mockUsers[email as keyof typeof mockUsers] : null;

      if (!mockUser || credentials.password !== 'password123') {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Check if role matches (if specified)
      if (credentials.role && mockUser.role !== credentials.role) {
        return {
          success: false,
          message: 'Invalid credentials for this role',
        };
      }

      // Create authenticated user
      this.currentUser = {
        ...mockUser,
        lastLoginAt: new Date().toISOString(),
      };
      this.isAuthenticated = true;

      // Import userService and sync the user data (important for profile consistency)
      try {
        const { userService } = require('./userService');
        
        // Sync login data with userService to ensure profile data is consistent
        await userService.login(email, credentials.password || 'password123');
        
        // Ensure user profile data is in sync
        if (this.currentUser) {
          await userService.updateProfile({
            firstName: this.currentUser.firstName || '',
            lastName: this.currentUser.lastName || '',
            email: this.currentUser.email,
            phone: this.currentUser.phone
          });
        }
      } catch (syncError) {
        console.error('Error syncing user data during login:', syncError);
        // Continue with login even if sync fails
      }

      this.notify('user_logged_in', this.currentUser);

      return {
        success: true,
        message: 'Login successful',
        user: this.currentUser,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  }

  // Register new user
  async signup(signupData: SignupData): Promise<{
    success: boolean;
    message: string;
    user?: AuthUser;
    requiresVerification?: boolean;
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate role-specific requirements
      if (signupData.role === 'restaurant' && !signupData.businessName) {
        return {
          success: false,
          message: 'Business name is required for restaurant registration',
        };
      }

      if (signupData.role === 'delivery' && !signupData.vehicleInfo) {
        return {
          success: false,
          message: 'Vehicle information is required for delivery registration',
        };
      }

      // Create new user
      const newUser: AuthUser = {
        id: `${signupData.role}_${Date.now()}`,
        email: signupData.email,
        phone: signupData.phone,
        role: signupData.role,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        businessName: signupData.businessName,
        vehicleInfo: signupData.vehicleInfo,
        isEmailVerified: false,
        isPhoneVerified: false,
        isActive: signupData.role !== 'restaurant' && signupData.role !== 'delivery', // Require approval for business accounts
        createdAt: new Date().toISOString(),
      };

      // For restaurants, create restaurant ID
      if (signupData.role === 'restaurant') {
        newUser.restaurantId = `rest_${Date.now()}`;
      }

      this.currentUser = newUser;
      this.isAuthenticated = true;

      // Import userService and sync the user data (important for profile consistency)
      const { userService } = require('./userService');
      
      // Register the user with userService to make sure profile data is in sync
      await userService.register({
        email: signupData.email,
        password: 'password123', // Using default password for the mock
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        phone: signupData.phone
      });
      
      // Update additional user preferences based on role
      if (signupData.role === 'restaurant' && signupData.businessName) {
        await userService.updateProfile({
          businessName: signupData.businessName
        });
      }
      
      if (signupData.role === 'delivery' && signupData.vehicleInfo) {
        await userService.updateProfile({
          vehicleInfo: signupData.vehicleInfo
        });
      }

      this.notify('user_registered', newUser);

      return {
        success: true,
        message: `Registration successful! ${signupData.role === 'customer' ? 'Welcome!' : 'Account pending approval.'}`,
        user: newUser,
        requiresVerification: true,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  // OTP-based login
  async loginWithOTP(phone: string, role?: UserRole): Promise<{
    success: boolean;
    message: string;
    otpSent?: boolean;
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simulate OTP sending
      this.notify('otp_sent', { phone, purpose: 'login' });

      return {
        success: true,
        message: 'OTP sent to your phone number',
        otpSent: true,
      };
    } catch (error) {
      console.error('OTP login error:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      };
    }
  }

  // Verify OTP
  async verifyOTP(verification: OTPVerification): Promise<{
    success: boolean;
    message: string;
    user?: AuthUser;
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock OTP verification (any 6-digit code works)
      if (verification.otp.length !== 6 || !/^\d{6}$/.test(verification.otp)) {
        return {
          success: false,
          message: 'Invalid OTP format. Please enter 6 digits.',
        };
      }

      // For login purpose, authenticate user
      if (verification.purpose === 'login') {
        // Create mock user based on phone
        const mockUser: AuthUser = {
          id: `customer_${Date.now()}`,
          phone: verification.identifier,
          email: `${verification.identifier.replace('+', '')}@phone.com`,
          role: 'customer',
          firstName: 'Phone',
          lastName: 'User',
          isEmailVerified: false,
          isPhoneVerified: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        this.currentUser = mockUser;
        this.isAuthenticated = true;
        this.notify('user_logged_in_otp', mockUser);

        return {
          success: true,
          message: 'Login successful',
          user: mockUser,
        };
      }

      // For verification purposes
      if (this.currentUser && verification.purpose === 'phone_verification') {
        this.currentUser.isPhoneVerified = true;
        this.notify('phone_verified', this.currentUser);
      }

      if (this.currentUser && verification.purpose === 'email_verification') {
        this.currentUser.isEmailVerified = true;
        this.notify('email_verified', this.currentUser);
      }

      return {
        success: true,
        message: 'Verification successful',
        user: this.currentUser || undefined,
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: 'Verification failed. Please try again.',
      };
    }
  }

  // Password reset request
  async requestPasswordReset(request: PasswordResetRequest): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const identifier = request.email || request.phone;
      this.notify('password_reset_requested', { identifier, method: request.method });

      const methodText = request.method === 'email' ? 'email' : 
                        request.method === 'sms' ? 'SMS' : 'phone number';

      return {
        success: true,
        message: `Password reset instructions sent to your ${methodText}`,
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Failed to send reset instructions. Please try again.',
      };
    }
  }

  // Reset password with token/OTP
  async resetPassword(identifier: string, newPassword: string, token: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock token validation
      if (token.length < 6) {
        return {
          success: false,
          message: 'Invalid reset token',
        };
      }

      this.notify('password_reset_completed', { identifier });

      return {
        success: true,
        message: 'Password reset successful. Please login with your new password.',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Password reset failed. Please try again.',
      };
    }
  }

  // Logout
  logout(): void {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.notify('user_logged_out');
  }

  // Get current authenticated user
  getCurrentUser(): AuthUser | null {
    return this.isAuthenticated ? this.currentUser : null;
  }

  // Check authentication status
  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  // Get user role
  getUserRole(): UserRole | null {
    return this.currentUser?.role || null;
  }

  // Check if user has specific role
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  // Switch user role (for testing)
  async switchToRole(role: UserRole): Promise<{
    success: boolean;
    message: string;
    user?: AuthUser;
  }> {
    try {
      const mockCredentials = {
        customer: { email: 'john.customer@example.com', password: 'password123' },
        restaurant: { email: 'restaurant@pizzapalace.com', password: 'password123' },
        delivery: { email: 'rider@delivery.com', password: 'password123' },
        admin: { email: 'admin@fooddelivery.com', password: 'password123' },
      };

      const credentials = mockCredentials[role];
      return await this.login({ ...credentials, role });
    } catch (error) {
      console.error('Role switch error:', error);
      return {
        success: false,
        message: 'Failed to switch role',
      };
    }
  }

  // Send verification email
  async sendEmailVerification(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.currentUser?.email) {
        return { success: false, message: 'No email address found' };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.notify('email_verification_sent', { email: this.currentUser.email });
      
      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Failed to send verification email',
      };
    }
  }

  // Send phone verification
  async sendPhoneVerification(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.currentUser?.phone) {
        return { success: false, message: 'No phone number found' };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.notify('phone_verification_sent', { phone: this.currentUser.phone });
      
      return {
        success: true,
        message: 'Verification SMS sent successfully',
      };
    } catch (error) {
      console.error('Phone verification error:', error);
      return {
        success: false,
        message: 'Failed to send verification SMS',
      };
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'email' | 'phone'>>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'User not authenticated' };
      }

      this.currentUser = { ...this.currentUser, ...updates };
      
      // Reset verification status if email/phone changed
      if (updates.email && updates.email !== this.currentUser.email) {
        this.currentUser.isEmailVerified = false;
      }
      if (updates.phone && updates.phone !== this.currentUser.phone) {
        this.currentUser.isPhoneVerified = false;
      }

      this.notify('profile_updated', this.currentUser);
      
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

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'User not authenticated' };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password validation
      if (currentPassword !== 'password123') {
        return { success: false, message: 'Current password is incorrect' };
      }

      this.notify('password_changed', { userId: this.currentUser.id });
      
      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Failed to change password',
      };
    }
  }

  // Delete account
  async deleteAccount(password: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'User not authenticated' };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password validation
      if (password !== 'password123') {
        return { success: false, message: 'Incorrect password' };
      }

      const userId = this.currentUser.id;
      this.logout();
      
      this.notify('account_deleted', { userId });
      
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
export const authService = new AuthService();