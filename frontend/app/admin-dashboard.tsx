import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
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
  adminManagementService,
  AdminUser,
  authService,
  Dispute,
  PlatformStats,
} from '../services';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [reports, setReports] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = authService.isUserAuthenticated();
    const user = authService.getCurrentUser();
    
    if (!isAuthenticated || !user) {
      router.replace('/(auth)/login');
      return;
    }

    if (user.role !== 'admin') {
      Alert.alert('Access Denied', 'This dashboard is only accessible to administrators.');
      router.replace('/');
      return;
    }

    loadDashboardData();
    
    // Subscribe to admin updates
    const unsubscribe = adminManagementService.subscribe((event, data) => {
      if (event === 'stats_updated' || event === 'new_report') {
        loadDashboardData();
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    loadStats();
  }, [selectedTimeframe]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const adminProfile: AdminUser = {
        id: 'admin_001',
        email: 'admin@foodieexpress.com',
        name: 'System Administrator',
        role: 'super_admin',
        permissions: ['manage_users', 'manage_restaurants'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const platformStats = adminManagementService.getPlatformStats();
      const adminReports = adminManagementService.getDisputes().slice(0, 5);
      
      setProfile(adminProfile);
      setStats(platformStats);
      setReports(adminReports);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const platformStats = adminManagementService.getPlatformStats();
      setStats(platformStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleResolveReport = async (reportId: string) => {
    Alert.alert(
      'Resolve Report',
      'Are you sure you want to mark this report as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: async () => {
            try {
              const result = await adminManagementService.resolveDispute(reportId, 'Resolved by admin', 'admin');
              if (result.success) {
                Alert.alert('Success', 'Report has been resolved');
                loadDashboardData();
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error resolving report:', error);
              Alert.alert('Error', 'Failed to resolve report');
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

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <LinearGradient colors={Gradients.admin} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Dashboard...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Gradients.admin} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Admin Dashboard</Text>
            <Text style={styles.adminName}>{profile?.name || 'Admin'}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => router.push('/admin-profile' as any)}
            >
              <Ionicons name="person-outline" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.timeframeSelector}>
          {(['daily', 'weekly', 'monthly'] as const).map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe && styles.activeTimeframeButton,
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              <Text
                style={[
                  styles.timeframeButtonText,
                  selectedTimeframe === timeframe && styles.activeTimeframeButtonText,
                ]}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Platform Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Platform Overview</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="people" size={24} color="#4CAF50" />
                <Text style={styles.statNumber}>{((stats?.users.totalCustomers || 0) + (stats?.users.totalRestaurants || 0) + (stats?.users.totalDeliveryRiders || 0)).toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
                <Text style={styles.statSubtext}>
                  +{stats?.users.newSignupsToday || 0} today
                </Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="receipt" size={24} color="#2196F3" />
                <Text style={styles.statNumber}>{stats?.orders.totalOrders.toLocaleString() || '0'}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
                <Text style={styles.statSubtext}>
                  +{stats?.orders.ordersToday || 0} today
                </Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="cash" size={24} color="#FF9800" />
                <Text style={styles.statNumber}>
                  {formatCurrency(stats?.financial.totalRevenue || 0)}
                </Text>
                <Text style={styles.statLabel}>Revenue</Text>
                <Text style={styles.statSubtext}>
                  {formatCurrency(stats?.financial.revenueToday || 0)} today
                </Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="restaurant" size={24} color="#9C27B0" />
                <Text style={styles.statNumber}>{stats?.users.totalRestaurants || 0}</Text>
                <Text style={styles.statLabel}>Restaurants</Text>
                <Text style={styles.statSubtext}>
                  {stats?.users.totalRestaurants || 0} total
                </Text>
              </View>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.metricsContainer}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Avg Delivery Time</Text>
                <Text style={styles.metricValue}>
                  {stats?.delivery.averageDeliveryTime || 0} min
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Success Rate</Text>
                <Text style={styles.metricValue}>
                  {(stats?.delivery.deliverySuccessRate || 0).toFixed(1)}%
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Order Completion</Text>
                <Text style={styles.metricValue}>
                  {(stats?.orders.orderCompletionRate || 0).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Reports */}
          <View style={styles.reportsContainer}>
            <Text style={styles.sectionTitle}>Recent Reports ({reports.length})</Text>
            
            {reports.length === 0 ? (
              <View style={styles.noReportsContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                <Text style={styles.noReportsText}>No pending reports</Text>
              </View>
            ) : (
              reports.map((report) => (
                <View key={report.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <View style={[styles.priorityBadge, getPriorityColor(report.priority)]}>
                      <Text style={styles.priorityText}>{report.priority.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.reportTime}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text style={styles.reportType}>{report.type.replace('_', ' ').toUpperCase()}</Text>
                  <Text style={styles.reportDescription} numberOfLines={2}>
                    {report.description}
                  </Text>

                  <View style={styles.reportFooter}>
                    <Text style={styles.reportedBy}>
                      Reported by: {report.reportedBy.type}
                    </Text>
                    <TouchableOpacity
                      style={styles.resolveButton}
                      onPress={() => handleResolveReport(report.id)}
                    >
                      <Text style={styles.resolveButtonText}>Resolve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="people-outline" size={32} color="#2196F3" />
                <Text style={styles.actionLabel}>User Management</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="restaurant-outline" size={32} color="#4CAF50" />
                <Text style={styles.actionLabel}>Restaurant Approval</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="bar-chart-outline" size={32} color="#FF9800" />
                <Text style={styles.actionLabel}>Analytics</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="settings-outline" size={32} color="#9C27B0" />
                <Text style={styles.actionLabel}>Platform Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const getPriorityColor = (priority: Dispute['priority']) => {
  switch (priority) {
    case 'urgent':
      return { backgroundColor: '#F44336' };
    case 'high':
      return { backgroundColor: '#FF9800' };
    case 'medium':
      return { backgroundColor: '#2196F3' };
    case 'low':
      return { backgroundColor: '#4CAF50' };
    default:
      return { backgroundColor: '#666' };
  }
};

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
  adminName: {
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
  timeframeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeTimeframeButton: {
    backgroundColor: '#FFF',
  },
  timeframeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTimeframeButtonText: {
    color: '#6A1B9A',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    width: (width - 60) / 2,
    marginBottom: 15,
    alignItems: 'center',
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
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  reportsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  noReportsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  noReportsText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  reportTime: {
    fontSize: 12,
    color: '#666',
  },
  reportType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportedBy: {
    fontSize: 12,
    color: '#666',
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resolveButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: (width - 60) / 2,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
});