import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MotionDetection = () => {
  // Exemple de données utilisateur (tu peux les remplacer par des props ou contexte)
  const userInfo = {
    username: "Mehdi",
    email: "Mehdi@example.com",
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_title}>Bienvenue sur votre profil 🏋️</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nom :</Text>
        <Text style={styles.value}>{userInfo.username}</Text>

        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>{userInfo.email}</Text>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "flex-start", 
    alignItems: "center",
    backgroundColor: "#eeebeb",
  },
  header: {
    padding: 20,
  },
  text_title: { 
    fontSize: 40, 
    fontWeight: "bold", 
    marginTop: 50,
    textAlign: "center",
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // ombre android
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
});

export default MotionDetection;
