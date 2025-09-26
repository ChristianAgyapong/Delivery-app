import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients } from '../constants/design';
import {
  User,
  authService,
  favoritesService,
  ordersService,
  userService,
} from '../services';

const { width } = Dimensions.get('window');

interface CustomerProfile extends User {
  addresses: Array<{
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
    instructions?: string;
  }>;
  preferences: {
    dietaryRestrictions: string[];
    favoriteCuisines: string[];
    notifications: {
      orderUpdates: boolean;
      promotions: boolean;
      newRestaurants: boolean;
    };
  };
}

export default function CustomerProfileScreen() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CustomerProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(100))[0];

  useEffect(() => {
    // Check authentication
    const isAuthenticated = authService.isUserAuthenticated();
    const user = authService.getCurrentUser();
    
    if (!isAuthenticated || !user) {
      // Not authenticated, redirect to login
      router.replace('/(auth)/login');
      return;
    }

    if (user.role !== 'customer') {
      // Wrong role, redirect to appropriate dashboard
      Alert.alert('Access Denied', 'This profile is only accessible to customers.');
      router.back();
      return;
    }

    loadProfile();
    // Animate in on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = userService.getCurrentUser();
      // Create extended profile with additional customer data
      const customerProfile: CustomerProfile = {
        ...user!,
        addresses: [
          {
            id: '1',
            type: 'Home',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            isDefault: true,
            instructions: 'Ring doorbell twice'
          },
          {
            id: '2',
            type: 'Work',
            street: '456 Business Ave',
            city: 'New York', 
            state: 'NY',
            zipCode: '10002',
            isDefault: false,
          },
        ],
        preferences: {
          dietaryRestrictions: ['Vegetarian'],
          favoriteCuisines: ['Italian', 'Mexican'],
          notifications: {
            orderUpdates: true,
            promotions: false,
            newRestaurants: true,
          },
        },
      };
      setProfile(customerProfile);
      setEditedProfile(customerProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('❌ Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    // Validate required fields
    if (!editedProfile.firstName?.trim() || !editedProfile.lastName?.trim()) {
      Alert.alert('⚠️ Validation Error', 'First name and last name are required');
      return;
    }

    if (editedProfile.email && !isValidEmail(editedProfile.email)) {
      Alert.alert('⚠️ Validation Error', 'Please enter a valid email address');
      return;
    }

    try {
      setSaving(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await userService.updateProfile(editedProfile);
      if (result.success) {
        setProfile(editedProfile);
        setIsEditing(false);
        
        Alert.alert('✅ Success', 'Your profile has been updated successfully!');
      } else {
        Alert.alert('❌ Error', result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('❌ Error', 'Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              router.replace('/');
            } catch (error) {
              Alert.alert('❌ Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Get customer statistics
  const getCustomerStats = () => {
    const orders = ordersService.getAllOrders();
    const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    const favoriteCount = favoritesService.getCount();
    
    return {
      totalOrders: orders.length,
      totalSpent,
      favoriteRestaurants: typeof favoriteCount === 'object' ? favoriteCount.restaurants || 0 : favoriteCount,
      memberSince: profile?.createdAt ? new Date(profile.createdAt).getFullYear() : 2024
    };
  };

  const stats = profile ? getCustomerStats() : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={Gradients.customer} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={Gradients.customer} style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.white} />
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <LinearGradient colors={Gradients.customer} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Profile Picture Section */}
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {profile.firstName?.[0]?.toUpperCase()}{profile.lastName?.[0]?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.editImageBadge}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.profileName}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Stats */}
          {stats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Quick Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.totalOrders}</Text>
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>${stats.totalSpent.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Spent</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.favoriteRestaurants}</Text>
                  <Text style={styles.statLabel}>Favorites</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.memberSince}</Text>
                  <Text style={styles.statLabel}>Member Since</Text>
                </View>
              </View>
            </View>
          )}

          {/* Personal Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👤 Personal Information</Text>
              <TouchableOpacity
                onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                style={[styles.editButton, isEditing && styles.saveButton]}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons 
                    name={isEditing ? "checkmark" : "pencil"} 
                    size={20} 
                    color="#FFFFFF" 
                  />
                )}
                <Text style={styles.editButtonText}>
                  {saving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name *</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile?.firstName}
                  onChangeText={(text) =>
                    setEditedProfile((prev: CustomerProfile | null) => prev ? {
                      ...prev,
                      firstName: text
                    } : null)
                  }
                  placeholder="Enter first name"
                />
              ) : (
                <Text style={styles.inputValue}>{profile.firstName}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name *</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile?.lastName}
                  onChangeText={(text) =>
                    setEditedProfile((prev: CustomerProfile | null) => prev ? {
                      ...prev,
                      lastName: text
                    } : null)
                  }
                  placeholder="Enter last name"
                />
              ) : (
                <Text style={styles.inputValue}>{profile.lastName}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile?.phone}
                  onChangeText={(text) =>
                    setEditedProfile((prev: CustomerProfile | null) => prev ? {
                      ...prev,
                      phone: text
                    } : null)
                  }
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.inputValue}>{profile.phone || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile?.email}
                  onChangeText={(text) =>
                    setEditedProfile((prev: CustomerProfile | null) => prev ? {
                      ...prev,
                      email: text
                    } : null)
                  }
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.inputValue}>{profile.email}</Text>
              )}
            </View>

            {isEditing && (
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Delivery Addresses Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📍 Delivery Addresses</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color="#667eea" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {profile.addresses.map((address, index) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressType}>{address.type}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>
                  {address.street}, {address.city}, {address.state} {address.zipCode}
                </Text>
                {address.instructions && (
                  <Text style={styles.addressInstructions}>
                    📝 Instructions: {address.instructions}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Preferences</Text>

            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>🥗 Dietary Restrictions</Text>
              <Text style={styles.preferenceValue}>
                {profile.preferences.dietaryRestrictions.length > 0
                  ? profile.preferences.dietaryRestrictions.join(', ')
                  : 'None specified'}
              </Text>
            </View>

            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>🍽️ Favorite Cuisines</Text>
              <Text style={styles.preferenceValue}>
                {profile.preferences.favoriteCuisines.length > 0
                  ? profile.preferences.favoriteCuisines.join(', ')
                  : 'No preferences set'}
              </Text>
            </View>

            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>🔔 Order Notifications</Text>
              <Text style={styles.preferenceValue}>
                {profile.preferences.notifications.orderUpdates ? '✅ Enabled' : '❌ Disabled'}
              </Text>
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 Account Actions</Text>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#667eea" />
              <Text style={styles.actionButtonText}>Privacy Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={24} color="#667eea" />
              <Text style={styles.actionButtonText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text-outline" size={24} color="#667eea" />
              <Text style={styles.actionButtonText}>Terms & Conditions</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  animatedContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  profileImageSection: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addressCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressInstructions: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  preferenceItem: {
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});