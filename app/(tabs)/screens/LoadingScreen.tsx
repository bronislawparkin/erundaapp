import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

interface LoadingScreenProps {
  progress?: number;
}

export default function LoadingScreen({ progress = 0 }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Спиннер */}
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
        
        {/* Иконка */}
        <View style={styles.avatarLoading}>
          <Text style={styles.avatarLoadingIcon}>👥</Text>
        </View>
        
        {/* Текст */}
        <Text style={styles.loadingTitle}>Загружаем пользователей</Text>
        <Text style={styles.loadingSubtitle}>Это займёт пару секунд...</Text>
        
        {/* Прогресс с динамической шириной */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  spinner: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  avatarLoading: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 24,
  },
  avatarLoadingIcon: {
    fontSize: 40,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
});