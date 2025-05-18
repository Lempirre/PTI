import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

const cards = [
  {
    title: "💪 Analyse du mouvement",
    route: "/motionDetection",
    color: "#2ecc71",
  },
  { title: "📈 Statistiques", route: "/statistiques", color: "#f39c12" },
  { title: "👤 Profil", route: "/profil", color: "#9b59b6" },
] as const;

const IndexScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Bienvenue sur AI Kido 🏋️‍♂️</Text>
      <View style={styles.cardContainer}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: card.color }]}
            onPress={() => router.push(card.route)}
          >
            <Text style={styles.cardText}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#f4f6f8",
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#eeebeb",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#2c3e50",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  card: {
    paddingVertical: 30,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default IndexScreen;
