/**
 * Admin Management Service - Comprehensive platform administration and oversight
 * Handles user management, restaurant oversight, order monitoring, and platform analytics
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export type AdminPermission = 
  | 'manage_users'
  | 'manage_restaurants' 
  | 'manage_orders'
  | 'manage_payments'
  | 'view_analytics'
  | 'handle_disputes'
  | 'manage_commissions'
  | 'manage_promotions'
  | 'system_settings'
  | 'manage_admins';

export interface PlatformStats {
  users: {
    totalCustomers: number;
    totalRestaurants: number;
    totalDeliveryRiders: number;
    activeUsersToday: number;
    newSignupsToday: number;
    monthlyGrowth: number;
  };
  orders: {
    totalOrders: number;
    ordersToday: number;
    completedOrders: number;
    cancelledOrders: number;
    averageOrderValue: number;
    orderCompletionRate: number;
  };
  financial: {
    totalRevenue: number;
    revenueToday: number;
    totalCommissions: number;
    commissionsToday: number;
    averageCommissionRate: number;
    monthlyRevenue: number;
  };
  delivery: {
    totalDeliveries: number;
    deliveriesToday: number;
    averageDeliveryTime: number;
    deliverySuccessRate: number;
    activeRiders: number;
  };
}

export interface UserManagement {
  id: string;
  type: 'customer' | 'restaurant' | 'delivery';
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'banned' | 'pending_verification';
  joinDate: string;
  lastActivity: string;
  totalOrders?: number;
  totalSpent?: number;
  rating?: number;
  verificationStatus: {
    email: boolean;
    phone: boolean;
    identity?: boolean;
    business?: boolean;
  };
}

export interface RestaurantOversight {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  status: 'active' | 'suspended' | 'pending_approval' | 'rejected';
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  cuisine: string[];
  rating: number;
  totalOrders: number;
  monthlyRevenue: number;
  commissionRate: number;
  joinDate: string;
  lastActive: string;
  documents: {
    businessLicense: 'pending' | 'approved' | 'rejected';
    foodLicense: 'pending' | 'approved' | 'rejected';
    taxCertificate: 'pending' | 'approved' | 'rejected';
  };
  complianceIssues: string[];
}

export interface OrderMonitoring {
  id: string;
  customerName: string;
  restaurantName: string;
  riderName?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  amount: number;
  commission: number;
  createdAt: string;
  deliveredAt?: string;
  issues: OrderIssue[];
}

export interface OrderIssue {
  id: string;
  type: 'late_delivery' | 'quality_complaint' | 'missing_items' | 'wrong_order' | 'payment_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedBy: 'customer' | 'restaurant' | 'rider' | 'system';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  createdAt: string;
  resolvedAt?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  type: 'refund_request' | 'quality_issue' | 'delivery_problem' | 'payment_dispute' | 'rating_dispute';
  reportedBy: {
    id: string;
    name: string;
    type: 'customer' | 'restaurant' | 'delivery';
  };
  againstParty: {
    id: string;
    name: string;
    type: 'customer' | 'restaurant' | 'delivery';
  };
  description: string;
  evidence: string[];
  status: 'open' | 'under_review' | 'resolved' | 'escalated' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CommissionSettings {
  restaurantCommission: {
    defaultRate: number;
    minimumRate: number;
    maximumRate: number;
    customRates: { restaurantId: string; rate: number }[];
  };
  deliveryCommission: {
    baseRate: number;
    distanceMultiplier: number;
    peakHourMultiplier: number;
    minimumEarning: number;
  };
  platformFees: {
    paymentProcessingFee: number;
    serviceFee: number;
    cancellationFee: number;
  };
}

export interface AnalyticsReport {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  metrics: {
    userGrowth: number;
    orderGrowth: number;
    revenueGrowth: number;
    customerRetention: number;
    averageOrderValue: number;
    deliveryPerformance: number;
  };
  topPerformers: {
    restaurants: { id: string; name: string; revenue: number }[];
    riders: { id: string; name: string; deliveries: number; rating: number }[];
  };
  insights: string[];
}

class AdminManagementService {
  private admins: AdminUser[] = [];
  private platformStats!: PlatformStats;
  private users: UserManagement[] = [];
  private restaurants: RestaurantOversight[] = [];
  private orders: OrderMonitoring[] = [];
  private disputes: Dispute[] = [];
  private commissionSettings!: CommissionSettings;
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Subscribe to admin events
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

  // Initialize mock admin data
  private initializeMockData(): void {
    // Mock admin users
    this.admins = [
      {
        id: 'admin_001',
        email: 'admin@foodieexpress.com',
        name: 'System Administrator',
        role: 'super_admin',
        permissions: [
          'manage_users', 'manage_restaurants', 'manage_orders', 'manage_payments',
          'view_analytics', 'handle_disputes', 'manage_commissions', 'manage_promotions',
          'system_settings', 'manage_admins'
        ],
        isActive: true,
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: 'admin_002',
        email: 'moderator@foodieexpress.com',
        name: 'Content Moderator',
        role: 'moderator',
        permissions: ['manage_users', 'handle_disputes', 'view_analytics'],
        isActive: true,
        lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        createdAt: '2023-02-15T00:00:00.000Z',
      },
    ];

    // Mock platform stats
    this.platformStats = {
      users: {
        totalCustomers: 15420,
        totalRestaurants: 342,
        totalDeliveryRiders: 89,
        activeUsersToday: 1240,
        newSignupsToday: 23,
        monthlyGrowth: 12.4,
      },
      orders: {
        totalOrders: 45789,
        ordersToday: 156,
        completedOrders: 43562,
        cancelledOrders: 2227,
        averageOrderValue: 28.45,
        orderCompletionRate: 95.1,
      },
      financial: {
        totalRevenue: 1245890.45,
        revenueToday: 4567.23,
        totalCommissions: 124589.04,
        commissionsToday: 456.72,
        averageCommissionRate: 10.5,
        monthlyRevenue: 156780.34,
      },
      delivery: {
        totalDeliveries: 43562,
        deliveriesToday: 148,
        averageDeliveryTime: 32.5,
        deliverySuccessRate: 97.8,
        activeRiders: 67,
      },
    };

    // Mock user management data
    this.users = [
      {
        id: 'customer_123',
        type: 'customer',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        status: 'active',
        joinDate: '2023-06-15T00:00:00.000Z',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        totalOrders: 45,
        totalSpent: 1284.56,
        rating: 4.8,
        verificationStatus: {
          email: true,
          phone: true,
        },
      },
      {
        id: 'restaurant_456',
        type: 'restaurant',
        name: 'Pizza Palace',
        email: 'owner@pizzapalace.com',
        phone: '+1234567891',
        status: 'active',
        joinDate: '2023-03-20T00:00:00.000Z',
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        totalOrders: 234,
        rating: 4.6,
        verificationStatus: {
          email: true,
          phone: true,
          identity: true,
          business: true,
        },
      },
    ];

    // Mock restaurant oversight data
    this.restaurants = [
      {
        id: 'rest_001',
        name: 'Pizza Palace',
        ownerId: 'restaurant_456',
        ownerName: 'Mario Rossi',
        status: 'active',
        approvalStatus: 'approved',
        cuisine: ['Italian', 'Pizza', 'Fast Food'],
        rating: 4.6,
        totalOrders: 234,
        monthlyRevenue: 12450.67,
        commissionRate: 12.5,
        joinDate: '2023-03-20T00:00:00.000Z',
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        documents: {
          businessLicense: 'approved',
          foodLicense: 'approved',
          taxCertificate: 'approved',
        },
        complianceIssues: [],
      },
    ];

    // Mock disputes
    this.disputes = [
      {
        id: 'dispute_001',
        orderId: 'ord_001',
        type: 'quality_issue',
        reportedBy: {
          id: 'customer_123',
          name: 'John Doe',
          type: 'customer',
        },
        againstParty: {
          id: 'rest_001',
          name: 'Pizza Palace',
          type: 'restaurant',
        },
        description: 'Pizza was cold and missing toppings',
        evidence: ['photo1.jpg', 'photo2.jpg'],
        status: 'under_review',
        priority: 'medium',
        assignedTo: 'admin_002',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Mock commission settings
    this.commissionSettings = {
      restaurantCommission: {
        defaultRate: 15.0,
        minimumRate: 8.0,
        maximumRate: 25.0,
        customRates: [
          { restaurantId: 'rest_001', rate: 12.5 },
        ],
      },
      deliveryCommission: {
        baseRate: 5.0,
        distanceMultiplier: 0.5,
        peakHourMultiplier: 1.5,
        minimumEarning: 3.0,
      },
      platformFees: {
        paymentProcessingFee: 2.9,
        serviceFee: 1.5,
        cancellationFee: 2.0,
      },
    };
  }

  // Get platform statistics
  getPlatformStats(): PlatformStats {
    return { ...this.platformStats };
  }

  // Get all users with filters
  getUsers(filters?: {
    type?: 'customer' | 'restaurant' | 'delivery';
    status?: 'active' | 'suspended' | 'banned' | 'pending_verification';
    limit?: number;
    search?: string;
  }): UserManagement[] {
    let filteredUsers = [...this.users];

    if (filters?.type) {
      filteredUsers = filteredUsers.filter(user => user.type === filters.type);
    }

    if (filters?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    return filters?.limit ? filteredUsers.slice(0, filters.limit) : filteredUsers;
  }

  // Get user details by ID
  getUserDetails(userId: string): UserManagement | null {
    return this.users.find(user => user.id === userId) || null;
  }

  // Update user status
  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned', reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      user.status = status;
      this.notify('user_status_updated', { userId, status, reason });

      return {
        success: true,
        message: `User status updated to ${status}`,
      };
    } catch (error) {
      console.error('Error updating user status:', error);
      return {
        success: false,
        message: 'Failed to update user status',
      };
    }
  }

  // Get restaurants with filters
  getRestaurants(filters?: {
    status?: 'active' | 'suspended' | 'pending_approval' | 'rejected';
    approvalStatus?: 'pending' | 'approved' | 'rejected' | 'under_review';
    limit?: number;
    search?: string;
  }): RestaurantOversight[] {
    let filteredRestaurants = [...this.restaurants];

    if (filters?.status) {
      filteredRestaurants = filteredRestaurants.filter(rest => rest.status === filters.status);
    }

    if (filters?.approvalStatus) {
      filteredRestaurants = filteredRestaurants.filter(rest => rest.approvalStatus === filters.approvalStatus);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(rest =>
        rest.name.toLowerCase().includes(searchTerm) ||
        rest.ownerName.toLowerCase().includes(searchTerm)
      );
    }

    return filters?.limit ? filteredRestaurants.slice(0, filters.limit) : filteredRestaurants;
  }

  // Approve/reject restaurant
  async updateRestaurantApproval(restaurantId: string, status: 'approved' | 'rejected', notes?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const restaurant = this.restaurants.find(r => r.id === restaurantId);
      if (!restaurant) {
        return { success: false, message: 'Restaurant not found' };
      }

      restaurant.approvalStatus = status;
      restaurant.status = status === 'approved' ? 'active' : 'rejected';

      this.notify('restaurant_approval_updated', { restaurantId, status, notes });

      return {
        success: true,
        message: `Restaurant ${status} successfully`,
      };
    } catch (error) {
      console.error('Error updating restaurant approval:', error);
      return {
        success: false,
        message: 'Failed to update restaurant approval',
      };
    }
  }

  // Get orders with filters
  getOrders(filters?: {
    status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
    hasIssues?: boolean;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
  }): OrderMonitoring[] {
    let filteredOrders = [...this.orders];

    if (filters?.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    if (filters?.hasIssues !== undefined) {
      filteredOrders = filteredOrders.filter(order => 
        filters.hasIssues ? order.issues.length > 0 : order.issues.length === 0
      );
    }

    if (filters?.dateFrom) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) >= new Date(filters.dateFrom!)
      );
    }

    if (filters?.dateTo) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) <= new Date(filters.dateTo!)
      );
    }

    return filters?.limit ? filteredOrders.slice(0, filters.limit) : filteredOrders;
  }

  // Get disputes
  getDisputes(filters?: {
    status?: 'open' | 'under_review' | 'resolved' | 'escalated' | 'closed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    type?: 'refund_request' | 'quality_issue' | 'delivery_problem' | 'payment_dispute' | 'rating_dispute';
    assignedTo?: string;
    limit?: number;
  }): Dispute[] {
    let filteredDisputes = [...this.disputes];

    if (filters?.status) {
      filteredDisputes = filteredDisputes.filter(dispute => dispute.status === filters.status);
    }

    if (filters?.priority) {
      filteredDisputes = filteredDisputes.filter(dispute => dispute.priority === filters.priority);
    }

    if (filters?.type) {
      filteredDisputes = filteredDisputes.filter(dispute => dispute.type === filters.type);
    }

    if (filters?.assignedTo) {
      filteredDisputes = filteredDisputes.filter(dispute => dispute.assignedTo === filters.assignedTo);
    }

    return filters?.limit ? filteredDisputes.slice(0, filters.limit) : filteredDisputes;
  }

  // Resolve dispute
  async resolveDispute(disputeId: string, resolution: string, adminId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const dispute = this.disputes.find(d => d.id === disputeId);
      if (!dispute) {
        return { success: false, message: 'Dispute not found' };
      }

      dispute.status = 'resolved';
      dispute.resolution = resolution;
      dispute.resolvedAt = new Date().toISOString();
      dispute.updatedAt = new Date().toISOString();

      this.notify('dispute_resolved', { disputeId, resolution, adminId });

      return {
        success: true,
        message: 'Dispute resolved successfully',
      };
    } catch (error) {
      console.error('Error resolving dispute:', error);
      return {
        success: false,
        message: 'Failed to resolve dispute',
      };
    }
  }

  // Get commission settings
  getCommissionSettings(): CommissionSettings {
    return { ...this.commissionSettings };
  }

  // Update commission settings
  async updateCommissionSettings(settings: Partial<CommissionSettings>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      this.commissionSettings = { ...this.commissionSettings, ...settings };
      this.notify('commission_settings_updated', settings);

      return {
        success: true,
        message: 'Commission settings updated successfully',
      };
    } catch (error) {
      console.error('Error updating commission settings:', error);
      return {
        success: false,
        message: 'Failed to update commission settings',
      };
    }
  }

  // Generate analytics report
  async generateAnalyticsReport(period: 'daily' | 'weekly' | 'monthly' | 'yearly', startDate: string, endDate: string): Promise<{
    success: boolean;
    message: string;
    report?: AnalyticsReport;
  }> {
    try {
      // Mock analytics calculation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const report: AnalyticsReport = {
        period,
        startDate,
        endDate,
        metrics: {
          userGrowth: 15.2,
          orderGrowth: 23.4,
          revenueGrowth: 18.7,
          customerRetention: 78.5,
          averageOrderValue: 28.45,
          deliveryPerformance: 92.3,
        },
        topPerformers: {
          restaurants: [
            { id: 'rest_001', name: 'Pizza Palace', revenue: 12450.67 },
            { id: 'rest_002', name: 'Burger King', revenue: 10234.89 },
          ],
          riders: [
            { id: 'rider_001', name: 'Michael Johnson', deliveries: 156, rating: 4.9 },
            { id: 'rider_002', name: 'Sarah Wilson', deliveries: 143, rating: 4.8 },
          ],
        },
        insights: [
          'Peak order times are between 12:00-14:00 and 18:00-21:00',
          'Pizza and burger restaurants have highest order volumes',
          'Customer retention improved by 12% this month',
          'Average delivery time decreased by 8% compared to last period',
        ],
      };

      return {
        success: true,
        message: 'Analytics report generated successfully',
        report,
      };
    } catch (error) {
      console.error('Error generating analytics report:', error);
      return {
        success: false,
        message: 'Failed to generate analytics report',
      };
    }
  }

  // Send platform notification
  async sendPlatformNotification(notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    targetUsers?: string[];
    targetUserTypes?: ('customer' | 'restaurant' | 'delivery')[];
  }): Promise<{
    success: boolean;
    message: string;
    recipientCount?: number;
  }> {
    try {
      let recipients = 0;

      if (notification.targetUsers) {
        recipients = notification.targetUsers.length;
      } else if (notification.targetUserTypes) {
        recipients = this.users
          .filter(user => notification.targetUserTypes!.includes(user.type))
          .length;
      } else {
        recipients = this.users.length;
      }

      // Simulate notification sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.notify('platform_notification_sent', { 
        ...notification, 
        recipientCount: recipients,
        sentAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: 'Platform notification sent successfully',
        recipientCount: recipients,
      };
    } catch (error) {
      console.error('Error sending platform notification:', error);
      return {
        success: false,
        message: 'Failed to send platform notification',
      };
    }
  }

  // Get admin activity log
  getAdminActivityLog(adminId?: string, limit = 50): {
    id: string;
    adminId: string;
    adminName: string;
    action: string;
    details: string;
    timestamp: string;
  }[] {
    // Mock admin activity log
    return [
      {
        id: 'log_001',
        adminId: 'admin_001',
        adminName: 'System Administrator',
        action: 'Restaurant Approved',
        details: 'Approved Pizza Palace restaurant application',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'log_002',
        adminId: 'admin_002',
        adminName: 'Content Moderator',
        action: 'Dispute Resolved',
        details: 'Resolved quality issue dispute #dispute_001',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ].slice(0, limit);
  }
}

// Export singleton instance
export const adminManagementService = new AdminManagementService();