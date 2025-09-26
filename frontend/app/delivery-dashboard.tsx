import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gradients } from '../constants/design';
import {
  authService,
  deliveryManagementService,
  DeliveryRequest,
  DeliveryRider,
} from '../services';

export default function DeliveryDashboardScreen() {
  const [profile, setProfile] = useState<DeliveryRider | null>(null);
  const [activeRequest, setActiveRequest] = useState<DeliveryRequest | null>(null);
  const [availableRequests, setAvailableRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = authService.isUserAuthenticated();
    const user = authService.getCurrentUser();
    
    if (!isAuthenticated || !user) {
      router.replace('/(auth)/login');
      return;
    }

    if (user.role !== 'delivery') {
      Alert.alert('Access Denied', 'This dashboard is only accessible to delivery riders.');
      router.replace('/');
      return;
    }

    loadDashboardData();
    
    // Subscribe to delivery updates
    const unsubscribe = deliveryManagementService.subscribe((event, data) => {
      if (event === 'new_delivery_request') {
        loadAvailableRequests();
      } else if (event === 'delivery_assigned' || event === 'delivery_completed') {
        loadDashboardData();
      }
    });

    return unsubscribe;
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const riderProfile = deliveryManagementService.getRiderProfile();
      const currentRequest = deliveryManagementService.getActiveDeliveries()[0] || null;
      const requests = deliveryManagementService.getAvailableRequests();
      
      setProfile(riderProfile);
      setActiveRequest(currentRequest);
      setAvailableRequests(requests);
      setIsOnline(riderProfile?.status === 'available');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRequests = async () => {
    try {
      const requests = deliveryManagementService.getAvailableRequests();
      setAvailableRequests(requests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleToggleOnlineStatus = async () => {
    try {
      const newStatus = isOnline ? 'offline' : 'available';
      const result = await deliveryManagementService.updateRiderProfile({ status: newStatus });
      
      if (result.success) {
        setIsOnline(!isOnline);
        Alert.alert(
          'Status Updated',
          `You are now ${newStatus}. ${newStatus === 'available' ? 'You will receive delivery requests.' : 'You will not receive new requests.'}`
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const result = await deliveryManagementService.acceptDeliveryRequest(requestId);
      if (result.success) {
        Alert.alert('Success', 'Delivery request accepted!');
        loadDashboardData();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleUpdateDeliveryStatus = async (status: DeliveryRequest['status']) => {
    if (!activeRequest) return;

    try {
      const result = await deliveryManagementService.updateDeliveryStatus(activeRequest.id, status);
      if (result.success) {
        Alert.alert('Success', `Status updated to ${status}`);
        loadDashboardData();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            authService.logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={Gradients.delivery} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Dashboard...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Gradients.delivery} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.riderName}>{profile ? `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}` : 'Rider'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.statusButton, isOnline ? styles.onlineButton : styles.offlineButton]}
              onPress={handleToggleOnlineStatus}
            >
              <Ionicons
                name={isOnline ? 'radio-button-on' : 'radio-button-off'}
                size={16}
                color="#FFF"
              />
              <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => router.push('/delivery-profile' as any)}
            >
              <Ionicons name="person-outline" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="bicycle" size={24} color="#2196F3" />
              <Text style={styles.statNumber}>{profile?.performance.completedDeliveries || 0}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="cash" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>
                ${profile?.earnings?.totalEarned?.toFixed(0) || '0'}
              </Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.statNumber}>{profile?.ratings?.average?.toFixed(1) || '0.0'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Active Delivery */}
          {activeRequest && (
            <View style={styles.activeDeliverySection}>
              <Text style={styles.sectionTitle}>Active Delivery</Text>
              <View style={styles.activeDeliveryCard}>
                <View style={styles.deliveryHeader}>
                  <Text style={styles.deliveryId}>#{activeRequest.id.slice(-6)}</Text>
                  <View style={[styles.statusBadge, getStatusColor(activeRequest.status)]}>
                    <Text style={styles.statusText}>{activeRequest.status.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.deliveryInfo}>
                  <View style={styles.locationInfo}>
                    <Ionicons name="restaurant" size={16} color="#666" />
                    <Text style={styles.locationText}>{activeRequest.restaurantInfo.name}</Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Ionicons name="home" size={16} color="#666" />
                    <Text style={styles.locationText}>{activeRequest.customerInfo.address}</Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Ionicons name="cash" size={16} color="#4CAF50" />
                    <Text style={styles.locationText}>${activeRequest.orderDetails.total.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.deliveryActions}>
                  {activeRequest.status === 'assigned' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                      onPress={() => handleUpdateDeliveryStatus('picked_up')}
                    >
                      <Text style={styles.actionButtonText}>Picked Up</Text>
                    </TouchableOpacity>
                  )}
                  {activeRequest.status === 'picked_up' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                      onPress={() => handleUpdateDeliveryStatus('delivered')}
                    >
                      <Text style={styles.actionButtonText}>Mark Delivered</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Available Requests */}
          {!activeRequest && (
            <View style={styles.requestsSection}>
              <Text style={styles.sectionTitle}>
                Available Requests ({availableRequests.length})
              </Text>
              
              {!isOnline ? (
                <View style={styles.offlineMessage}>
                  <Ionicons name="information-circle" size={24} color="#FF9800" />
                  <Text style={styles.offlineText}>
                    Go online to receive delivery requests
                  </Text>
                </View>
              ) : availableRequests.length === 0 ? (
                <View style={styles.noRequestsContainer}>
                  <Ionicons name="bicycle-outline" size={48} color="#999" />
                  <Text style={styles.noRequestsText}>No delivery requests available</Text>
                </View>
              ) : (
                availableRequests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    <View style={styles.requestHeader}>
                      <Text style={styles.requestId}>#{request.id.slice(-6)}</Text>
                      <Text style={styles.requestDistance}>
                        {request.delivery.distance.toFixed(1)} km
                      </Text>
                    </View>

                    <View style={styles.requestInfo}>
                      <View style={styles.locationInfo}>
                        <Ionicons name="restaurant" size={16} color="#666" />
                        <Text style={styles.locationText}>{request.restaurantInfo.name}</Text>
                      </View>
                      <View style={styles.locationInfo}>
                        <Ionicons name="home" size={16} color="#666" />
                        <Text style={styles.locationText} numberOfLines={1}>
                          {request.customerInfo.address}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.requestFooter}>
                      <Text style={styles.requestEarning}>
                        Earn: ${request.delivery.totalPayout.toFixed(2)}
                      </Text>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAcceptRequest(request.id)}
                      >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const getStatusColor = (status: DeliveryRequest['status']) => {
  switch (status) {
    case 'assigned':
      return { backgroundColor: '#FF9800' };
    case 'picked_up':
      return { backgroundColor: '#2196F3' };
    case 'delivered':
      return { backgroundColor: '#4CAF50' };
    default:
      return { backgroundColor: '#666' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  riderName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  onlineButton: {
    backgroundColor: '#4CAF50',
  },
  offlineButton: {
    backgroundColor: '#666',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  profileButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginRight: 10,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activeDeliverySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activeDeliveryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  deliveryId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryInfo: {
    marginBottom: 15,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  requestsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  offlineMessage: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  offlineText: {
    fontSize: 16,
    color: '#FF9800',
    marginLeft: 10,
    flex: 1,
  },
  noRequestsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  noRequestsText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  requestDistance: {
    fontSize: 14,
    color: '#666',
  },
  requestInfo: {
    marginBottom: 15,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestEarning: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  acceptButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});