import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname(); // 🔍 Récupère la route actuelle
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // 🚀 Ajout du Footer (seulement si la route n'est pas "/")
  const Footer = () =>
    pathname !== "/" && (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.footerText}>retour à l'Accueil</Text>
        </TouchableOpacity>
        
      </View>
    );

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="not-found" />
      </Stack>
      <StatusBar style="auto" />
      {/* 🚀 Intégration du Footer (si la route est différente de "/") */}
      <Footer />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "blue",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 10,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
