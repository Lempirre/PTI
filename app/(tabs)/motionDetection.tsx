import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const MotionDetection = () => {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "recording" | "saved"
  >("idle");
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const startRecording = async () => {
    console.log("Démarrage de l'enregistrement...");
    console.log("Référence de la caméra :", cameraRef.current);
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        setRecordingStatus("recording");

        const video = await cameraRef.current.recordAsync({ maxDuration: 10 });
        if (video) {
          console.log("Vidéo enregistrée temporairement :", video.uri);
          saveVideo(video.uri);
        }
      } catch (error) {
        console.error("Erreur de démarrage d'enregistrement :", error);
        Alert.alert("Erreur", "Impossible de démarrer l'enregistrement.");
        setIsRecording(false);
        setRecordingStatus("idle");
      }
    }
  };

  const saveVideo = async (videoUri: string) => {
    try {
      // Générer un nom de fichier unique
      const fileName = `video_${Date.now()}.mp4`;
      const destinationUri = FileSystem.documentDirectory + fileName;

      // Copier la vidéo vers le répertoire local
      await FileSystem.copyAsync({
        from: videoUri,
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
      console.error("Erreur de sauvegarde :", error);
      Alert.alert("Erreur", "Une erreur est survenue pendant la sauvegarde.");
    } finally {
      setIsRecording(false);
      setTimeout(() => setRecordingStatus("idle"), 3000); // Réinitialiser le statut après 3 secondes
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      await cameraRef.current.stopRecording();
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return <Text>Demande de permission en cours...</Text>;
  }

  if (!permission.granted) {
    return <Text>Permission caméra refusée</Text>;
  }

  return (
    <View style={styles.container}>
      {showCamera && (
        <CameraView
          mode="video"
          style={styles.camera}
          ref={cameraRef}
          facing={facing}
          mute={true}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={showCamera ? "Fermer la caméra" : "Ouvrir la caméra"}
          onPress={() => setShowCamera(!showCamera)}
        />
        {showCamera && (
          <Button title="Changer de caméra" onPress={toggleCameraFacing} />
        )}
        {showCamera && !isRecording && (
          <Button title="Enregistrer une vidéo" onPress={startRecording} />
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
    gap: 10,
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
