// services/userApi.ts

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  avatar: string;
  phone: string;
  location: string;
}

export async function fetchRandomUsers(count: number = 20): Promise<User[]> {
  try {
    console.log('🚀 Запрос к API...');
    const response = await fetch(`https://dummyjson.com/users?limit=${count}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Данные получены:', data);
    
    // Фото для женщин (номера из pravatar.cc)
    const femalePhotos = [1, 4, 5, 9, 10, 16, 20, 23, 24, 25, 26, 27, 28, 29, 32, 33, 37, 41, 44, 45, 47, 48, 49];
    
    // Фото для мужчин (номера из pravatar.cc)
    const malePhotos = [3, 7, 8, 11, 12, 13, 14, 15, 17, 18, 19, 21, 22, 30, 31, 35, 36, 38, 39, 40, 42, 43, 46, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
    
    let femaleIndex = 0;
    let maleIndex = 0;
    
    const users: User[] = data.users.map((item: any) => {
      // Определяем пол и выбираем соответствующее фото
      let photoNum: number;
      
      if (item.gender === 'female') {
        // Берем женское фото
        photoNum = femalePhotos[femaleIndex % femalePhotos.length];
        femaleIndex++;
      } else {
        // Берем мужское фото
        photoNum = malePhotos[maleIndex % malePhotos.length];
        maleIndex++;
      }
      
      // Используем реальное фото из pravatar.cc
      const avatar = `https://i.pravatar.cc/150?img=${photoNum}`;
      
      console.log(`👤 ${item.firstName} ${item.lastName} (${item.gender}) → img=${photoNum}`);
      
      return {
        id: item.id.toString(),
        name: `${item.firstName} ${item.lastName}`,
        age: item.age,
        email: item.email,
        avatar: avatar,
        phone: item.phone,
        location: `${item.address.city}, ${item.address.country}`,
      };
    });

    return users;

  } catch (error) {
    console.error('❌ Ошибка API, используем тестовые данные:', error);
    return getMockUsers(count);
  }
}

// Тестовые данные (фолбэк)
function getMockUsers(count: number): User[] {
  const firstNames = ['Александр', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Елена'];
  const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов'];
  const cities = ['Москва', 'СПб', 'Казань', 'Новосибирск', 'Екатеринбург'];

  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    age: Math.floor(Math.random() * 40) + 20,
    email: `user${i}@example.com`,
    avatar: `https://i.pravatar.cc/150?u=${i}`,
    phone: '+7 (999) 000-00-00',
    location: `${cities[i % cities.length]}, Россия`,
  }));
}