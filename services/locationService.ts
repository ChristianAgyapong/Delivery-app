/**
 * Location Service - Handles user location and delivery addresses
 */

export interface DeliveryAddress {
  id: string;
  label: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
  details?: {
    apartment?: string;
    floor?: string;
    building?: string;
    instructions?: string;
  };
}

export interface LocationPermission {
  granted: boolean;
  accuracy: 'high' | 'low' | 'denied';
  timestamp: number;
}

class LocationService {
  private currentLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
  } | null = null;

  private addresses: DeliveryAddress[] = [];
  private selectedAddressId: string | null = null;
  private locationPermission: LocationPermission | null = null;
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Subscribe to location service events
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

  // Initialize mock location data
  private initializeMockData(): void {
    this.addresses = [
      {
        id: 'addr1',
        label: 'Home',
        address: '123 Main Street, Apartment 4B, New York, NY 10001',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
        isDefault: true,
        type: 'home',
        details: {
          apartment: '4B',
          floor: '4th',
          instructions: 'Ring doorbell twice',
        },
      },
      {
        id: 'addr2',
        label: 'Work',
        address: '456 Business Plaza, Suite 201, New York, NY 10005',
        coordinates: {
          latitude: 40.7589,
          longitude: -73.9851,
        },
        isDefault: false,
        type: 'work',
        details: {
          building: 'Business Plaza',
          floor: '2nd',
          instructions: 'Call when arrived - front desk reception',
        },
      },
    ];

    // Set default selected address
    const defaultAddr = this.addresses.find(addr => addr.isDefault);
    if (defaultAddr) {
      this.selectedAddressId = defaultAddr.id;
    }

    // Mock current location
    this.currentLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 10,
      timestamp: Date.now(),
    };

    // Mock location permission
    this.locationPermission = {
      granted: true,
      accuracy: 'high',
      timestamp: Date.now(),
    };
  }

  // Get current location
  async getCurrentLocation(highAccuracy: boolean = true): Promise<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null> {
    try {
      // Check permission first
      if (!this.locationPermission?.granted) {
        throw new Error('Location permission not granted');
      }

      // In a real app, this would use actual geolocation API
      // For now, return mock data with some variation
      const mockLocation = {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
        accuracy: highAccuracy ? Math.random() * 10 + 5 : Math.random() * 50 + 20,
      };

      this.currentLocation = {
        ...mockLocation,
        timestamp: Date.now(),
      };

      this.notify('location_updated', mockLocation);
      return mockLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  // Request location permission
  async requestLocationPermission(): Promise<LocationPermission> {
    try {
      // In a real app, this would request actual permission
      // For now, simulate permission grant
      this.locationPermission = {
        granted: true,
        accuracy: 'high',
        timestamp: Date.now(),
      };

      this.notify('permission_granted', this.locationPermission);
      return this.locationPermission;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      this.locationPermission = {
        granted: false,
        accuracy: 'denied',
        timestamp: Date.now(),
      };
      return this.locationPermission;
    }
  }

  // Get location permission status
  getLocationPermission(): LocationPermission | null {
    return this.locationPermission;
  }

  // Get all saved addresses
  getSavedAddresses(): DeliveryAddress[] {
    return [...this.addresses];
  }

  // Get address by ID
  getAddressById(id: string): DeliveryAddress | null {
    return this.addresses.find(addr => addr.id === id) || null;
  }

  // Get selected address
  getSelectedAddress(): DeliveryAddress | null {
    if (!this.selectedAddressId) return null;
    return this.getAddressById(this.selectedAddressId);
  }

  // Set selected address
  setSelectedAddress(addressId: string): boolean {
    const address = this.getAddressById(addressId);
    if (!address) return false;

    this.selectedAddressId = addressId;
    this.notify('address_selected', address);
    return true;
  }

  // Add new address
  addAddress(address: Omit<DeliveryAddress, 'id'>): string {
    const newAddress: DeliveryAddress = {
      ...address,
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // If this is marked as default, unset other defaults
    if (newAddress.isDefault) {
      this.addresses.forEach(addr => addr.isDefault = false);
    }

    // If this is the first address, make it default
    if (this.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    this.addresses.push(newAddress);

    // If this is default, select it
    if (newAddress.isDefault) {
      this.selectedAddressId = newAddress.id;
    }

    this.notify('address_added', newAddress);
    return newAddress.id;
  }

  // Update address
  updateAddress(id: string, updates: Partial<Omit<DeliveryAddress, 'id'>>): boolean {
    const index = this.addresses.findIndex(addr => addr.id === id);
    if (index === -1) return false;

    // Handle default address logic
    if (updates.isDefault) {
      this.addresses.forEach(addr => addr.isDefault = false);
    }

    this.addresses[index] = { ...this.addresses[index], ...updates };

    // If this became default, select it
    if (updates.isDefault) {
      this.selectedAddressId = id;
    }

    this.notify('address_updated', { id, updates });
    return true;
  }

  // Delete address
  deleteAddress(id: string): boolean {
    const index = this.addresses.findIndex(addr => addr.id === id);
    if (index === -1) return false;

    const address = this.addresses[index];
    this.addresses.splice(index, 1);

    // If this was selected, select another default
    if (this.selectedAddressId === id) {
      const defaultAddr = this.addresses.find(addr => addr.isDefault);
      this.selectedAddressId = defaultAddr ? defaultAddr.id : (this.addresses[0]?.id || null);
    }

    // If this was default and there are other addresses, make first one default
    if (address.isDefault && this.addresses.length > 0) {
      this.addresses[0].isDefault = true;
      this.selectedAddressId = this.addresses[0].id;
    }

    this.notify('address_deleted', { id, address });
    return true;
  }

  // Set default address
  setDefaultAddress(id: string): boolean {
    const address = this.getAddressById(id);
    if (!address) return false;

    // Unset all defaults
    this.addresses.forEach(addr => addr.isDefault = false);
    
    // Set new default
    address.isDefault = true;
    this.selectedAddressId = id;

    this.notify('default_address_changed', address);
    return true;
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get distance to restaurant
  getDistanceToRestaurant(restaurantLat: number, restaurantLon: number): number | null {
    const selectedAddress = this.getSelectedAddress();
    if (!selectedAddress) return null;

    return this.calculateDistance(
      selectedAddress.coordinates.latitude,
      selectedAddress.coordinates.longitude,
      restaurantLat,
      restaurantLon
    );
  }

  // Check if address is in delivery area
  isInDeliveryArea(
    addressLat: number,
    addressLon: number,
    restaurantLat: number,
    restaurantLon: number,
    maxDistance: number = 10
  ): boolean {
    const distance = this.calculateDistance(addressLat, addressLon, restaurantLat, restaurantLon);
    return distance <= maxDistance;
  }

  // Get suggested addresses based on current location
  async getSuggestedAddresses(): Promise<DeliveryAddress[]> {
    try {
      // In a real app, this would call a geocoding API
      // For now, return mock suggestions
      const mockSuggestions: DeliveryAddress[] = [
        {
          id: 'suggest1',
          label: 'Current Location',
          address: 'Near you - Tap to set exact address',
          coordinates: {
            latitude: this.currentLocation?.latitude || 40.7128,
            longitude: this.currentLocation?.longitude || -74.0060,
          },
          isDefault: false,
          type: 'other',
        },
      ];

      return mockSuggestions;
    } catch (error) {
      console.error('Error getting suggested addresses:', error);
      return [];
    }
  }

  // Geocode address string to coordinates
  async geocodeAddress(addressString: string): Promise<{
    latitude: number;
    longitude: number;
    formattedAddress: string;
  } | null> {
    try {
      // In a real app, this would call a geocoding API
      // For now, return mock coordinates with some variation
      const mockResult = {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
        formattedAddress: addressString,
      };

      return mockResult;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocodeLocation(latitude: number, longitude: number): Promise<string | null> {
    try {
      // In a real app, this would call a reverse geocoding API
      // For now, return mock address
      const mockAddress = `${Math.floor(Math.random() * 9999) + 1} Mock Street, New York, NY 10001`;
      return mockAddress;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    this.addresses = [];
    this.selectedAddressId = null;
    this.currentLocation = null;
    this.locationPermission = null;
    this.notify('data_cleared');
  }
}

// Export singleton instance
export const locationService = new LocationService();