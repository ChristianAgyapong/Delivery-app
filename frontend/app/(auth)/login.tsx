import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gradients } from '../../constants/design';
import { authService, UserRole } from '../../services';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = authService.isUserAuthenticated();
      const user = authService.getCurrentUser();
      if (isAuthenticated && user) {
        // Always navigate to home screen regardless of role
        router.replace('/(tabs)/home');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('Login attempt with:', { email, role: selectedRole });
    setLoading(true);
    
    try {
      const result = await authService.login({
        email,
        password,
        role: selectedRole,
      });
      
      console.log('Login result:', result);
      
      if (result.success) {
        console.log("Login successful, navigating to home screen");
        
        // Simple navigation without complex logic
        Alert.alert(
          'Login Successful', 
          'Welcome back!',
          [{ 
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/home');
            }
          }]
        );
      } else {
        Alert.alert('Login Failed', result.message || 'Please check your credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; icon: string; color: string }[] = [
    { value: 'customer', label: 'Customer', icon: 'person', color: '#4CAF50' },
    { value: 'restaurant', label: 'Restaurant', icon: 'restaurant', color: '#FF5722' },
    { value: 'delivery', label: 'Delivery', icon: 'bicycle', color: '#2196F3' },
    { value: 'admin', label: 'Admin', icon: 'settings', color: '#9C27B0' },
  ];

  return (
    <LinearGradient colors={Gradients.auth} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <Text style={styles.roleTitle}>Select Your Role</Text>
              <View style={styles.roleButtons}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleButton,
                      selectedRole === role.value && {
                        backgroundColor: role.color,
                        borderColor: role.color,
                      },
                    ]}
                    onPress={() => setSelectedRole(role.value)}
                  >
                    <Ionicons
                      name={role.icon as any}
                      size={24}
                      color={selectedRole === role.value ? '#FFF' : role.color}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        selectedRole === role.value && { color: '#FFF' },
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push('/(auth)/forgot-password' as any)}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#CCC', '#AAA'] : Gradients.auth}
                  style={styles.loginButtonGradient}
                >
                  {loading ? (
                    <Text style={styles.loginButtonText}>Signing In...</Text>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <TouchableOpacity 
                style={styles.demoCredential}
                onPress={() => {
                  setEmail('john.customer@example.com');
                  setPassword('password123');
                  setSelectedRole('customer');
                }}
              >
                <Text style={styles.demoText}>Customer: john.customer@example.com / password123</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.demoCredential}
                onPress={() => {
                  setEmail('restaurant@pizzapalace.com');
                  setPassword('password123');
                  setSelectedRole('restaurant');
                }}
              >
                <Text style={styles.demoText}>Restaurant: restaurant@pizzapalace.com / password123</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.demoCredential}
                onPress={() => {
                  setEmail('rider@delivery.com');
                  setPassword('password123');
                  setSelectedRole('delivery');
                }}
              >
                <Text style={styles.demoText}>Delivery: rider@delivery.com / password123</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.demoCredential}
                onPress={() => {
                  setEmail('admin@fooddelivery.com');
                  setPassword('password123');
                  setSelectedRole('admin');
                }}
              >
                <Text style={styles.demoText}>Admin: admin@fooddelivery.com / password123</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  roleContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  roleButton: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 80,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    color: '#333',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 8,
    borderRadius: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  signupLink: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  demoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  demoTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 18,
  },
  demoCredential: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
});