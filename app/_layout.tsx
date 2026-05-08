/**
 * Root Layout · 根布局
 *
 * 定义所有 16 屏的 Stack 导航。Pace. 没有 Tab Bar（设计哲学：单线程 UX）。
 * 所有屏幕都是 Stack 入栈，部分屏（教练、设置、分享）以 modal 方式呈现。
 *
 * 字体在此处统一加载，避免 FOUT (flash of unstyled text)。
 */

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

// 启动屏保持显示直到字体加载完
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Expo Go 默认不支持自定义字体打包，所以我们走 Google Fonts CDN
  // (要 import 的库是 @expo-google-fonts/inter 等，但这里先用 system font 兜底)
  const [fontsLoaded, fontError] = useFonts({
    // 第一轮 v0.1 我们使用 iOS 系统字体兜底 (San Francisco 是 Inter 的近亲)
    // 后续会接入 Google Fonts:
    // 'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    // 'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    // 'JetBrainsMono-Regular': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    // 'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
    // 'NotoSansSC-Regular': require('../assets/fonts/NotoSansSC-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 如果字体还没加载，先返回空（splash screen 会一直显示）
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#000' },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="pre-run"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="run"
              options={{
                gestureEnabled: false, // 防止从 /run 滑动手势返回，必须长按暂停
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="pause"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: false,
              }}
            />
            {/* 后续屏将在 v0.3+ 注册：
            <Stack.Screen name="post-run" />
            <Stack.Screen name="share" options={{ presentation: 'modal' }} />
            <Stack.Screen name="coach" options={{ presentation: 'modal' }} />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
            */}
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
