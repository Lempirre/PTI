import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MotionDetection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page où implémenter le modèle IA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20 },
});

export default MotionDetection;
