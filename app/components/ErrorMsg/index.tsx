import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorMsgProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({
  message,
  visible,
  onDismiss,
  autoHide = true,
  duration = 4000
}) => {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      if (autoHide) {
        const timer = setTimeout(() => {
          hideMessage();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      hideMessage();
    }
  }, [visible]);

  const hideMessage = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.errorContent}>
        <MaterialIcons name="error-outline" size={20} color="#fff" />
        <Text style={styles.errorText} numberOfLines={2}>
          {message}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideMessage}
        >
          <MaterialIcons name="close" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50, 
    paddingHorizontal: 16,
  },
  errorContent: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 2,
  },
});

export default ErrorMsg;