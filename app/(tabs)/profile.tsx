import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/design';
import { authService } from '../../services';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get current user role to determine which profile to show
    const isAuthenticated = authService.isUserAuthenticated();
    const currentUser = authService.getCurrentUser();
    
    if (isAuthenticated && currentUser) {
      setUserRole(currentUser.role);
    } else {
      setUserRole(null);
    }
  }, []);

  const navigateToProfile = () => {
    const isAuthenticated = authService.isUserAuthenticated();
    const user = authService.getCurrentUser();
    
    if (!isAuthenticated || !user) {
      // Not authenticated, redirect to login
      router.push('/(auth)/login' as any);
      return;
    }

    // Navigate to appropriate profile based on user role
    switch (user.role) {
      case 'customer':
        router.push('/customer-profile' as any);
        break;
      case 'restaurant':
        router.push('/restaurant-profile' as any);
        break;
      case 'delivery':
        router.push('/delivery-profile' as any);
        break;
      case 'admin':
        router.push('/admin-profile' as any);
        break;
      default:
        router.push('/customer-profile' as any); // Default to customer profile
    }
  };

  const handleLogout = () => {
    authService.logout();
    // Navigate to welcome screen after logout
    router.replace('/');
  };

  const menuItems = [
    {
      id: '0',
      title: 'View Full Profile',
      icon: 'person-circle',
      subtitle: 'Edit your complete profile',
      hasArrow: true,
      onPress: navigateToProfile,
    },
    {
      id: '1',
      title: 'Payment Methods',
      icon: 'card',
      subtitle: '3 cards saved',
      hasArrow: true,
    },
    {
      id: '2',
      title: 'Delivery Addresses',
      icon: 'location',
      subtitle: '2 addresses saved',
      hasArrow: true,
    },
    {
      id: '3',
      title: 'Order History',
      icon: 'receipt',
      subtitle: 'View all orders',
      hasArrow: true,
    },
    {
      id: '4',
      title: 'Favorites',
      icon: 'heart',
      subtitle: '12 restaurants',
      hasArrow: true,
      onPress: () => router.push('/favorites' as any),
    },
    {
      id: '5',
      title: 'Promo Codes',
      icon: 'pricetag',
      subtitle: '2 active codes',
      hasArrow: true,
    },
  ];

  const supportItems = [
    {
      id: '1',
      title: 'Help Center',
      icon: 'help-circle',
      hasArrow: true,
    },
    {
      id: '2',
      title: 'Contact Support',
      icon: 'chatbubble',
      hasArrow: true,
    },
    {
      id: '3',
      title: 'Report an Issue',
      icon: 'warning',
      hasArrow: true,
    },
    {
      id: '4',
      title: 'Rate the App',
      icon: 'star',
      hasArrow: true,
    },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      {item.hasArrow && (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Ionicons name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150'
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
              <Text style={styles.profilePhone}>+1 (555) 123-4567</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={navigateToProfile}>
              <Ionicons name="pencil" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>47</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>$342</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuItemTitle}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ccc', true: Colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuItemTitle}>Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#ccc', true: Colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {supportItems.map(renderMenuItem)}
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>FoodieExpress v1.0.0</Text>
        </View>
      </ScrollView>
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
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ddd',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff2f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff2f2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4444',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});