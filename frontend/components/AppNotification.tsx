import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

const { width } = Dimensions.get('window');

export const AppNotification: React.FC<NotificationProps> = ({
  type,
  message,
  visible,
  onDismiss,
  duration = 4000,
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      const timer = setTimeout(() => {
        hideNotification();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const getNotificationConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#32CD32',
          icon: 'checkmark-circle',
          iconColor: '#fff',
        };
      case 'error':
        return {
          backgroundColor: '#FF4444',
          icon: 'alert-circle',
          iconColor: '#fff',
        };
      case 'warning':
        return {
          backgroundColor: '#FFA500',
          icon: 'warning',
          iconColor: '#fff',
        };
      default:
        return {
          backgroundColor: '#4ECDC4',
          icon: 'information-circle',
          iconColor: '#fff',
        };
    }
  };

  if (!visible) return null;

  const config = getNotificationConfig();

  return (
    <Animated.View
      style={[
        styles.notification,
        { backgroundColor: config.backgroundColor },
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name={config.icon as any} size={24} color={config.iconColor} />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
        <Ionicons name="close" size={20} color={config.iconColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    visible: boolean;
  }>({
    type: 'info',
    message: '',
    visible: false,
  });

  const showNotification = (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string
  ) => {
    setNotification({ type, message, visible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const showSuccess = (message: string) => showNotification('success', message);
  const showError = (message: string) => showNotification('error', message);
  const showInfo = (message: string) => showNotification('info', message);
  const showWarning = (message: string) => showNotification('warning', message);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50, // Account for status bar
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});