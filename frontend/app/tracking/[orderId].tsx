import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const trackingSteps = [
  {
    id: '1',
    title: 'Order Confirmed',
    subtitle: 'Your order has been confirmed',
    time: '2:30 PM',
    completed: true,
    icon: 'checkmark-circle',
  },
  {
    id: '2',
    title: 'Preparing Food',
    subtitle: 'Restaurant is preparing your food',
    time: '2:35 PM',
    completed: true,
    icon: 'restaurant',
  },
  {
    id: '3',
    title: 'Out for Delivery',
    subtitle: 'Driver is on the way to your location',
    time: '3:05 PM',
    completed: true,
    icon: 'car',
    current: true,
  },
  {
    id: '4',
    title: 'Delivered',
    subtitle: 'Enjoy your meal!',
    time: 'ETA 3:15 PM',
    completed: false,
    icon: 'home',
  },
];

const mockOrder = {
  id: '#12345',
  restaurant: 'Tony\'s Pizza Palace',
  items: ['Margherita Pizza', 'Caesar Salad'],
  total: 36.41,
  driver: {
    name: 'Mike Johnson',
    phone: '+1 (555) 987-6543',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150',
    rating: 4.8,
  },
};

export default function TrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [estimatedTime, setEstimatedTime] = useState(10); // minutes
  const progressAnimation = new Animated.Value(0.75); // 75% progress

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    // Animate progress
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnimation, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnimation, {
          toValue: 0.75,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    return () => clearInterval(interval);
  }, []);

  const renderTrackingStep = (step: any, index: number) => (
    <View key={step.id} style={styles.stepContainer}>
      <View style={styles.stepLine}>
        <View style={[
          styles.stepIcon,
          step.completed && styles.completedStep,
          step.current && styles.currentStep,
        ]}>
          <Ionicons
            name={step.icon}
            size={20}
            color={step.completed ? '#fff' : step.current ? '#FF6B35' : '#ccc'}
          />
        </View>
        {index < trackingSteps.length - 1 && (
          <View style={[
            styles.stepConnector,
            step.completed && styles.completedConnector,
          ]} />
        )}
      </View>
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={[
            styles.stepTitle,
            step.current && styles.currentStepTitle,
          ]}>
            {step.title}
          </Text>
          <Text style={styles.stepTime}>{step.time}</Text>
        </View>
        <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
        {step.current && (
          <View style={styles.liveIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <TouchableOpacity>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estimated Time Card */}
        <View style={styles.estimatedTimeCard}>
          <View style={styles.timeHeader}>
            <Ionicons name="time" size={24} color="#FF6B35" />
            <Text style={styles.estimatedLabel}>Estimated Delivery</Text>
          </View>
          <Text style={styles.estimatedTime}>
            {estimatedTime > 0 ? `${estimatedTime} minutes` : 'Arriving soon!'}
          </Text>
          <View style={styles.progressBar}>
            <Animated.View style={[
              styles.progressFill,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]} />
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.section}>
          <View style={styles.orderHeader}>
            <Text style={styles.sectionTitle}>Order {mockOrder.id}</Text>
            <Text style={styles.orderTotal}>${mockOrder.total.toFixed(2)}</Text>
          </View>
          <Text style={styles.restaurantName}>{mockOrder.restaurant}</Text>
          <View style={styles.itemsList}>
            {mockOrder.items.map((item, index) => (
              <Text key={index} style={styles.itemText}>• {item}</Text>
            ))}
          </View>
        </View>

        {/* Tracking Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.trackingContainer}>
            {trackingSteps.map(renderTrackingStep)}
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Driver</Text>
          <View style={styles.driverCard}>
            <Image source={{ uri: mockOrder.driver.image }} style={styles.driverImage} />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{mockOrder.driver.name}</Text>
              <View style={styles.driverRating}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.rating}>{mockOrder.driver.rating}</Text>
              </View>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="call" size={20} color="#FF6B35" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble" size={20} color="#FF6B35" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={20} color="#FF6B35" />
            <View style={styles.addressInfo}>
              <Text style={styles.addressText}>123 Main Street, Apt 4B</Text>
              <Text style={styles.addressSubtext}>Downtown, City Center</Text>
            </View>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <View style={styles.helpContainer}>
            <TouchableOpacity style={styles.helpButton}>
              <Ionicons name="help-circle" size={20} color="#FF6B35" />
              <Text style={styles.helpText}>Need Help?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpButton}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#FF6B35" />
              <Text style={styles.helpText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share" size={16} color="#FF6B35" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  estimatedTimeCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  estimatedLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  estimatedTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  restaurantName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  itemsList: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  trackingContainer: {
    paddingLeft: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepLine: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  completedStep: {
    backgroundColor: '#32CD32',
    borderColor: '#32CD32',
  },
  currentStep: {
    backgroundColor: '#fff',
    borderColor: '#FF6B35',
    borderWidth: 3,
  },
  stepConnector: {
    width: 2,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginTop: 8,
  },
  completedConnector: {
    backgroundColor: '#32CD32',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentStepTitle: {
    color: '#FF6B35',
  },
  stepTime: {
    fontSize: 12,
    color: '#666',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInfo: {
    marginLeft: 12,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  addressSubtext: {
    fontSize: 14,
    color: '#666',
  },
  helpContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  shareButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});