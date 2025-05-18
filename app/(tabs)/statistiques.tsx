import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';

const liste = [
  'hammer curl', 'développé couché', 'squat', 'soulevé de terre',
  'traction', 'barre au front', 'curl incliné', 'fentes',
  'développé militaire', 'soulevé de terre jambes tendues',
  'tirage horizontal', 'extension triceps à la poulie haute',
  'curl marteau', 'presse à cuisse', 'dips',
  'abdominaux', 'gainage'
];

const MotionDetection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(liste);

  // 🔍 Fonction pour filtrer la liste
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text.length > 0) {
      const filtered = liste.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(liste); // Si l'input est vide, on affiche tout
    }
  };

  // ✅ Fonction de nettoyage du texte
  const sanitizeInput = (item) => {
    const replacements = {
      'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
      'à': 'a', 'â': 'a', 'ä': 'a',
      'ô': 'o', 'ö': 'o',
      'ù': 'u', 'û': 'u', 'ü': 'u',
      'ç': 'c',
      'ï': 'i', 'î': 'i',
      ' ': '_',
    };

    return item.split('').map(char => replacements[char] || char).join('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Bienvenue dans vos historique de séances 📈</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Cherchez un exercice"
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* 🔽 Liste filtrée */}
      <FlatList
        data={filteredList}
        style={styles.list}
        keyExtractor={(item) => item}
        numColumns={2} // ➡️ Afficher deux colonnes pour un meilleur rendu
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push(`/statistiques/${sanitizeInput(item)}`)}
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
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
  text: { 
    fontSize: 20 
  },
  text_title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    marginTop: 50, 
    marginBottom: 20 
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
    width: '90%',
  },
  item: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
  },
  list: {
    width: '90%',
  },
});

export default MotionDetection;
