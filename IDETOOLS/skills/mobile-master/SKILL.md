---
name: mobile-master
description: >
  Comprehensive mobile development guide covering iOS and Android design
  patterns, React Native/Expo, responsive layouts, and mobile-specific
  UX. Consolidates 4 mobile skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# Mobile Master Skill

Comprehensive mobile development guide covering cross-platform frameworks, iOS/Android design systems, responsive layouts, performance optimization, and mobile-specific UX patterns.

## 1. When to Use

Invoke this skill when:
- Building a mobile app from scratch
- Converting a web app to mobile
- User mentions "React Native", "Expo", "iOS", "Android", "mobile app"
- Implementing mobile-specific features (gestures, haptics, camera, location)
- Designing for touch interfaces
- Preparing app store submissions
- Building simple mobile games
- Optimizing mobile performance

**NOT for:**
- Desktop-only applications
- Pure web applications (use vercel-react-best-practices instead)
- Complex 3D games (use Unity/Unreal instead)

## 2. Platform Choice

### React Native with Expo (Recommended Default)

**Use when:**
- Team knows JavaScript/TypeScript and React
- Need to ship iOS + Android from single codebase
- Budget/timeline favor cross-platform
- App is content-driven (social, e-commerce, productivity)
- Rapid iteration and OTA updates are valuable

**Advantages:**
- Single codebase for both platforms
- Expo Application Services (EAS) for builds and updates
- Rich ecosystem (navigation, state management, UI libraries)
- Hot reload during development
- JavaScript bridge allows native module integration

**Limitations:**
- Performance ceiling lower than native (rarely an issue for business apps)
- Some native APIs require custom modules
- Larger bundle sizes than native

### Flutter

**Use when:**
- Team prefers Dart or wants UI consistency across platforms
- High-performance custom animations are critical
- Desktop/web targets are also needed

**Advantages:**
- Excellent performance (compiled to native code)
- Beautiful default UI components
- Strong typing with Dart

**Limitations:**
- Smaller community than React Native
- Less JavaScript ecosystem integration

### Native (Swift/Kotlin)

**Use when:**
- App is platform-exclusive (iOS-only or Android-only)
- Need absolute maximum performance (AR, gaming, media processing)
- Deep platform integration required (HomeKit, HealthKit, custom Android services)

**Advantages:**
- Best performance and platform integration
- Access to newest platform APIs immediately
- Smaller binary sizes

**Limitations:**
- Separate codebases for iOS and Android
- Longer development cycles

## 3. React Native with Expo

### Project Setup

```bash
# Create new Expo project (SDK 52+)
npx create-expo-app my-app --template blank-typescript

cd my-app

# Install dependencies
npx expo install react-native-safe-area-context react-native-screens
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install expo-font expo-splash-screen
```

### File Structure

```
my-app/
├── app/                    # App Router (Expo Router) or screens
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx
│   └── [id].tsx           # Dynamic route
├── components/            # Reusable components
├── hooks/                 # Custom hooks
├── constants/             # Colors, sizes, config
├── assets/                # Images, fonts
├── app.json              # Expo config
└── package.json
```

### Navigation (React Navigation)

```tsx
// app/_layout.tsx (Expo Router example)
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

// Or traditional React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Common Libraries

| Purpose | Library |
|---------|---------|
| Navigation | `@react-navigation/native`, `expo-router` |
| State Management | `zustand`, `@tanstack/react-query` |
| Forms | `react-hook-form` + `zod` |
| UI Components | `react-native-paper`, NativeBase |
| Icons | `@expo/vector-icons` |
| Animations | `react-native-reanimated`, `moti` |
| Storage | `@react-native-async-storage/async-storage` |
| Auth | `expo-auth-session`, Supabase, Clerk |

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios --profile preview

# Build for Android
eas build --platform android --profile preview

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## 4. iOS Design Guidelines

Follow Apple's Human Interface Guidelines (HIG):

### Safe Areas

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      {/* Content automatically avoids notch, home indicator */}
    </SafeAreaView>
  );
}
```

### Navigation Patterns

**Tab Bar (Primary Navigation):**
- Maximum 5 tabs
- Place at bottom
- Active state with color + icon fill
- Use SF Symbols for icons

**Navigation Bar:**
- Large title that collapses on scroll
- Back button automatically provided
- Right-side action buttons (max 2-3)

```tsx
<Stack.Screen
  name="Home"
  options={{
    title: 'My App',
    headerLargeTitle: true, // iOS 11+ style
    headerSearchBarOptions: { placeholder: 'Search' },
  }}
/>
```

### Typography

- **San Francisco (SF Pro)** system font
- Dynamic Type support (user can adjust size)
- Weights: Regular, Medium, Semibold, Bold

```tsx
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: '700', // Bold
    letterSpacing: 0.37,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E93', // Secondary label color
  },
});
```

### Colors

**iOS System Colors:**
- Primary: `#007AFF` (blue)
- Success: `#34C759` (green)
- Destructive: `#FF3B30` (red)
- Backgrounds: `#FFFFFF` (light), `#000000` (dark)
- Secondary backgrounds: `#F2F2F7` (light), `#1C1C1E` (dark)

Support dark mode:

```tsx
import { useColorScheme } from 'react-native';

export default function ThemedView({ children }) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';

  return <View style={{ backgroundColor }}>{children}</View>;
}
```

### SF Symbols

```tsx
import { Ionicons } from '@expo/vector-icons'; // Closest to SF Symbols

<Ionicons name="heart" size={24} color="#FF3B30" />
<Ionicons name="heart-outline" size={24} color="#8E8E93" />
```

### Haptics

```tsx
import * as Haptics from 'expo-haptics';

// On button press
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// On success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// On error
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

## 5. Android Design Guidelines

Follow Material Design 3 principles:

### Navigation Patterns

**Bottom Navigation:**
- 3-5 top-level destinations
- Active state with color fill + label

**Navigation Drawer:**
- For apps with many sections
- Swipe from left edge
- Use `@react-navigation/drawer`

**System Back Button:**
- Always handle hardware back button
- React Navigation handles automatically

```tsx
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      // Custom back behavior
      return true; // Prevent default
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [])
);
```

### Material Design 3 Components

Use `react-native-paper`:

```tsx
import { Button, Card, FAB, Snackbar } from 'react-native-paper';

<Button mode="contained" onPress={handlePress}>
  Contained Button
</Button>

<FAB
  icon="plus"
  style={{ position: 'absolute', right: 16, bottom: 16 }}
  onPress={handleCreate}
/>

<Card>
  <Card.Title title="Card Title" subtitle="Card Subtitle" />
  <Card.Content>
    <Text>Card content</Text>
  </Card.Content>
</Card>
```

### Elevation & Shadows

```tsx
const styles = StyleSheet.create({
  card: {
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
```

### Colors

**Material You (Material 3):**
- Dynamic color based on user wallpaper
- Tonal palettes (primary, secondary, tertiary)

```tsx
import { MD3LightTheme, MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    secondary: '#625B71',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      {/* App content */}
    </PaperProvider>
  );
}
```

### Ripple Effect

```tsx
import { Pressable, Platform } from 'react-native';

<Pressable
  android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
  onPress={handlePress}
>
  <Text>Pressable with Ripple</Text>
</Pressable>
```

## 6. Mobile UX Patterns

### Touch Targets

**Minimum size:** 44pt × 44pt (iOS), 48dp × 48dp (Android)

```tsx
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Gestures

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const offset = useSharedValue(0);

const pan = Gesture.Pan()
  .onChange((event) => {
    offset.value += event.changeX;
  });

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }],
}));

<GestureDetector gesture={pan}>
  <Animated.View style={animatedStyle}>
    {/* Swipeable content */}
  </Animated.View>
</GestureDetector>
```

### Pull to Refresh

```tsx
import { RefreshControl, ScrollView } from 'react-native';

const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await fetchData();
  setRefreshing(false);
};

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
  {/* Content */}
</ScrollView>
```

### Infinite Scroll

```tsx
import { FlatList } from 'react-native';

const [loading, setLoading] = useState(false);

const loadMore = async () => {
  if (loading) return;
  setLoading(true);
  await fetchMoreData();
  setLoading(false);
};

<FlatList
  data={items}
  renderItem={renderItem}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5} // Trigger when 50% from bottom
  ListFooterComponent={loading ? <Spinner /> : null}
/>
```

### Offline-First

```tsx
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Check connectivity
const unsubscribe = NetInfo.addEventListener(state => {
  console.log('Connection type', state.type);
  console.log('Is connected?', state.isConnected);
});

// Cache data
const cacheData = async (key: string, data: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

const getCachedData = async (key: string) => {
  const cached = await AsyncStorage.getItem(key);
  return cached ? JSON.parse(cached) : null;
};
```

### Loading States

```tsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState(null);

useEffect(() => {
  fetchData()
    .then(setData)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, []);

if (loading) return <ActivityIndicator />;
if (error) return <ErrorView message={error} />;
return <DataView data={data} />;
```

## 7. Responsive Layouts

### Dimensions API

```tsx
import { Dimensions, useWindowDimensions } from 'react-native';

// Static (doesn't update on orientation change)
const { width, height } = Dimensions.get('window');

// Dynamic (hook updates on rotation)
export default function Screen() {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;

  return (
    <View style={{ flexDirection: isTablet ? 'row' : 'column' }}>
      {/* Layout adapts to screen size */}
    </View>
  );
}
```

### Tablet Layouts

```tsx
const styles = StyleSheet.create({
  container: {
    flexDirection: width >= 768 ? 'row' : 'column',
  },
  sidebar: {
    width: width >= 768 ? 300 : width,
  },
  main: {
    flex: 1,
  },
});
```

### Orientation Handling

```tsx
import * as ScreenOrientation from 'expo-screen-orientation';

// Lock orientation
await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

// Listen for changes
ScreenOrientation.addOrientationChangeListener((event) => {
  console.log('Orientation:', event.orientationInfo.orientation);
});
```

### Responsive Typography

```tsx
import { PixelRatio } from 'react-native';

const normalize = (size: number) => {
  const scale = width / 375; // Base on iPhone 12
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const styles = StyleSheet.create({
  title: {
    fontSize: normalize(24),
  },
});
```

## 8. Performance

### FlatList Optimization

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // Performance props
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

**Memoize list items:**

```tsx
const renderItem = useCallback(({ item }) => (
  <MemoizedItem item={item} />
), []);

const MemoizedItem = React.memo(({ item }) => (
  <View>{/* Item content */}</View>
));
```

### Image Optimization

```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk" // Cache images
/>
```

### Reducing Bridge Calls

**Bad (multiple bridge calls):**
```tsx
items.forEach(item => {
  updateUI(item); // Bridge call per item
});
```

**Good (batch updates):**
```tsx
const updates = items.map(processItem);
updateUIBatch(updates); // Single bridge call
```

### Hermes Engine

Enable in `app.json`:

```json
{
  "expo": {
    "jsEngine": "hermes",
    "android": {
      "enableHermes": true
    },
    "ios": {
      "jsEngine": "hermes"
    }
  }
}
```

**Benefits:**
- Faster startup times
- Lower memory usage
- Improved performance

### Profiling

```bash
# React Native performance monitor
# Shake device -> Show Perf Monitor

# Flipper for debugging
npx react-native-flipper
```

## 9. App Store Submission

### iOS App Store Checklist

**App Store Connect:**
1. Create app record (Bundle ID, name, SKU)
2. Fill metadata (description, keywords, category)
3. Add screenshots (6.7", 6.5", 5.5" required)
4. Set pricing and availability
5. Add privacy policy URL
6. Complete App Privacy questionnaire

**Binary Requirements:**
- Valid provisioning profile
- App icons (1024×1024 App Store icon + all sizes in Assets.xcassets)
- Launch screen (LaunchScreen.storyboard or static image)
- Support latest iOS version and iPhone screen sizes

**Build with EAS:**

```bash
eas build --platform ios --profile production

# Submit
eas submit --platform ios
```

**Common rejection reasons:**
- Crashes or bugs
- Missing privacy descriptions (Camera, Location, Photos)
- Incomplete or misleading metadata
- Violating App Store Review Guidelines

### Google Play Checklist

**Google Play Console:**
1. Create app (package name, default language)
2. Set up store listing (title, short/full description)
3. Add graphics (icon, feature graphic, screenshots)
4. Fill content rating questionnaire
5. Set pricing and distribution
6. Add privacy policy URL

**Binary Requirements:**
- Signed APK or AAB (Android App Bundle preferred)
- Target latest Android API level (or within 1 year)
- Adaptive icon

**Build with EAS:**

```bash
eas build --platform android --profile production

# Submit
eas submit --platform android
```

**Common rejection reasons:**
- Missing privacy policy
- Incomplete content rating
- Violating Google Play policies
- Requesting unnecessary permissions

### Screenshot Sizes

**iOS:**
- 6.7" (iPhone 14 Pro Max): 1290×2796
- 6.5" (iPhone 11 Pro Max): 1242×2688
- 5.5" (iPhone 8 Plus): 1242×2208

**Android:**
- Minimum 2 screenshots (max 8)
- Recommended: 1080×1920 (portrait) or 1920×1080 (landscape)

## 10. Mobile Games

### React Native Game Engine

```bash
npm install react-native-game-engine
```

**Basic game loop:**

```tsx
import { GameEngine } from 'react-native-game-engine';

const entities = {
  player: {
    position: { x: 100, y: 100 },
    size: { width: 50, height: 50 },
    renderer: <Player />,
  },
};

const physics = (entities, { time }) => {
  // Update entity positions
  entities.player.position.x += 1;
  return entities;
};

export default function Game() {
  return (
    <GameEngine
      systems={[physics]}
      entities={entities}
    />
  );
}
```

### Animation with Reanimated

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

export default function Sprite() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const bounce = () => {
    scale.value = withSpring(1.2);
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1);
  };

  return (
    <Animated.View style={animatedStyle}>
      {/* Sprite image */}
    </Animated.View>
  );
}
```

### Simple Game Patterns

**Collision Detection:**

```tsx
const checkCollision = (a, b) => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};
```

**Touch Input:**

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const tap = Gesture.Tap().onEnd(() => {
  // Handle tap
  shootBullet();
});

<GestureDetector gesture={tap}>
  <View style={{ flex: 1 }}>
    {/* Game canvas */}
  </View>
</GestureDetector>
```

**Score & State:**

```tsx
import { create } from 'zustand';

const useGameStore = create((set) => ({
  score: 0,
  lives: 3,
  gameOver: false,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  loseLife: () => set((state) => {
    const newLives = state.lives - 1;
    return { lives: newLives, gameOver: newLives === 0 };
  }),
  reset: () => set({ score: 0, lives: 3, gameOver: false }),
}));
```

**Performance Tips for Games:**
- Use `react-native-reanimated` (runs on UI thread)
- Minimize bridge calls (keep game logic in worklets)
- Use `InteractionManager.runAfterInteractions()` for non-critical updates
- Pre-load all assets (images, sounds) before game starts
- Consider native modules for physics engines (Box2D, Matter.js)

---

## Summary

This skill consolidates mobile development best practices across:
- **Platform choice** (React Native/Expo for most cases)
- **iOS design** (HIG, Safe Areas, SF Symbols, haptics)
- **Android design** (Material 3, navigation patterns, ripple)
- **Mobile UX** (touch targets, gestures, offline-first, loading states)
- **Responsive layouts** (tablet support, orientation handling)
- **Performance** (FlatList, image caching, Hermes)
- **App store submission** (checklists for iOS and Android)
- **Mobile games** (React Native Game Engine, Reanimated, simple patterns)

Use React Native with Expo as the default unless there's a specific reason to go native. Follow platform conventions (HIG for iOS, Material for Android) while maintaining a consistent brand identity. Optimize early (FlatList, images, animations) to avoid performance issues at scale.
