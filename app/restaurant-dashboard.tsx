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
  restaurantManagementService,
  RestaurantOrder,
  RestaurantProfile,
} from '../services';

export default function RestaurantDashboardScreen() {
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = authService.isUserAuthenticated();
    const user = authService.getCurrentUser();
    
    if (!isAuthenticated || !user) {
      router.replace('/(auth)/login');
      return;
    }

    if (user.role !== 'restaurant') {
      Alert.alert('Access Denied', 'This dashboard is only accessible to restaurants.');
      router.replace('/');
      return;
    }

    loadDashboardData();
    
    // Subscribe to order updates
    const unsubscribe = restaurantManagementService.subscribe((event, data) => {
      if (event === 'new_order' || event === 'order_updated') {
        loadOrders();
      }
    });

    return unsubscribe;
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const restaurantProfile = restaurantManagementService.getRestaurantProfile();
      const pendingOrders = restaurantManagementService.getOrders('new');
      
      setProfile(restaurantProfile);
      setOrders(pendingOrders);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const pendingOrders = restaurantManagementService.getOrders('new');
      setOrders(pendingOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const result = await restaurantManagementService.acceptOrder(orderId);
      if (result.success) {
        Alert.alert('Success', 'Order accepted successfully');
        loadOrders();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    Alert.alert(
      'Reject Order',
      'Are you sure you want to reject this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await restaurantManagementService.rejectOrder(orderId, 'Restaurant unavailable');
              if (result.success) {
                Alert.alert('Success', 'Order rejected');
                loadOrders();
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error rejecting order:', error);
              Alert.alert('Error', 'Failed to reject order');
            }
          },
        },
      ]
    );
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
      <LinearGradient colors={Gradients.restaurant} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Dashboard...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Gradients.restaurant} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.restaurantName}>{profile?.businessName || 'Restaurant'}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => router.push('/restaurant-profile' as any)}
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
              <Ionicons name="restaurant" size={24} color="#FF5722" />
              <Text style={styles.statNumber}>{orders.length}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="cash" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>
                ${orders.reduce((sum, order) => sum + order.pricing.restaurantEarnings, 0).toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Monthly Revenue</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.statNumber}>{profile?.rating?.average?.toFixed(1) || '0.0'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="restaurant-outline" size={24} color="#FFF" />
                <Text style={styles.actionText}>Menu Management</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="analytics-outline" size={24} color="#FFF" />
                <Text style={styles.actionText}>Analytics</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="settings-outline" size={24} color="#FFF" />
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pending Orders */}
          <View style={styles.ordersSection}>
            <Text style={styles.sectionTitle}>Pending Orders ({orders.length})</Text>
            
            {orders.length === 0 ? (
              <View style={styles.noOrdersContainer}>
                <Ionicons name="receipt-outline" size={48} color="#999" />
                <Text style={styles.noOrdersText}>No pending orders</Text>
              </View>
            ) : (
              orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>Order #{order.id.slice(-6)}</Text>
                    <Text style={styles.orderTime}>
                      {new Date(order.timestamps.ordered).toLocaleTimeString()}
                    </Text>
                  </View>
                  
                  <Text style={styles.customerName}>{order.customerInfo.name}</Text>
                  
                  <View style={styles.orderItems}>
                    {order.items.slice(0, 2).map((item, index) => (
                      <Text key={index} style={styles.orderItem}>
                        {item.quantity}x {item.name}
                      </Text>
                    ))}
                    {order.items.length > 2 && (
                      <Text style={styles.moreItems}>
                        +{order.items.length - 2} more items
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>${order.pricing.total.toFixed(2)}</Text>
                    <View style={styles.orderActions}>
                      <TouchableOpacity
                        style={[styles.orderActionButton, styles.rejectButton]}
                        onPress={() => handleRejectOrder(order.id)}
                      >
                        <Text style={styles.orderActionText}>Reject</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.orderActionButton, styles.acceptButton]}
                        onPress={() => handleAcceptOrder(order.id)}
                      >
                        <Text style={styles.orderActionText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
  restaurantName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
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
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FF5722',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  ordersSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noOrdersContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginTop: 10,
  },
  noOrdersText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
  },
  customerName: {
    fontSize: 16,
    color: '#FF5722',
    fontWeight: '600',
    marginBottom: 10,
  },
  orderItems: {
    marginBottom: 15,
  },
  orderItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  orderActions: {
    flexDirection: 'row',
  },
  orderActionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  orderActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});