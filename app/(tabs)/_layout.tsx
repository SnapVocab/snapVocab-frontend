import { Tabs } from 'expo-router';
import { HomeIcon, UserIcon, BookOpenIcon, CameraIcon, StoreIcon } from 'lucide-react-native';
import { Platform, View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#58CC02', // primary-500
        tabBarInactiveTintColor: '#9597AD', // neutral-300
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#D4D5DF', // neutral-100
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Học',
          tabBarIcon: ({ color }) => <BookOpenIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Chụp ảnh',
          tabBarIcon: ({ focused }) => (
            <View
              className={`w-12 h-12 rounded-full items-center justify-center -mt-4 shadow-sm ${
                focused ? 'bg-primary-500 shadow-primary-500/30' : 'bg-neutral-800 shadow-black/20'
              }`}
              style={{
                elevation: 4,
              }}
            >
              <CameraIcon color="white" size={24} />
            </View>
          ),
          tabBarLabel: () => null, // Ẩn chữ để icon lồi lên
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Cửa hàng',
          tabBarIcon: ({ color }) => <StoreIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color }) => <UserIcon color={color} size={24} />,
        }}
      />
      
      {/* ==========================================
          HIDDEN TABS
          ========================================== */}
      <Tabs.Screen name="achievements" options={{ href: null }} />
      <Tabs.Screen name="stats" options={{ href: null }} />
      <Tabs.Screen name="missions" options={{ href: null }} />
      <Tabs.Screen name="leaderboard" options={{ href: null }} />
    </Tabs>
  );
}
