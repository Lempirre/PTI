import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MotionDetection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_title}>
          Bienvenue sur votre profil - Squat🏋️
        </Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.text_title}>
          Aucune donnée disponible pour cet exercice 😞
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#eeebeb",
  },
  text: {
    fontSize: 20,
  },
  text_title: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 50,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
    marginTop: 20,
  },
  middle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MotionDetection;
