import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, StatusBar, Platform, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

// Функция для правильного склонения "год/года/лет"
function getAgeText(age: number): string {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${age} лет`;
  }
  
  if (lastDigit === 1) {
    return `${age} год`;
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} года`;
  }
  
  return `${age} лет`;
}

export default function UserDetailsScreen() {
  const router = useRouter();
  const { user } = useLocalSearchParams();
  const userData = user ? JSON.parse(user as string) : null;

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Пользователь не найден</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Красивый градиентный хедер */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userTitle}>Профессионал</Text>
        </View>
      </LinearGradient>

      {/* Информация о пользователе */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <InfoRow 
            icon="📧" 
            label="Email" 
            value={userData.email} 
          />
          <Divider />
          <InfoRow 
            icon="🎂" 
            label="Возраст" 
            value={getAgeText(userData.age)} 
          />
          <Divider />
          <InfoRow 
            icon="📍" 
            label="Город" 
            value={userData.location} 
          />
          <Divider />
          <InfoRow 
            icon="📱" 
            label="Телефон" 
            value={userData.phone} 
          />
          <Divider />
          <InfoRow 
            icon="🆔" 
            label="ID" 
            value={userData.id} 
            valueStyle={styles.idText}
          />
        </View>

        {/* Статистика */}
        <View style={styles.statsContainer}>
          <StatBox value="98%" label="Рейтинг" color="#667eea" />
          <StatBox value="156" label="Проектов" color="#764ba2" />
          <StatBox value="24/7" label="Поддержка" color="#f093fb" />
        </View>

        {/* Кнопка назад */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Вернуться к списку</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, valueStyle }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function StatBox({ value, label, color }: any) {
  return (
    <View style={[styles.statBox, { backgroundColor: `${color}15` }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 16,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  scrollView: {
    flex: 1,
    marginTop: -30,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoLabelText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a2e',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  idText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  backButton: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
  },
});