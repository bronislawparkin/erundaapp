import React, { useState, useCallback, useEffect } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, 
  RefreshControl, Image, StyleSheet, ActivityIndicator, 
  Alert, StatusBar, Platform
} from "react-native";
import { useRouter } from "expo-router";
import { fetchRandomUsers, type User } from "../../services/userApi";
import LoadingScreen from "./LoadingScreen";

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

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(0);

  const loadUsers = async () => {
    setProgress(0);
    let progressInterval: any;
    try {
      // Анимация прогресса
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 0.9) {
            clearInterval(progressInterval);
            return 0.9;
          }
          return prev + 0.03;
        });
      }, 200);

      const data = await fetchRandomUsers(20);
      
      clearInterval(progressInterval);
      setProgress(1);

      setTimeout(() => {
        setUsers(data);
        setLoading(false);
      }, 300);
      
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить пользователей');
      clearInterval(progressInterval);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    await loadUsers();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item, index }: { item: User; index: number }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: "/screens/UserDetailsScreen",
          params: { user: JSON.stringify(item) }
        });
      }}
    >
      <View style={[styles.card, { animationDelay: `${index * 50}ms` }]}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.statusIndicator} />
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.userMeta}>
            <Text style={styles.metaItem}>📍 {item.location}</Text>
            <Text style={styles.metaItem}>🎂 {getAgeText(item.age)}</Text>
          </View>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>

        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Красивый хедер с градиентом */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>👥 Команда</Text>
            <Text style={styles.headerSubtitle}>
              {users.length} профессионалов
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{users.length}</Text>
          </View>
        </View>
      </View>

      {/* Список пользователей */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#667eea"
            colors={['#667eea', '#764ba2']}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerBadge: {
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#667eea',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: '#10b981',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaItem: {
    fontSize: 13,
    color: '#6b7280',
    marginRight: 16,
  },
  userEmail: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  arrow: {
    fontSize: 20,
    color: '#667eea',
    fontWeight: 'bold',
  },
});