/**
 * Delivery Management Service - Handles delivery rider operations
 * For delivery drivers to manage their deliveries and earnings
 */

export interface DeliveryRider {
  id: string;
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    profilePicture?: string;
  };
  vehicleInfo: {
    type: 'bicycle' | 'motorcycle' | 'car' | 'scooter';
    licensePlate?: string;
    brand?: string;
    model?: string;
    year?: number;
    color?: string;
  };
  documents: {
    driverLicense?: string;
    vehicleRegistration?: string;
    insurance?: string;
    backgroundCheck?: string;
  };
  location: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
    isLocationEnabled: boolean;
  };
  status: 'offline' | 'available' | 'busy' | 'on_delivery';
  workingHours: {
    isWorking: boolean;
    startTime?: string;
    totalHoursToday: number;
  };
  ratings: {
    average: number;
    totalRatings: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  performance: {
    completedDeliveries: number;
    cancelledDeliveries: number;
    onTimeDeliveryRate: number;
    averageDeliveryTime: number; // in minutes
  };
  earnings: {
    totalEarned: number;
    todayEarnings: number;
    weekEarnings: number;
    monthEarnings: number;
    pendingPayouts: number;
  };
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  restaurantId: string;
  customerId: string;
  restaurantInfo: {
    name: string;
    address: string;
    phone: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    deliveryInstructions?: string;
  };
  orderDetails: {
    items: {
      name: string;
      quantity: number;
    }[];
    total: number;
    paymentMethod: string;
    specialInstructions?: string;
  };
  delivery: {
    distance: number; // in km
    estimatedTime: number; // in minutes
    fee: number;
    tip?: number;
    totalPayout: number;
  };
  status: 'pending' | 'assigned' | 'accepted' | 'at_restaurant' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  timestamps: {
    created: string;
    assigned?: string;
    accepted?: string;
    arrivedAtRestaurant?: string;
    pickedUp?: string;
    delivered?: string;
    cancelled?: string;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isPreOrder: boolean;
  scheduledTime?: string;
}

export interface DeliveryEarnings {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  summary: {
    totalDeliveries: number;
    totalEarnings: number;
    averageEarningsPerDelivery: number;
    totalDistance: number;
    totalTime: number; // in minutes
    totalTips: number;
  };
  breakdown: {
    deliveryFees: number;
    tips: number;
    bonuses: number;
    promotions: number;
  };
  dailyBreakdown: {
    date: string;
    deliveries: number;
    earnings: number;
    hours: number;
  }[];
}

class DeliveryManagementService {
  private riderProfile: DeliveryRider | null = null;
  private availableRequests: DeliveryRequest[] = [];
  private activeDeliveries: DeliveryRequest[] = [];
  private deliveryHistory: DeliveryRequest[] = [];
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Subscribe to delivery management events
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

  // Initialize mock delivery rider data
  private initializeMockData(): void {
    this.riderProfile = {
      id: 'rider_001',
      userId: 'delivery_789',
      personalInfo: {
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '+1234567892',
        email: 'rider@delivery.com',
        profilePicture: 'https://example.com/rider-avatar.jpg',
      },
      vehicleInfo: {
        type: 'motorcycle',
        licensePlate: 'ABC123',
        brand: 'Honda',
        model: 'CB125F',
        year: 2022,
        color: 'Red',
      },
      documents: {
        driverLicense: 'DL123456789',
        vehicleRegistration: 'VR987654321',
        insurance: 'INS456789123',
        backgroundCheck: 'BC789123456',
      },
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        lastUpdated: new Date().toISOString(),
        isLocationEnabled: true,
      },
      status: 'available',
      workingHours: {
        isWorking: true,
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Started 4 hours ago
        totalHoursToday: 4.2,
      },
      ratings: {
        average: 4.8,
        totalRatings: 156,
        breakdown: {
          5: 120,
          4: 25,
          3: 8,
          2: 2,
          1: 1,
        },
      },
      performance: {
        completedDeliveries: 234,
        cancelledDeliveries: 3,
        onTimeDeliveryRate: 94,
        averageDeliveryTime: 18,
      },
      earnings: {
        totalEarned: 2847.50,
        todayEarnings: 127.25,
        weekEarnings: 456.75,
        monthEarnings: 1823.40,
        pendingPayouts: 89.50,
      },
      verificationStatus: 'approved',
      isActive: true,
      createdAt: '2023-02-15T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
    };

    // Mock available delivery requests
    this.availableRequests = [
      {
        id: 'delivery_001',
        orderId: 'ord_001',
        restaurantId: 'rest_001',
        customerId: 'customer_123',
        restaurantInfo: {
          name: 'Pizza Palace',
          address: '123 Main Street, New York, NY',
          phone: '+1234567891',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.0060,
          },
        },
        customerInfo: {
          name: 'John Doe',
          phone: '+1234567890',
          address: '789 Customer St, New York, NY',
          coordinates: {
            latitude: 40.7505,
            longitude: -73.9934,
          },
          deliveryInstructions: 'Ring doorbell twice, apartment 4B',
        },
        orderDetails: {
          items: [
            { name: 'Margherita Pizza (Medium)', quantity: 2 },
            { name: 'Garlic Bread', quantity: 1 },
          ],
          total: 41.56,
          paymentMethod: 'Credit Card',
          specialInstructions: 'Extra napkins please',
        },
        delivery: {
          distance: 2.3,
          estimatedTime: 15,
          fee: 4.50,
          tip: 5.00,
          totalPayout: 9.50,
        },
        status: 'pending',
        timestamps: {
          created: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        },
        priority: 'normal',
        isPreOrder: false,
      },
    ];

    this.activeDeliveries = [];
    this.deliveryHistory = [];
  }

  // Get rider profile
  getRiderProfile(): DeliveryRider | null {
    return this.riderProfile;
  }

  // Update rider profile
  async updateRiderProfile(updates: Partial<DeliveryRider>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.riderProfile) {
        return { success: false, message: 'No rider profile found' };
      }

      this.riderProfile = {
        ...this.riderProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.notify('rider_profile_updated', this.riderProfile);

      return {
        success: true,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      console.error('Error updating rider profile:', error);
      return {
        success: false,
        message: 'Failed to update profile',
      };
    }
  }

  // Update rider location
  async updateLocation(latitude: number, longitude: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.riderProfile) {
        return { success: false, message: 'No rider profile found' };
      }

      this.riderProfile.location = {
        latitude,
        longitude,
        lastUpdated: new Date().toISOString(),
        isLocationEnabled: true,
      };

      this.notify('location_updated', { latitude, longitude });

      return {
        success: true,
        message: 'Location updated successfully',
      };
    } catch (error) {
      console.error('Error updating location:', error);
      return {
        success: false,
        message: 'Failed to update location',
      };
    }
  }

  // Toggle online/offline status
  async toggleAvailabilityStatus(): Promise<{
    success: boolean;
    message: string;
    status?: DeliveryRider['status'];
  }> {
    try {
      if (!this.riderProfile) {
        return { success: false, message: 'No rider profile found' };
      }

      if (this.riderProfile.status === 'offline') {
        this.riderProfile.status = 'available';
        this.riderProfile.workingHours.isWorking = true;
        this.riderProfile.workingHours.startTime = new Date().toISOString();
      } else if (this.riderProfile.status === 'available') {
        this.riderProfile.status = 'offline';
        this.riderProfile.workingHours.isWorking = false;
        // Calculate hours worked
        if (this.riderProfile.workingHours.startTime) {
          const hoursWorked = (Date.now() - new Date(this.riderProfile.workingHours.startTime).getTime()) / (1000 * 60 * 60);
          this.riderProfile.workingHours.totalHoursToday += hoursWorked;
        }
      } else {
        return { success: false, message: 'Cannot change status while on delivery' };
      }

      this.notify('availability_status_changed', { 
        status: this.riderProfile.status,
        isWorking: this.riderProfile.workingHours.isWorking,
      });

      return {
        success: true,
        message: `Status changed to ${this.riderProfile.status}`,
        status: this.riderProfile.status,
      };
    } catch (error) {
      console.error('Error toggling availability status:', error);
      return {
        success: false,
        message: 'Failed to update status',
      };
    }
  }

  // Get available delivery requests
  getAvailableRequests(): DeliveryRequest[] {
    return [...this.availableRequests];
  }

  // Get active deliveries
  getActiveDeliveries(): DeliveryRequest[] {
    return [...this.activeDeliveries];
  }

  // Accept delivery request
  async acceptDeliveryRequest(requestId: string): Promise<{
    success: boolean;
    message: string;
    delivery?: DeliveryRequest;
  }> {
    try {
      const requestIndex = this.availableRequests.findIndex(req => req.id === requestId);
      if (requestIndex === -1) {
        return { success: false, message: 'Delivery request not found' };
      }

      if (!this.riderProfile || this.riderProfile.status !== 'available') {
        return { success: false, message: 'Rider not available for deliveries' };
      }

      const delivery = this.availableRequests[requestIndex];
      delivery.status = 'accepted';
      delivery.timestamps.accepted = new Date().toISOString();

      // Move from available to active
      this.availableRequests.splice(requestIndex, 1);
      this.activeDeliveries.push(delivery);

      // Update rider status
      this.riderProfile.status = 'busy';

      this.notify('delivery_accepted', delivery);

      return {
        success: true,
        message: 'Delivery request accepted successfully',
        delivery,
      };
    } catch (error) {
      console.error('Error accepting delivery request:', error);
      return {
        success: false,
        message: 'Failed to accept delivery request',
      };
    }
  }

  // Decline delivery request
  async declineDeliveryRequest(requestId: string, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const requestIndex = this.availableRequests.findIndex(req => req.id === requestId);
      if (requestIndex === -1) {
        return { success: false, message: 'Delivery request not found' };
      }

      const delivery = this.availableRequests.splice(requestIndex, 1)[0];
      this.notify('delivery_declined', { deliveryId: requestId, reason });

      return {
        success: true,
        message: 'Delivery request declined',
      };
    } catch (error) {
      console.error('Error declining delivery request:', error);
      return {
        success: false,
        message: 'Failed to decline delivery request',
      };
    }
  }

  // Update delivery status
  async updateDeliveryStatus(deliveryId: string, status: DeliveryRequest['status']): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const delivery = this.activeDeliveries.find(d => d.id === deliveryId);
      if (!delivery) {
        return { success: false, message: 'Active delivery not found' };
      }

      const previousStatus = delivery.status;
      delivery.status = status;

      // Update timestamps
      const now = new Date().toISOString();
      switch (status) {
        case 'at_restaurant':
          delivery.timestamps.arrivedAtRestaurant = now;
          break;
        case 'picked_up':
          delivery.timestamps.pickedUp = now;
          if (this.riderProfile) {
            this.riderProfile.status = 'on_delivery';
          }
          break;
        case 'delivered':
          delivery.timestamps.delivered = now;
          this.completeDelivery(deliveryId);
          break;
        case 'cancelled':
          delivery.timestamps.cancelled = now;
          this.cancelDelivery(deliveryId);
          break;
      }

      this.notify('delivery_status_updated', { 
        deliveryId, 
        status, 
        previousStatus,
        timestamps: delivery.timestamps,
      });

      return {
        success: true,
        message: `Delivery status updated to ${status}`,
      };
    } catch (error) {
      console.error('Error updating delivery status:', error);
      return {
        success: false,
        message: 'Failed to update delivery status',
      };
    }
  }

  // Complete delivery
  private completeDelivery(deliveryId: string): void {
    const deliveryIndex = this.activeDeliveries.findIndex(d => d.id === deliveryId);
    if (deliveryIndex === -1) return;

    const delivery = this.activeDeliveries.splice(deliveryIndex, 1)[0];
    this.deliveryHistory.unshift(delivery);

    // Update rider earnings and performance
    if (this.riderProfile) {
      this.riderProfile.earnings.todayEarnings += delivery.delivery.totalPayout;
      this.riderProfile.earnings.weekEarnings += delivery.delivery.totalPayout;
      this.riderProfile.earnings.monthEarnings += delivery.delivery.totalPayout;
      this.riderProfile.earnings.totalEarned += delivery.delivery.totalPayout;
      this.riderProfile.performance.completedDeliveries++;

      // Update status back to available if no more active deliveries
      if (this.activeDeliveries.length === 0) {
        this.riderProfile.status = 'available';
      }
    }

    this.notify('delivery_completed', { delivery, earnings: delivery.delivery.totalPayout });
  }

  // Cancel delivery
  private cancelDelivery(deliveryId: string): void {
    const deliveryIndex = this.activeDeliveries.findIndex(d => d.id === deliveryId);
    if (deliveryIndex === -1) return;

    const delivery = this.activeDeliveries.splice(deliveryIndex, 1)[0];
    this.deliveryHistory.unshift(delivery);

    // Update rider performance
    if (this.riderProfile) {
      this.riderProfile.performance.cancelledDeliveries++;

      // Update status back to available if no more active deliveries
      if (this.activeDeliveries.length === 0) {
        this.riderProfile.status = 'available';
      }
    }

    this.notify('delivery_cancelled', { delivery });
  }

  // Get delivery history
  getDeliveryHistory(limit?: number): DeliveryRequest[] {
    const history = [...this.deliveryHistory];
    return limit ? history.slice(0, limit) : history;
  }

  // Get earnings for a period
  async getEarnings(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<DeliveryEarnings | null> {
    try {
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'daily':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const periodDeliveries = this.deliveryHistory.filter(delivery => 
        delivery.status === 'delivered' &&
        new Date(delivery.timestamps.delivered!) >= startDate
      );

      const totalEarnings = periodDeliveries.reduce((sum, delivery) => sum + delivery.delivery.totalPayout, 0);
      const totalTips = periodDeliveries.reduce((sum, delivery) => sum + (delivery.delivery.tip || 0), 0);
      const totalDistance = periodDeliveries.reduce((sum, delivery) => sum + delivery.delivery.distance, 0);

      const earnings: DeliveryEarnings = {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        summary: {
          totalDeliveries: periodDeliveries.length,
          totalEarnings,
          averageEarningsPerDelivery: periodDeliveries.length > 0 ? totalEarnings / periodDeliveries.length : 0,
          totalDistance,
          totalTime: periodDeliveries.length * 20, // Mock: 20 minutes average
          totalTips,
        },
        breakdown: {
          deliveryFees: totalEarnings - totalTips,
          tips: totalTips,
          bonuses: 0,
          promotions: 0,
        },
        dailyBreakdown: [], // Mock daily data
      };

      return earnings;
    } catch (error) {
      console.error('Error getting earnings:', error);
      return null;
    }
  }

  // Get daily statistics
  getDailyStats(): {
    deliveriesCompleted: number;
    hoursWorked: number;
    earningsToday: number;
    averageDeliveryTime: number;
    currentStatus: string;
  } {
    return {
      deliveriesCompleted: this.deliveryHistory.filter(d => 
        d.status === 'delivered' && 
        new Date(d.timestamps.delivered!).toDateString() === new Date().toDateString()
      ).length,
      hoursWorked: this.riderProfile?.workingHours.totalHoursToday || 0,
      earningsToday: this.riderProfile?.earnings.todayEarnings || 0,
      averageDeliveryTime: this.riderProfile?.performance.averageDeliveryTime || 0,
      currentStatus: this.riderProfile?.status || 'offline',
    };
  }

  // Simulate new delivery request
  simulateNewDeliveryRequest(): void {
    const mockRequest: DeliveryRequest = {
      id: `delivery_${Date.now()}`,
      orderId: `ord_${Date.now()}`,
      restaurantId: 'rest_001',
      customerId: `customer_${Math.random().toString(36).substr(2, 9)}`,
      restaurantInfo: {
        name: 'Pizza Palace',
        address: '123 Main Street, New York, NY',
        phone: '+1234567891',
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
      },
      customerInfo: {
        name: 'Customer',
        phone: '+1234567890',
        address: 'Random Address, New York, NY',
        coordinates: { 
          latitude: 40.7128 + (Math.random() - 0.5) * 0.02, 
          longitude: -74.0060 + (Math.random() - 0.5) * 0.02,
        },
      },
      orderDetails: {
        items: [{ name: 'Pizza', quantity: 1 }],
        total: 25.99,
        paymentMethod: 'Credit Card',
      },
      delivery: {
        distance: Math.random() * 5 + 1,
        estimatedTime: Math.floor(Math.random() * 20) + 10,
        fee: Math.random() * 3 + 2,
        tip: Math.random() * 5,
        totalPayout: Math.random() * 8 + 4,
      },
      status: 'pending',
      timestamps: {
        created: new Date().toISOString(),
      },
      priority: 'normal',
      isPreOrder: false,
    };

    this.availableRequests.push(mockRequest);
    this.notify('new_delivery_request', mockRequest);
  }
}

// Export singleton instance
export const deliveryManagementService = new DeliveryManagementService();