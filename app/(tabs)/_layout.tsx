import { Tabs } from 'expo-router';
import { HomeIcon, UserIcon, BookOpenIcon, CameraIcon, StoreIcon } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 24 : 8);
  const tabHeight = 56 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#58CC02', // primary-500
        tabBarInactiveTintColor: '#757793', // neutral-400
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB', // neutral-200/70
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Học',
          tabBarIcon: ({ color, focused }) => (
            <BookOpenIcon color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Chụp ảnh',
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused }) => (
            <View
              className={`rounded-full items-center justify-center -mt-5 border-2 border-white ${
                focused ? 'bg-mascot-600 scale-105' : 'bg-mascot-500'
              }`}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
              }}
            >
              <CameraIcon color="white" size={24} strokeWidth={2.5} />
            </View>
          ),
          tabBarLabel: () => null, // Ẩn label để tôn vinh nút Scan trung tâm
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Cửa hàng',
          tabBarIcon: ({ color, focused }) => (
            <StoreIcon color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color, focused }) => (
            <UserIcon color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
          ),
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

