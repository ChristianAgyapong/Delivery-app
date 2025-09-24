import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    User,
    authService,
    favoritesService,
    ordersService,
    userService,
} from '../services';

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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
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
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    try {
      const result = await userService.updateProfile(editedProfile);
      if (result.success) {
        setProfile(editedProfile);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
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

  const getOrderStats = () => {
    const orders = ordersService.getAllOrders();
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    return { totalOrders, totalSpent };
  };

  const getFavoriteStats = () => {
    const favorites = favoritesService.getFavoriteRestaurants();
    return favorites.length;
  };

  if (loading || !profile) {
    return (
      <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Profile...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const { totalOrders, totalSpent } = getOrderStats();
  const favoriteCount = getFavoriteStats();

  return (
    <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? 'close' : 'create'} 
              size={24} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.customerName}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.customerStatus}>
              Member since {new Date(profile.createdAt).getFullYear()}
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="receipt" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>{totalOrders}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="cash" size={24} color="#2196F3" />
              <Text style={styles.statNumber}>${totalSpent.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="heart" size={24} color="#F44336" />
              <Text style={styles.statNumber}>{favoriteCount}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
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
              <Text style={styles.inputLabel}>Last Name</Text>
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
                <Text style={styles.inputValue}>{profile.phone}</Text>
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
          </View>

          {/* Delivery Addresses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Addresses</Text>
            {profile.addresses.map((address, index) => (
              <View key={index} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressType}>{address.type}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>
                  {address.street}, {address.city}, {address.state} {address.zipCode}
                </Text>
                {address.instructions && (
                  <Text style={styles.addressInstructions}>
                    Instructions: {address.instructions}
                  </Text>
                )}
              </View>
            ))}
            
            <TouchableOpacity style={styles.addAddressButton}>
              <Ionicons name="add" size={20} color="#4CAF50" />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Dietary Restrictions</Text>
              <Text style={styles.preferenceValue}>
                {profile.preferences.dietaryRestrictions.length > 0 
                  ? profile.preferences.dietaryRestrictions.join(', ')
                  : 'None'
                }
              </Text>
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Favorite Cuisines</Text>
              <Text style={styles.preferenceValue}>
                {profile.preferences.favoriteCuisines.length > 0 
                  ? profile.preferences.favoriteCuisines.join(', ')
                  : 'None'
                }
              </Text>
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Notifications</Text>
              <Text style={styles.preferenceValue}>
                {profile.preferences.notifications.orderUpdates ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                >
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Save Changes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                >
                  <Ionicons name="close" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ordersButton]}
                  onPress={() => router.push('/(tabs)/orders')}
                >
                  <Ionicons name="receipt" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>My Orders</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.favoritesButton]}
                  onPress={() => router.push('/favorites')}
                >
                  <Ionicons name="heart" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Favorites</Text>
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
              </>
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
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 12,
  },
  customerStatus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  inputValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  addressCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addressInstructions: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 10,
  },
  addAddressText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
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
  ordersButton: {
    backgroundColor: '#2196F3',
  },
  favoritesButton: {
    backgroundColor: '#F44336',
  },
  settingsButton: {
    backgroundColor: '#9C27B0',
  },
  logoutButton: {
    backgroundColor: '#FF5722',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});