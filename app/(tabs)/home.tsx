import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/design';
import { authService } from '../../services';

const { width } = Dimensions.get('window');

// Mock data
const categories = [
  { id: '1', name: 'Pizza', icon: 'pizza-outline', color: '#FF6B35' },
  { id: '2', name: 'Burger', icon: 'fast-food-outline', color: '#4ECDC4' },
  { id: '3', name: 'Sushi', icon: 'fish-outline', color: '#45B7D1' },
  { id: '4', name: 'Italian', icon: 'restaurant-outline', color: '#FFA07A' },
  { id: '5', name: 'Chinese', icon: 'leaf-outline', color: '#FF69B4' },
  { id: '6', name: 'Dessert', icon: 'ice-cream-outline', color: '#DDA0DD' },
];

const restaurants = [
  {
    id: '1',
    name: 'Tony\'s Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&w=400',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    cuisine: 'Italian',
    promoted: true,
    discount: 25,
    isNew: false,
    isTrending: true,
  },
  {
    id: '2',
    name: 'Burger Junction',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&w=400',
    rating: 4.2,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    cuisine: 'American',
    promoted: false,
    discount: 0,
    isNew: true,
    isTrending: false,
  },
  {
    id: '3',
    name: 'Sakura Sushi',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&w=400',
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    cuisine: 'Japanese',
    promoted: true,
    discount: 15,
    isNew: false,
    isTrending: true,
  },
  {
    id: '4',
    name: 'Pasta Corner',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&w=400',
    rating: 4.3,
    deliveryTime: '25-35 min',
    deliveryFee: 2.49,
    cuisine: 'Italian',
    promoted: false,
    discount: 10,
    isNew: false,
    isTrending: false,
  },
  {
    id: '5',
    name: 'Healthy Bowls',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&w=400',
    rating: 4.6,
    deliveryTime: '15-25 min',
    deliveryFee: 1.49,
    cuisine: 'Healthy',
    promoted: false,
    discount: 20,
    isNew: true,
    isTrending: true,
  },
  {
    id: '6',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&w=400',
    rating: 4.4,
    deliveryTime: '35-45 min',
    deliveryFee: 3.49,
    cuisine: 'Indian',
    promoted: true,
    discount: 30,
    isNew: false,
    isTrending: true,
  },
];

const quickActions = [
  { 
    id: '1', 
    title: 'Reorder', 
    icon: 'repeat', 
    color: '#4ECDC4',
    description: 'Order again from your recent orders',
    badge: null
  },
  { 
    id: '2', 
    title: 'Schedule', 
    icon: 'time', 
    color: '#45B7D1',
    description: 'Plan your meals ahead',
    badge: null
  },
  { 
    id: '3', 
    title: 'Group Order', 
    icon: 'people', 
    color: '#FFA07A',
    description: 'Order with friends and family',
    badge: 'New'
  },
  { 
    id: '4', 
    title: 'Favorites', 
    icon: 'heart', 
    color: '#FF69B4',
    description: 'Your saved restaurants',
    badge: null
  },
];

const featuredDeals = [
  {
    id: '1',
    title: 'Flash Sale',
    subtitle: '50% off selected items',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&w=400',
    gradient: ['#FF6B35', '#F7931E'],
  },
  {
    id: '2',
    title: 'Free Delivery',
    subtitle: 'On orders over $25',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&w=400',
    gradient: ['#4ECDC4', '#44A08D'],
  },
  {
    id: '3',
    title: 'Bundle Deal',
    subtitle: 'Buy 2 get 1 free',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&w=400',
    gradient: ['#667eea', '#764ba2'],
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentDeals, setCurrentDeals] = useState(0);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>(['1', '3']); // Pre-populate with some favorites
  const [cartItems, setCartItems] = useState(3);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('Downtown, City Center');
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [recentOrders, setRecentOrders] = useState([
    { id: '1', restaurantName: 'Tony\'s Pizza Palace', items: 2, total: 24.99, date: '2 days ago' },
    { id: '2', restaurantName: 'Burger Junction', items: 1, total: 12.50, date: '5 days ago' }
  ]);
  const [scheduledOrders, setScheduledOrders] = useState([
    { id: '1', restaurantName: 'Sakura Sushi', scheduledFor: 'Tomorrow 7:00 PM', status: 'scheduled' }
  ]);
  const [showQuickActionModal, setShowQuickActionModal] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  const slideAnim = new Animated.Value(0);
  const searchAnim = new Animated.Value(0);

  useEffect(() => {
    // Check authentication status
    const user = authService.getCurrentUser();
    const authenticated = authService.isUserAuthenticated();
    setCurrentUser(user);
    setIsAuthenticated(authenticated);

    const interval = setInterval(() => {
      setCurrentDeals((prev) => (prev + 1) % featuredDeals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentDeals,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentDeals]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay and update data
    setTimeout(() => {
      setRefreshing(false);
      // Simulate new notifications or cart updates
      setHasNotifications(Math.random() > 0.5);
    }, 2000);
  };

  const toggleFavorite = (restaurantId: string) => {
    setFavoriteRestaurants(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'Reorder':
        if (recentOrders.length > 0) {
          // Show reorder options or navigate to last order
          setShowQuickActionModal('reorder');
        } else {
          // No recent orders, navigate to browse restaurants
          router.push('/orders' as any);
        }
        break;
      case 'Schedule':
        if (scheduledOrders.length > 0) {
          // Show scheduled orders
          setShowQuickActionModal('schedule');
        } else {
          // Create new scheduled order
          setShowQuickActionModal('schedule-new');
        }
        break;
      case 'Group Order':
        // Show group order options
        setShowQuickActionModal('group-order');
        break;
      case 'Favorites':
        if (favoriteRestaurants.length > 0) {
          router.push('/favorites' as any);
        } else {
          // No favorites yet, show suggestion
          setShowQuickActionModal('favorites-empty');
        }
        break;
    }
  };

  const closeQuickActionModal = () => {
    setShowQuickActionModal(null);
  };

  const handleReorder = (orderId: string) => {
    // Find the order and add items to cart
    const order = recentOrders.find(o => o.id === orderId);
    if (order) {
      setCartItems(prev => prev + order.items);
      closeQuickActionModal();
      router.push('/cart' as any);
    }
  };

  const handleScheduleOrder = () => {
    // Navigate to schedule new order
    closeQuickActionModal();
    // Future: Open scheduling modal
  };

  const toggleDeliveryMode = () => {
    setDeliveryMode(prev => prev === 'delivery' ? 'pickup' : 'delivery');
  };

  const filteredRestaurants = selectedCategory === 'all' 
    ? restaurants 
    : restaurants.filter(r => r.cuisine.toLowerCase() === selectedCategory.toLowerCase());
  
  const searchFilteredRestaurants = filteredRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = ({ item }: { item: any }) => {
    const isSelected = selectedCategory === item.name.toLowerCase();
    return (
      <TouchableOpacity 
        style={[
          styles.categoryItem, 
          { backgroundColor: isSelected ? item.color : '#f0f0f0' }
        ]}
        onPress={() => setSelectedCategory(item.name.toLowerCase())}
      >
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={isSelected ? '#fff' : item.color} 
          style={styles.categoryIcon}
        />
        <Text style={[styles.categoryName, { color: isSelected ? '#fff' : '#666' }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = ({ item }: { item: any }) => {
    // Dynamic badge content based on action type
    let badgeContent = item.badge;
    let badgeColor = '#FF6B35';
    
    if (item.title === 'Reorder' && recentOrders.length > 0) {
      badgeContent = recentOrders.length.toString();
      badgeColor = '#4ECDC4';
    } else if (item.title === 'Schedule' && scheduledOrders.length > 0) {
      badgeContent = scheduledOrders.length.toString();
      badgeColor = '#45B7D1';
    } else if (item.title === 'Favorites' && favoriteRestaurants.length > 0) {
      badgeContent = favoriteRestaurants.length.toString();
      badgeColor = '#FF69B4';
    }
    
    return (
      <TouchableOpacity 
        style={[styles.quickActionItem, { backgroundColor: item.color }]}
        onPress={() => handleQuickAction(item.title)}
      >
        {badgeContent && (
          <View style={[styles.quickActionBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.quickActionBadgeText}>{badgeContent}</Text>
          </View>
        )}
        <Ionicons name={item.icon as any} size={24} color="#fff" />
        <Text style={styles.quickActionText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderFeaturedDeal = ({ item, index }: { item: any; index: number }) => (
    <LinearGradient
      colors={item.gradient}
      style={styles.dealCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.dealContent}>
        <Text style={styles.dealTitle}>{item.title}</Text>
        <Text style={styles.dealSubtitle}>{item.subtitle}</Text>
        <TouchableOpacity style={styles.dealButton}>
          <Text style={styles.dealButtonText}>Claim Now</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.dealImage} />
    </LinearGradient>
  );

  const renderRestaurant = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.id}` as any)}
    >
      <View style={styles.badgeContainer}>
        {item.promoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>Promoted</Text>
          </View>
        )}
        {item.isNew && (
          <View style={[styles.promotedBadge, { backgroundColor: '#4ECDC4', top: item.promoted ? 35 : 10 }]}>
            <Text style={styles.promotedText}>New</Text>
          </View>
        )}
        {item.isTrending && (
          <View style={[styles.trendingBadge, { top: item.promoted || item.isNew ? (item.promoted && item.isNew ? 60 : 35) : 10 }]}>
            <Ionicons name="trending-up" size={12} color="#fff" />
            <Text style={styles.trendingText}>Hot</Text>
          </View>
        )}
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
      </View>
      
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons 
              name={favoriteRestaurants.includes(item.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={favoriteRestaurants.includes(item.id) ? "#FF6B35" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
        
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>
                {isAuthenticated && currentUser ? 
                  `Hello, ${currentUser.firstName || 'User'}!` : 
                  'Hello!'
                }
              </Text>
              <Ionicons name="hand-left-outline" size={20} color={Colors.primary} style={{ marginLeft: 8 }} />
              {!isOnline && (
                <View style={styles.offlineIndicator}>
                  <Text style={styles.offlineText}>Offline</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.locationContainer}>
              <Ionicons name="location" size={14} color="#FF6B35" />
              <Text style={styles.location}>{currentLocation}</Text>
              <Ionicons name="chevron-down" size={12} color="#666" />
            </TouchableOpacity>
            
            {/* Delivery Mode Toggle */}
            <View style={styles.deliveryModeContainer}>
              <TouchableOpacity 
                style={[
                  styles.deliveryModeButton, 
                  deliveryMode === 'delivery' && styles.deliveryModeActive
                ]}
                onPress={() => setDeliveryMode('delivery')}
              >
                <Text style={[
                  styles.deliveryModeText,
                  deliveryMode === 'delivery' && styles.deliveryModeActiveText
                ]}>
                  Delivery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.deliveryModeButton, 
                  deliveryMode === 'pickup' && styles.deliveryModeActive
                ]}
                onPress={() => setDeliveryMode('pickup')}
              >
                <Text style={[
                  styles.deliveryModeText,
                  deliveryMode === 'pickup' && styles.deliveryModeActiveText
                ]}>
                  Pickup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              {hasNotifications && <View style={styles.notificationDot} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart' as any)}>
              <Ionicons name="bag" size={24} color="#FF6B35" />
              {cartItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants or food..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => router.push('/search' as any)}
          >
            <Ionicons name="options" size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Featured Deals Carousel */}
        <View style={styles.dealsSection}>
          <FlatList
            data={featuredDeals}
            renderItem={renderFeaturedDeal}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsList}
          />
          <View style={styles.dealsIndicator}>
            {featuredDeals.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicatorDot, 
                  { opacity: index === currentDeals ? 1 : 0.3 }
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsList}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={[{ id: '0', name: 'All', icon: 'grid-outline', color: '#666' }, ...categories]}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Search Results or Restaurants */}
        {searchQuery.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Search Results ({searchFilteredRestaurants.length})
              </Text>
              {searchFilteredRestaurants.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.seeAllText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {searchFilteredRestaurants.length > 0 ? (
              <FlatList
                data={searchFilteredRestaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantsList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No restaurants found</Text>
                <Text style={styles.emptyStateSubtext}>Try searching for something else</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Restaurants */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'all' ? 'Restaurants Near You' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Restaurants`}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All ({filteredRestaurants.length})</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={filteredRestaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantsList}
              />
            </View>

            {/* Trending Now */}
            {restaurants.filter(r => r.isTrending).length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name="trending-up" size={20} color="#FF4757" />
                    <Text style={styles.sectionTitle}>Trending Now</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={restaurants.filter(r => r.isTrending)}
                  renderItem={renderRestaurant}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.restaurantsList}
                />
              </View>
            )}

            {/* New Restaurants */}
            {restaurants.filter(r => r.isNew).length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name="sparkles" size={20} color="#4ECDC4" />
                    <Text style={styles.sectionTitle}>New on Platform</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>Explore</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={restaurants.filter(r => r.isNew)}
                  renderItem={renderRestaurant}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.restaurantsList}
                />
              </View>
            )}

            {/* Offers & Discounts */}
            {restaurants.filter(r => r.discount > 0).length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name="pricetag" size={20} color="#FFD700" />
                    <Text style={styles.sectionTitle}>Great Deals</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>All Offers</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={restaurants.filter(r => r.discount > 0).sort((a, b) => b.discount - a.discount)}
                  renderItem={renderRestaurant}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.restaurantsList}
                />
              </View>
            )}
          </>
        )}


      </ScrollView>

      {/* Quick Action Modals */}
      {showQuickActionModal === 'reorder' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reorder from Recent Orders</Text>
              <TouchableOpacity onPress={closeQuickActionModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {recentOrders.map((order) => (
              <TouchableOpacity 
                key={order.id}
                style={styles.orderItem}
                onPress={() => handleReorder(order.id)}
              >
                <View style={styles.orderInfo}>
                  <Text style={styles.orderRestaurant}>{order.restaurantName}</Text>
                  <Text style={styles.orderDetails}>{order.items} items • ${order.total} • {order.date}</Text>
                </View>
                <Ionicons name="repeat" size={20} color="#FF6B35" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showQuickActionModal === 'schedule' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scheduled Orders</Text>
              <TouchableOpacity onPress={closeQuickActionModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {scheduledOrders.map((order) => (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderRestaurant}>{order.restaurantName}</Text>
                  <Text style={styles.orderDetails}>Scheduled for {order.scheduledFor}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Scheduled</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.scheduleNewButton} onPress={handleScheduleOrder}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.scheduleNewText}>Schedule New Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showQuickActionModal === 'schedule-new' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule an Order</Text>
              <TouchableOpacity onPress={closeQuickActionModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>Plan your meals ahead of time. Browse restaurants and schedule orders for later.</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => {
              closeQuickActionModal();
            }}>
              <Text style={styles.actionButtonText}>Browse Restaurants</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showQuickActionModal === 'group-order' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Group Order</Text>
              <TouchableOpacity onPress={closeQuickActionModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>Order together with friends and family. Split the cost and enjoy meals together!</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => {
              closeQuickActionModal();
            }}>
              <Text style={styles.actionButtonText}>Create Group Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => {
              closeQuickActionModal();
            }}>
              <Text style={styles.secondaryButtonText}>Join Existing Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showQuickActionModal === 'favorites-empty' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>No Favorites Yet</Text>
              <TouchableOpacity onPress={closeQuickActionModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>Start adding restaurants to your favorites by tapping the heart icon on restaurant cards.</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => {
              closeQuickActionModal();
            }}>
              <Text style={styles.actionButtonText}>Browse Restaurants</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginVertical: 8,
  },
  promoButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  promoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginLeft: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  categoryIcon: {
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 15,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  promotedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  promotedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
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
  // New Modern Styles
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  filterButton: {
    padding: 8,
  },
  dealsSection: {
    marginVertical: 10,
  },
  dealsList: {
    paddingHorizontal: 20,
  },
  dealCard: {
    width: width * 0.85,
    height: 140,
    borderRadius: 16,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  dealContent: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dealSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginVertical: 8,
  },
  dealButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  dealButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dealImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  dealsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginHorizontal: 4,
  },
  quickActionsList: {
    paddingHorizontal: 20,
  },
  quickActionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 15,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  trendingBadge: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#FF4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#00D2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 5,
  },
  // Enhanced Header Styles
  userInfo: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  offlineIndicator: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  offlineText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
  },
  deliveryModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  deliveryModeActive: {
    backgroundColor: '#FF6B35',
  },
  deliveryModeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  deliveryModeActiveText: {
    color: '#fff',
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  // Quick Action Badge Styles
  quickActionBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  quickActionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxWidth: width * 0.9,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderRestaurant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDetails: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    backgroundColor: '#45B7D1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scheduleNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B7D1',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  scheduleNewText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});