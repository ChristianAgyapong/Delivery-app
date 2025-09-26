import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/design';

// Mock data for orders
const orders = [
  {
    id: '1',
    restaurant: 'Tony\'s Pizza Palace',
    status: 'delivering',
    orderTime: '2:30 PM',
    estimatedDelivery: '3:15 PM',
    items: ['Margherita Pizza', 'Caesar Salad'],
    total: 28.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&w=200',
  },
  {
    id: '2',
    restaurant: 'Burger Junction',
    status: 'delivered',
    orderTime: 'Yesterday 7:45 PM',
    deliveredTime: 'Yesterday 8:30 PM',
    items: ['Chicken Burger', 'Fries', 'Coke'],
    total: 19.50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&w=200',
  },
  {
    id: '3',
    restaurant: 'Sakura Sushi',
    status: 'delivered',
    orderTime: '3 days ago',
    deliveredTime: '3 days ago',
    items: ['California Roll', 'Salmon Sashimi', 'Miso Soup'],
    total: 34.75,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&w=200',
  },
];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('ongoing');

  const ongoingOrders = orders.filter(order => order.status === 'delivering' || order.status === 'preparing');
  const pastOrders = orders.filter(order => order.status === 'delivered' || order.status === 'cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#FFA500';
      case 'delivering': return '#4ECDC4';
      case 'delivered': return '#32CD32';
      case 'cancelled': return '#FF4444';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Preparing';
      case 'delivering': return 'On the way';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Image source={{ uri: item.image }} style={styles.restaurantImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{item.restaurant}</Text>
          <Text style={styles.orderTime}>Ordered at {item.orderTime}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        <Text style={styles.orderTotal}>${item.total}</Text>
      </View>

      {item.status === 'delivering' && (
        <View style={styles.trackingContainer}>
          <View style={styles.trackingInfo}>
            <Ionicons name="time" size={16} color={Colors.primary} />
            <Text style={styles.estimatedTime}>Estimated: {item.estimatedDelivery}</Text>
          </View>
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Track Order</Text>
            <Ionicons name="location" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.itemsList}>
        <Text style={styles.itemsLabel}>Items:</Text>
        {item.items.map((itemName: string, index: number) => (
          <Text key={index} style={styles.itemText}>• {itemName}</Text>
        ))}
      </View>

      <View style={styles.orderActions}>
        {item.status === 'delivered' && (
          <>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Rate Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Reorder</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'delivering' && (
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const currentOrders = activeTab === 'ongoing' ? ongoingOrders : pastOrders;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
            Ongoing ({ongoingOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History ({pastOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {currentOrders.length > 0 ? (
        <FlatList
          data={currentOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ordersList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>
            {activeTab === 'ongoing' ? 'No ongoing orders' : 'No order history'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'ongoing' 
              ? 'Start browsing and place your first order!' 
              : 'Your past orders will appear here'
            }
          </Text>
          {activeTab === 'ongoing' && (
            <TouchableOpacity style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse Restaurants</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  trackingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimatedTime: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
    fontWeight: '500',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  itemsList: {
    marginBottom: 15,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: '#FF4444',
  },
  cancelButtonText: {
    color: '#FF4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});