import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, CheckCircle, Camera } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { LocationService } from '@/services/LocationService';
import { FirestoreService } from '@/services/FirestoreService';
import { StorageService } from '@/services/StorageService';
import { CircularCameraView } from '@/components/CircularCameraView';

export default function PunchInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const { user, userDisplayName, userPhotoURL } = useAuth();
  
  // Animation for success feedback
  const scaleAnim = new Animated.Value(1);

  const handlePunchIn = () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    setCameraVisible(true);
  };

  const handlePhotoCapture = async (imageUri: string) => {
    setCameraVisible(false);
    setIsLoading(true);

    try {
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      // Get location
      const location = await LocationService.getCurrentLocation();
      if (!location) {
        Alert.alert('Location Error', 'Could not retrieve location');
        return;
      }

      // Upload photo to Firebase Storage
      const photoURL = await StorageService.uploadCheckInPhoto(user.uid, imageUri);

      // Save check-in data
      const checkIn = {
        userId: user.uid,
        email: user.email || '',
        userName: userDisplayName,
        timestamp: new Date(),
        latitude: location.latitude,
        longitude: location.longitude,
        photoURL: photoURL,
      };

      await FirestoreService.saveCheckIn(checkIn);

      const time = new Date().toLocaleTimeString();
      setLastCheckIn(time);

      // Success animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert('Check-in Successful!', `Checked in at ${time}`);
    } catch (err: any) {
      console.error('Check-in error:', err);
      Alert.alert('Check-in Failed', err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userGreeting}>
            {userPhotoURL && (
              <Image source={{ uri: userPhotoURL }} style={styles.userAvatar} />
            )}
            <View>
              <Text style={styles.greeting}>Hi, {userDisplayName}!</Text>
              <Text style={styles.subtitle}>Ready to check in?</Text>
            </View>
          </View>
        </View>

        <Animated.View style={[styles.punchInContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Camera size={60} color="#000000" />
            </View>
          </View>

          <Text style={styles.punchInTitle}>Tap to Check In</Text>
          <Text style={styles.punchInDescription}>
            We'll capture your photo and location for attendance
          </Text>

          <Button
            mode="outlined"
            onPress={handlePunchIn}
            loading={isLoading}
            disabled={isLoading}
            style={styles.punchInButton}
            labelStyle={styles.punchInButtonText}
            icon={() => <MapPin size={20} color="#000000" />}
          >
            {isLoading ? 'Processing...' : 'Punch In'}
          </Button>
        </Animated.View>

        {lastCheckIn && (
          <View style={styles.lastCheckInContainer}>
            <CheckCircle size={24} color="#22c55e" />
            <Text style={styles.lastCheckInText}>
              Last check-in: {lastCheckIn}
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>📸 Take a quick selfie</Text>
            <Text style={styles.infoItem}>📍 Capture your location</Text>
            <Text style={styles.infoItem}>☁️ Securely store in cloud</Text>
            <Text style={styles.infoItem}>📊 View history anytime</Text>
          </View>
        </View>
      </View>

      <CircularCameraView
        visible={cameraVisible}
        onClose={() => setCameraVisible(false)}
        onCapture={handlePhotoCapture}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  userGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000000',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 2,
  },
  punchInContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 24,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderRadius: 16,
    backgroundColor: '#fafafa',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  punchInTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  punchInDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  punchInButton: {
    borderColor: '#000000',
    borderWidth: 3,
    paddingVertical: 8,
    paddingHorizontal: 32,
    backgroundColor: '#ffffff',
  },
  punchInButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastCheckInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  lastCheckInText: {
    fontSize: 16,
    color: '#15803d',
    fontWeight: '500',
  },
  infoContainer: {
    marginTop: 'auto',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});