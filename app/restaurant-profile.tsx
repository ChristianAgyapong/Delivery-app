import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    authService,
    restaurantManagementService,
    RestaurantProfile,
} from '../services';

export default function RestaurantProfileScreen() {
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const restaurantProfile = restaurantManagementService.getRestaurantProfile();
      setProfile(restaurantProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
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
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  if (!profile) {
    return (
      <LinearGradient colors={['#FF5722', '#FF8A65']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Profile...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FF5722', '#FF8A65']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Restaurant Profile</Text>
          <View style={styles.editButton} />
        </View>

        <ScrollView style={styles.content}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="restaurant" size={48} color="#FF5722" />
            </View>
            <Text style={styles.businessName}>{profile.businessName}</Text>
            <Text style={styles.businessCategory}>{profile.category}</Text>
          </View>

          {/* Business Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Name:</Text>
              <Text style={styles.infoValue}>{profile.businessName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Description:</Text>
              <Text style={styles.infoValue}>{profile.description}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{profile.category}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cuisine Types:</Text>
              <Text style={styles.infoValue}>{profile.cuisineTypes.join(', ')}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {profile.address.street}, {profile.address.city}, {profile.address.state} {profile.address.zipCode}
              </Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{profile.contactInfo.phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{profile.contactInfo.email}</Text>
            </View>

            {profile.contactInfo.website && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Website:</Text>
                <Text style={styles.infoValue}>{profile.contactInfo.website}</Text>
              </View>
            )}
          </View>

          {/* Business Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Settings</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[styles.infoValue, { color: profile.settings.isActive ? '#4CAF50' : '#F44336' }]}>
                {profile.settings.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Accepting Orders:</Text>
              <Text style={[styles.infoValue, { color: profile.settings.acceptsOrders ? '#4CAF50' : '#F44336' }]}>
                {profile.settings.acceptsOrders ? 'Yes' : 'No'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Delivery Radius:</Text>
              <Text style={styles.infoValue}>{profile.settings.deliveryRadius} km</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Minimum Order:</Text>
              <Text style={styles.infoValue}>${profile.settings.minimumOrder}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Delivery Fee:</Text>
              <Text style={styles.infoValue}>${profile.settings.deliveryFee}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prep Time:</Text>
              <Text style={styles.infoValue}>{profile.settings.estimatedPrepTime} minutes</Text>
            </View>
          </View>

          {/* Business Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            {Object.entries(profile.businessHours).map(([day, hours]) => (
              <View key={day} style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}:
                </Text>
                <Text style={styles.infoValue}>
                  {hours.isOpen ? `${hours.openTime} - ${hours.closeTime}` : 'Closed'}
                </Text>
              </View>
            ))}
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.ratingDisplay}>
                <Text style={styles.ratingValue}>{profile.rating.average.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= profile.rating.average ? 'star' : 'star-outline'}
                      size={20}
                      color="#FFD700"
                    />
                  ))}
                </View>
                <Text style={styles.reviewCount}>
                  Based on {profile.rating.totalReviews} reviews
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.menuButton]}
              onPress={() => router.push('/restaurant-dashboard')}
            >
              <Ionicons name="restaurant" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.settingsButton]}
              onPress={() => Alert.alert('Settings', 'Settings screen coming soon!')}
            >
              <Ionicons name="settings" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Logout</Text>
            </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  changePhotoButton: {
    marginTop: 10,
  },
  changePhotoText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
    height: 100,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  cuisineChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  cuisineChipSelected: {
    backgroundColor: '#FF5722',
  },
  cuisineChipDisabled: {
    opacity: 0.7,
  },
  cuisineChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  cuisineChipTextSelected: {
    color: '#FFF',
  },
  operatingHourRow: {
    marginBottom: 15,
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
    width: 80,
    textAlign: 'center',
  },
  timeSeparator: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#666',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  menuButton: {
    backgroundColor: '#FF5722',
  },
  logoutButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingsButton: {
    backgroundColor: '#2196F3',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 12,
  },
  businessCategory: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 120,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingDisplay: {
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
});