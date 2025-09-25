import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import {
  DeliveryRider,
  deliveryManagementService
} from '../services/deliveryManagementService';

const { width } = Dimensions.get('window');

export default function DeliveryProfileScreen() {
  const [profile, setProfile] = useState<DeliveryRider | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      
      const profileData = deliveryManagementService.getRiderProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('❌ Error', 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
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
              console.error('Logout failed:', error);
              Alert.alert('❌ Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FFFFFF" />
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={['#2196F3', '#64B5F6']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delivery Profile</Text>
          <View style={styles.editButton} />
        </View>

        <ScrollView style={styles.content}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={48} color="#2196F3" />
            </View>
            <Text style={styles.deliveryName}>
              {profile.personalInfo.firstName} {profile.personalInfo.lastName}
            </Text>
            <Text style={styles.deliveryStatus}>
              Status: {profile.status === 'available' ? 'Available' : profile.status}
            </Text>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>First Name:</Text>
              <Text style={styles.infoValue}>{profile.personalInfo.firstName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Name:</Text>
              <Text style={styles.infoValue}>{profile.personalInfo.lastName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{profile.personalInfo.phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{profile.personalInfo.email}</Text>
            </View>
          </View>

          {/* Vehicle Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vehicle Type:</Text>
              <Text style={styles.infoValue}>{profile.vehicleInfo.type}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Brand & Model:</Text>
              <Text style={styles.infoValue}>
                {profile.vehicleInfo.brand || 'N/A'} {profile.vehicleInfo.model || ''}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Year:</Text>
              <Text style={styles.infoValue}>{profile.vehicleInfo.year || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>License Plate:</Text>
              <Text style={styles.infoValue}>{profile.vehicleInfo.licensePlate || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Color:</Text>
              <Text style={styles.infoValue}>{profile.vehicleInfo.color || 'N/A'}</Text>
            </View>
          </View>

          {/* Documents */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Driver's License:</Text>
              <View style={styles.documentStatus}>
                <Ionicons 
                  name={profile.documents.driverLicense ? 'checkmark-circle' : 'close-circle'} 
                  size={20} 
                  color={profile.documents.driverLicense ? '#4CAF50' : '#F44336'} 
                />
                <Text style={[
                  styles.infoValue,
                  { color: profile.documents.driverLicense ? '#4CAF50' : '#F44336' }
                ]}>
                  {profile.documents.driverLicense ? 'Uploaded' : 'Not Uploaded'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vehicle Registration:</Text>
              <View style={styles.documentStatus}>
                <Ionicons 
                  name={profile.documents.vehicleRegistration ? 'checkmark-circle' : 'close-circle'} 
                  size={20} 
                  color={profile.documents.vehicleRegistration ? '#4CAF50' : '#F44336'} 
                />
                <Text style={[
                  styles.infoValue,
                  { color: profile.documents.vehicleRegistration ? '#4CAF50' : '#F44336' }
                ]}>
                  {profile.documents.vehicleRegistration ? 'Uploaded' : 'Not Uploaded'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Insurance:</Text>
              <View style={styles.documentStatus}>
                <Ionicons 
                  name={profile.documents.insurance ? 'checkmark-circle' : 'close-circle'} 
                  size={20} 
                  color={profile.documents.insurance ? '#4CAF50' : '#F44336'} 
                />
                <Text style={[
                  styles.infoValue,
                  { color: profile.documents.insurance ? '#4CAF50' : '#F44336' }
                ]}>
                  {profile.documents.insurance ? 'Uploaded' : 'Not Uploaded'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Background Check:</Text>
              <View style={styles.documentStatus}>
                <Ionicons 
                  name={profile.documents.backgroundCheck ? 'checkmark-circle' : 'close-circle'} 
                  size={20} 
                  color={profile.documents.backgroundCheck ? '#4CAF50' : '#F44336'} 
                />
                <Text style={[
                  styles.infoValue,
                  { color: profile.documents.backgroundCheck ? '#4CAF50' : '#F44336' }
                ]}>
                  {profile.documents.backgroundCheck ? 'Uploaded' : 'Not Uploaded'}
                </Text>
              </View>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text style={styles.metricValue}>{profile.ratings.average.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>Rating</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="car" size={24} color="#2196F3" />
                <Text style={styles.metricValue}>{profile.performance.completedDeliveries}</Text>
                <Text style={styles.metricLabel}>Deliveries</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.metricValue}>{profile.performance.onTimeDeliveryRate.toFixed(1)}%</Text>
                <Text style={styles.metricLabel}>On Time Rate</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="time" size={24} color="#FF9800" />
                <Text style={styles.metricValue}>{profile.performance.averageDeliveryTime}</Text>
                <Text style={styles.metricLabel}>Avg Time (min)</Text>
              </View>
            </View>
          </View>

          {/* Earnings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earnings</Text>
            
            <View style={styles.earningsGrid}>
              <View style={styles.earningCard}>
                <Text style={styles.earningLabel}>Today</Text>
                <Text style={styles.earningValue}>${profile.earnings.todayEarnings.toFixed(2)}</Text>
              </View>

              <View style={styles.earningCard}>
                <Text style={styles.earningLabel}>This Week</Text>
                <Text style={styles.earningValue}>${profile.earnings.weekEarnings.toFixed(2)}</Text>
              </View>

              <View style={styles.earningCard}>
                <Text style={styles.earningLabel}>This Month</Text>
                <Text style={styles.earningValue}>${profile.earnings.monthEarnings.toFixed(2)}</Text>
              </View>

              <View style={styles.earningCard}>
                <Text style={styles.earningLabel}>Total Earned</Text>
                <Text style={styles.earningValue}>${profile.earnings.totalEarned.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.dashboardButton]}
              onPress={() => router.push('/delivery-dashboard')}
            >
              <Ionicons name="speedometer" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.documentsButton]}
              onPress={() => Alert.alert('Documents', 'Document management coming soon!')}
            >
              <Ionicons name="document-text" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Manage Documents</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editButton: {
    width: 34,
  },
  content: {
    flex: 1,
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
  deliveryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 12,
  },
  deliveryStatus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 140,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  documentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningCard: {
    width: '48%',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  earningLabel: {
    fontSize: 12,
    color: '#1976D2',
    marginBottom: 5,
    textAlign: 'center',
  },
  earningValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
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
  dashboardButton: {
    backgroundColor: '#2196F3',
  },
  documentsButton: {
    backgroundColor: '#FF9800',
  },
  settingsButton: {
    backgroundColor: '#9C27B0',
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
});