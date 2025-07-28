import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { LocationService } from '@/services/LocationService';
import { FirestoreService } from '@/services/FirestoreService';

export default function PunchInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePunchIn = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      // Request location permission and get coordinates
      const location = await LocationService.getCurrentLocation();
      
      if (!location) {
        Alert.alert('Location Error', 'Unable to get your location. Please try again.');
        return;
      }

      // Save to Firestore
      const checkIn = {
        userId: user.uid,
        email: user.email,
        timestamp: new Date(),
        latitude: location.latitude,
        longitude: location.longitude,
        // Optional: Add reverse geocoding here
        // address: await LocationService.reverseGeocode(location.latitude, location.longitude)
      };

      await FirestoreService.saveCheckIn(checkIn);
      
      const time = new Date().toLocaleTimeString();
      setLastCheckIn(time);
      
      Alert.alert(
        'Check-in Successful!',
        `You have successfully checked in at ${time}`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Check-in error:', error);
      Alert.alert('Check-in Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Student Check-In</Text>
          <Text style={styles.subtitle}>
            Tap the button below to record your attendance with location verification
          </Text>
        </View>

        <View style={styles.punchInContainer}>
          <View style={styles.iconContainer}>
            <MapPin size={80} color="#000000" />
          </View>
          
          <Button
            mode="outlined"
            onPress={handlePunchIn}
            loading={isLoading}
            disabled={isLoading}
            style={styles.punchInButton}
            labelStyle={styles.punchInButtonText}
          >
            {isLoading ? 'Getting Location...' : 'Punch In'}
          </Button>
        </View>

        {lastCheckIn && (
          <View style={styles.lastCheckInContainer}>
            <CheckCircle size={24} color="#000000" />
            <Text style={styles.lastCheckInText}>
              Last check-in: {lastCheckIn}
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • Your location will be recorded when you check in{'\n'}
            • All data is securely stored and encrypted{'\n'}
            • Check-in history is available in the History tab
          </Text>
        </View>
      </View>
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
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  punchInContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    marginBottom: 32,
  },
  punchInButton: {
    borderColor: '#000000',
    borderWidth: 3,
    paddingVertical: 8,
    paddingHorizontal: 32,
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
  },
  lastCheckInText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  infoContainer: {
    marginTop: 'auto',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});