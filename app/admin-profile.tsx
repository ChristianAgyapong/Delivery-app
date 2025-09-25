import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    AdminUser,
    authService
} from '../services';

const { width } = Dimensions.get('window');

export default function AdminProfileScreen() {
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<AdminUser | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(100))[0];

  useEffect(() => {
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
      
      // Create a mock admin profile since the service doesn't have a specific method
      const adminProfile: AdminUser = {
        id: 'admin_001',
        email: 'admin@foodieexpress.com',
        name: 'System Administrator',
        role: 'super_admin',
        permissions: [
          'manage_users',
          'manage_restaurants',
          'manage_orders',
          'manage_payments',
          'view_analytics',
          'handle_disputes',
          'manage_commissions',
          'manage_promotions',
          'system_settings',
          'manage_admins'
        ],
        isActive: true,
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: '2023-01-01T00:00:00.000Z',
      };
      
      setProfile(adminProfile);
      setEditedProfile(adminProfile);
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
      // Mock save operation
      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
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

  const getRoleDisplayName = (role: AdminUser['role']) => {
    switch (role) {
      case 'super_admin':
        return 'Super Administrator';
      case 'admin':
        return 'Administrator';
      case 'moderator':
        return 'Moderator';
      default:
        return role;
    }
  };

  const getPermissionDisplayName = (permission: string) => {
    const permissionMap: { [key: string]: string } = {
      'manage_users': 'User Management',
      'manage_restaurants': 'Restaurant Management',
      'manage_orders': 'Order Management',
      'manage_payments': 'Payment Management',
      'view_analytics': 'Analytics Access',
      'handle_disputes': 'Dispute Resolution',
      'manage_commissions': 'Commission Management',
      'manage_promotions': 'Promotion Management',
      'system_settings': 'System Settings',
      'manage_admins': 'Admin Management'
    };
    return permissionMap[permission] || permission;
  };

  if (loading || !profile) {
    return (
      <LinearGradient colors={['#6A1B9A', '#8E24AA']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Profile...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#6A1B9A', '#8E24AA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Profile</Text>
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
              <Ionicons name="shield" size={48} color="#6A1B9A" />
            </View>
            <Text style={styles.adminName}>{profile.name}</Text>
            <Text style={styles.adminRole}>{getRoleDisplayName(profile.role)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: profile.isActive ? '#4CAF50' : '#F44336' }]}>
              <Text style={styles.statusText}>
                {profile.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          {/* Account Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile?.name}
                  onChangeText={(text) =>
                    setEditedProfile(prev => prev ? { ...prev, name: text } : null)
                  }
                  placeholder="Enter full name"
                />
              ) : (
                <Text style={styles.inputValue}>{profile.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile?.email}
                  onChangeText={(text) =>
                    setEditedProfile(prev => prev ? { ...prev, email: text } : null)
                  }
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.inputValue}>{profile.email}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Admin ID</Text>
              <Text style={styles.inputValue}>{profile.id}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role</Text>
              <Text style={styles.inputValue}>{getRoleDisplayName(profile.role)}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Member Since</Text>
              <Text style={styles.inputValue}>
                {new Date(profile.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Login</Text>
              <Text style={styles.inputValue}>
                {new Date(profile.lastLogin).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Permissions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Permissions & Access</Text>
            
            <View style={styles.permissionsGrid}>
              {profile.permissions.map((permission, index) => (
                <View key={index} style={styles.permissionChip}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.permissionText}>
                    {getPermissionDisplayName(permission)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Activity Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Summary</Text>
            
            <View style={styles.activityGrid}>
              <View style={styles.activityCard}>
                <Ionicons name="people" size={24} color="#2196F3" />
                <Text style={styles.activityNumber}>1,245</Text>
                <Text style={styles.activityLabel}>Users Managed</Text>
              </View>

              <View style={styles.activityCard}>
                <Ionicons name="restaurant" size={24} color="#4CAF50" />
                <Text style={styles.activityNumber}>89</Text>
                <Text style={styles.activityLabel}>Restaurants Approved</Text>
              </View>

              <View style={styles.activityCard}>
                <Ionicons name="shield-checkmark" size={24} color="#FF9800" />
                <Text style={styles.activityNumber}>23</Text>
                <Text style={styles.activityLabel}>Disputes Resolved</Text>
              </View>

              <View style={styles.activityCard}>
                <Ionicons name="settings" size={24} color="#9C27B0" />
                <Text style={styles.activityNumber}>156</Text>
                <Text style={styles.activityLabel}>System Changes</Text>
              </View>
            </View>
          </View>

          {/* Security Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security & Privacy</Text>
            
            <TouchableOpacity style={styles.securityOption}>
              <View style={styles.securityOptionLeft}>
                <Ionicons name="key" size={20} color="#666" />
                <Text style={styles.securityOptionText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.securityOption}>
              <View style={styles.securityOptionLeft}>
                <Ionicons name="shield" size={20} color="#666" />
                <Text style={styles.securityOptionText}>Two-Factor Authentication</Text>
              </View>
              <View style={styles.securityStatus}>
                <Text style={styles.securityStatusText}>Enabled</Text>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.securityOption}>
              <View style={styles.securityOptionLeft}>
                <Ionicons name="time" size={20} color="#666" />
                <Text style={styles.securityOptionText}>Login History</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.securityOption}>
              <View style={styles.securityOptionLeft}>
                <Ionicons name="lock-closed" size={20} color="#666" />
                <Text style={styles.securityOptionText}>Privacy Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
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
                  style={[styles.actionButton, styles.dashboardButton]}
                  onPress={() => router.push('/admin-dashboard')}
                >
                  <Ionicons name="speedometer" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Admin Dashboard</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.settingsButton]}
                  onPress={() => Alert.alert('Settings', 'Advanced settings coming soon!')}
                >
                  <Ionicons name="settings" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>System Settings</Text>
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
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 12,
  },
  adminRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
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
  inputValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  permissionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  permissionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  activityNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  activityLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  securityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  securityOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  securityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityStatusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 4,
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
  dashboardButton: {
    backgroundColor: '#6A1B9A',
  },
  settingsButton: {
    backgroundColor: '#2196F3',
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
});