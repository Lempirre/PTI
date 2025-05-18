import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { Camera, CameraView, CameraType } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const MotionDetection = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "recording" | "saved"
  >("idle");
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        setRecordingStatus("recording");
        const video = await cameraRef.current.recordAsync({ maxDuration: 10 });
        console.log("Vidéo enregistrée temporairement :", video.uri);

        // Générer un nom de fichier unique
        const fileName = `video_${Date.now()}.mp4`;
        const destinationUri = FileSystem.documentDirectory + fileName;

        // Copier la vidéo vers le répertoire local
        await FileSystem.copyAsync({
          from: video.uri,
          to: destinationUri,
        });

        Alert.alert(
          "Vidéo enregistrée",
          `Fichier sauvegardé :\n${destinationUri}`
        );

        setRecordingStatus("saved");

        // Partager la vidéo
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(destinationUri);
        } else {
          Alert.alert(
            "Partage non disponible",
            "La fonction de partage n'est pas disponible sur cet appareil."
          );
        }
      } catch (error) {
        console.error("Erreur d'enregistrement :", error);
        Alert.alert(
          "Erreur",
          "Une erreur est survenue pendant l'enregistrement."
        );
      } finally {
        setIsRecording(false);
        setTimeout(() => setRecordingStatus("idle"), 3000); // Réinitialiser le statut après 3 secondes
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  if (hasPermission === null) {
    return <Text>Demande de permission en cours...</Text>;
  }

  if (!hasPermission) {
    return <Text>Permission caméra refusée</Text>;
  }

  return (
    <View style={styles.container}>
      {showCamera && <CameraView style={styles.camera} />}
      <View style={styles.buttonContainer}>
        <Button
          title={showCamera ? "Fermer la caméra" : "Ouvrir la caméra"}
          onPress={() => setShowCamera(!showCamera)}
        />
        {showCamera && !isRecording && (
          <Button title="Enregistrer 10s" onPress={startRecording} />
        )}
        {showCamera && isRecording && (
          <Button title="Stopper" onPress={stopRecording} color="red" />
        )}
      </View>

      {recordingStatus === "recording" && (
        <Text style={styles.recordingText}>🎥 Enregistrement en cours...</Text>
      )}
      {recordingStatus === "saved" && (
        <Text style={styles.savedText}>✅ Vidéo sauvegardée avec succès !</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  recordingText: {
    marginTop: 10,
    color: "red",
    fontWeight: "bold",
  },
  savedText: {
    marginTop: 10,
    color: "green",
    fontWeight: "bold",
  },
});

export default MotionDetection;
