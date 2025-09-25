import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3' }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Ionicons name="restaurant" size={60} color="#FF6B35" />
              <Text style={styles.appName}>FoodieExpress</Text>
              <Text style={styles.tagline}>Delicious food delivered fast</Text>
            </View>
            
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Ionicons name="time" size={24} color="#FF6B35" />
                <Text style={styles.featureText}>Fast Delivery</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="star" size={24} color="#FF6B35" />
                <Text style={styles.featureText}>Top Restaurants</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="card" size={24} color="#FF6B35" />
                <Text style={styles.featureText}>Easy Payment</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => router.replace('/(tabs)/home' as any)}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login' as any)}
            >
              <Text style={styles.signInText}>
                Already have an account? 
                <Text style={styles.signInLink}> Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 8,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 60,
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
    fontWeight: '500',
  },
  getStartedButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  signInText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  signInLink: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
});
