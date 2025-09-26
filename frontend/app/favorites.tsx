import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock favorites data
const favoriteRestaurants = [
  {
    id: '1',
    name: 'Tony\'s Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&w=400',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    cuisine: 'Italian',
    lastOrdered: '2 days ago',
  },
  {
    id: '3',
    name: 'Sakura Sushi',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&w=400',
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    cuisine: 'Japanese',
    lastOrdered: '1 week ago',
  },
];

const favoriteItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    restaurant: 'Tony\'s Pizza Palace',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&w=300',
    orderCount: 5,
  },
  {
    id: '2',
    name: 'California Roll',
    restaurant: 'Sakura Sushi',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&w=300',
    orderCount: 3,
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [favorites, setFavorites] = useState({
    restaurants: favoriteRestaurants,
    items: favoriteItems,
  });

  const removeFavorite = (id: string, type: 'restaurants' | 'items') => {
    setFavorites(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const renderRestaurant = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.favoriteCard}
      onPress={() => router.push(`/restaurant/${item.id}` as any)}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <TouchableOpacity 
            onPress={() => removeFavorite(item.id, 'restaurants')}
            style={styles.favoriteButton}
          >
            <Ionicons name="heart" size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.cuisineType}>{item.cuisine}</Text>
        <Text style={styles.lastOrdered}>Last ordered: {item.lastOrdered}</Text>
        
        <View style={styles.restaurantDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          <Text style={styles.deliveryFee}>${item.deliveryFee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.favoriteCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity 
            onPress={() => removeFavorite(item.id, 'items')}
            style={styles.favoriteButton}
          >
            <Ionicons name="heart" size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.restaurantName}>{item.restaurant}</Text>
        <Text style={styles.orderCount}>Ordered {item.orderCount} times</Text>
        
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const currentData = activeTab === 'restaurants' ? favorites.restaurants : favorites.items;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
            Restaurants ({favorites.restaurants.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <Text style={[styles.tabText, activeTab === 'items' && styles.activeTabText]}>
            Items ({favorites.items.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Favorites List */}
      {currentData.length > 0 ? (
        <FlatList
          data={currentData}
          renderItem={activeTab === 'restaurants' ? renderRestaurant : renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={activeTab === 'restaurants' ? 'restaurant-outline' : 'heart-outline'} 
            size={80} 
            color="#ccc" 
          />
          <Text style={styles.emptyTitle}>
            No favorite {activeTab} yet
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'restaurants' 
              ? 'Add restaurants to your favorites to see them here'
              : 'Add items to your favorites to see them here'
            }
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/home' as any)}
          >
            <Text style={styles.browseButtonText}>Browse Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Actions */}
      {currentData.length > 0 && (
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={20} color="#FF6B35" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="refresh" size={20} color="#FF6B35" />
            <Text style={styles.actionButtonText}>Refresh</Text>
          </TouchableOpacity>
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
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
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
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: 100,
    height: 120,
  },
  itemImage: {
    width: 80,
    height: 80,
    margin: 12,
    borderRadius: 8,
  },
  restaurantInfo: {
    flex: 1,
    padding: 16,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    padding: 4,
  },
  cuisineType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lastOrdered: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  orderCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#666',
  },
  deliveryFee: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  browseButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  actionButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});