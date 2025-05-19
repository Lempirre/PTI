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
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
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

  // Navbar simple en haut
  const NavBar = () => (
    <View style={styles.navbar}>
      <Image
        source={require("../assets/images/Logo_AiKido.png")} // remplace par ton image
        style={styles.navImage}
        resizeMode="contain"
      />
      <Text style={styles.navText}>AI Kido</Text>
    </View>
  );

  // Footer conditionnel
  const Footer = () =>
    pathname !== "/" && (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.footerText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      {/* Navbar toujours visible */}
      <NavBar />

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="not-found" />
      </Stack>

      <StatusBar style="auto" />

      {/* Footer conditionnel */}
      <Footer />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 90,
    backgroundColor: "blue",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 30, // pour compenser notch si besoin
  },
  navText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  navImage: {
    width: 40,
    height: 40,
    marginRight: 10, // espace entre l'image et le texte
  },
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
