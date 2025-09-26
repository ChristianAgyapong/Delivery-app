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
import { Colors, Gradients } from '../../constants/design';
import { authService, UserRole } from '../../services';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [businessName, setBusinessName] = useState('');
  const [vehicleType, setVehicleType] = useState<'bicycle' | 'motorcycle' | 'car' | 'scooter'>('motorcycle');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = authService.isUserAuthenticated();
      const user = authService.getCurrentUser();
      if (isAuthenticated && user) {
        // Navigate based on user role
        switch (user.role) {
          case 'customer':
            router.replace('/(tabs)/home');
            break;
          case 'restaurant':
            router.replace('/restaurant-dashboard');
            break;
          case 'delivery':
            router.replace('/delivery-dashboard');
            break;
          case 'admin':
            router.replace('/admin-dashboard');
            break;
          default:
            // Default to home screen if role is unknown
            router.replace('/(tabs)/home');
        }
      }
    };
    checkAuth();
  }, [router]);

  // Form validation
  const validateForm = () => {
    if (!firstName.trim()) return 'First name is required';
    if (!lastName.trim()) return 'Last name is required';
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email format is invalid';
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    
    // Role-specific validation
    if (selectedRole === 'restaurant' && !businessName.trim()) {
      return 'Business name is required for restaurant accounts';
    }
    
    return null;
  };

  const handleSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    setLoading(true);
    try {
      // Base signup data
      let signupData: any = {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        password,
        role: selectedRole,
      };
      
      // Add role-specific data
      if (selectedRole === 'restaurant') {
        signupData = {
          ...signupData,
          businessName: businessName
        };
      }
      
      if (selectedRole === 'delivery') {
        signupData = {
          ...signupData,
          vehicleInfo: {
            type: vehicleType,
          }
        };
      }
      
      const result = await authService.signup(signupData);
      
      if (result.success) {
        // Get user immediately after signup
        const user = authService.getCurrentUser();
        
        // Always redirect to home screen after signup
        const redirectPath = '/(tabs)/home';
        
        // Create a message that informs the user about profile synchronization
        const successMessage = 
          `${result.message}\n\nYour account details will be available in your profile.`;
        
        // Show success message and then navigate
        Alert.alert(
          'Account Created Successfully', 
          successMessage,
          [{ 
            text: 'Continue',
            onPress: () => {
              console.log("User registered successfully. Syncing profile data...");
              console.log("Navigating to home screen:", redirectPath);
              router.replace(redirectPath as any);
            }
          }]
        );
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; icon: string; color: string }[] = [
    { value: 'customer', label: 'Customer', icon: 'person', color: '#4CAF50' },
    { value: 'restaurant', label: 'Restaurant', icon: 'restaurant', color: '#FF5722' },
    { value: 'delivery', label: 'Delivery', icon: 'bicycle', color: '#2196F3' },
  ];

  return (
    <LinearGradient colors={Gradients.auth} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>
            </View>

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <Text style={styles.roleTitle}>I am a:</Text>
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

            {/* Signup Form */}
            <View style={styles.form}>
              {/* Personal Information */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Personal Information</Text>
                
                {/* First Name Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
                
                {/* Last Name Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
                
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
                
                {/* Phone Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="call" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number (Optional)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              
              {/* Role-specific Information */}
              {selectedRole === 'restaurant' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>Restaurant Information</Text>
                  
                  {/* Business Name Input */}
                  <View style={styles.inputContainer}>
                    <Ionicons name="business" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Restaurant Name"
                      value={businessName}
                      onChangeText={setBusinessName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}
              
              {selectedRole === 'delivery' && (
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>Vehicle Information</Text>
                  
                  {/* Vehicle Type Selection */}
                  <Text style={styles.inputLabel}>Vehicle Type</Text>
                  <View style={styles.vehicleTypeContainer}>
                    {(['bicycle', 'motorcycle', 'car', 'scooter'] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.vehicleTypeButton,
                          vehicleType === type && styles.vehicleTypeButtonActive,
                        ]}
                        onPress={() => setVehicleType(type)}
                      >
                        <Ionicons
                          name={
                            type === 'bicycle' ? 'bicycle' : 
                            type === 'motorcycle' ? 'bicycle' : 
                            type === 'car' ? 'car' : 'bicycle'
                          }
                          size={20}
                          color={vehicleType === type ? '#FFF' : '#666'}
                        />
                        <Text
                          style={[
                            styles.vehicleTypeText,
                            vehicleType === type && styles.vehicleTypeTextActive,
                          ]}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Security */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Security</Text>
                
                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingRight: 50 }]}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
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
                
                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#CCC', '#AAA'] : Gradients.auth}
                  style={styles.signupButtonGradient}
                >
                  {loading ? (
                    <Text style={styles.signupButtonText}>Creating Account...</Text>
                  ) : (
                    <>
                      <Text style={styles.signupButtonText}>Sign Up</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
                <Text style={styles.signinLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
            
            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
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
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  backButton: {
    marginTop: 20,
    padding: 8,
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  roleContainer: {
    marginBottom: 30,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    color: '#333',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  vehicleTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 3,
    justifyContent: 'center',
  },
  vehicleTypeButtonActive: {
    backgroundColor: Colors.delivery,
  },
  vehicleTypeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  vehicleTypeTextActive: {
    color: '#FFF',
  },
  signupButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  signinText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  signinLink: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    marginBottom: 30,
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  termsLink: {
    color: '#FFF',
    fontWeight: '600',
  },
});