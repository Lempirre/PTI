import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const liste = [
  "hammer curl",
  "Développé couché",
  "squat",
  "Soulevé de terre",
  "Traction",
  "Barre au front",
  "Curl incliné",
  "Fentes",
  "Développé militaire",
  "Soulevé de terre jambes tendues",
  "Tirage horizontal",
  "Extension triceps à la poulie haute",
  "Curl marteau",
  "Presse à cuisse",
  "Dips",
  "Abdominaux",
  "Gainage",
];

const MotionDetection = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
      é: "e",
      è: "e",
      ê: "e",
      ë: "e",
      à: "a",
      â: "a",
      ä: "a",
      ô: "o",
      ö: "o",
      ù: "u",
      û: "u",
      ü: "u",
      ç: "c",
      ï: "i",
      î: "i",
      " ": "_",
    };

    return item
      .split("")
      .map((char) => replacements[char] || char)
      .join("");
  };

  const data = {
    labels: ["Lundi", "Mardi", "Mercredi", "Jeudi"],
    datasets: [
      {
        data: [10, 20, 25, 22],
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>
        Bienvenue dans vos historique de séances 📈
      </Text>
      <LineChart
        data={data}
        width={Dimensions.get("window").width * 0.9} // 90% de la largeur de l'écran
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

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
    fontSize: 20,
  },
  text_title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
    width: "90%",
  },
  item: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
  },
  list: {
    width: "90%",
  },
});

export default MotionDetection;
