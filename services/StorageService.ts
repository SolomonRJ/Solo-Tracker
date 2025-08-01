import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';

export class StorageService {
  static async uploadCheckInPhoto(userId: string, imageUri: string): Promise<string> {
    try {
      // Compress and resize the image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Convert to blob
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();

      // Create unique filename
      const timestamp = Date.now();
      const filename = `checkins/${userId}/${timestamp}.jpg`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Storage upload error:', error);
      throw new Error('Failed to upload photo. Please try again.');
    }
  }
}