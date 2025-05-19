import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Video } from "expo-av";
import { ScrollView } from "react-native";

const MotionDetection = () => {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "recording" | "saved"
  >("idle");
  const cameraRef = useRef<CameraView>(null);
  const [processedVideoUri, setProcessedVideoUri] = useState<string | null>(
    null
  );
  const videoRef = useRef<Video>(null);
  const [score, setScore] = useState<number | null>(null);

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

      // Appel de l'upload vers le backend
      await uploadVideo(destinationUri);
      /*
      // Partager la vidéo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(destinationUri);
      } else {
        Alert.alert(
          "Partage non disponible",
          "La fonction de partage n'est pas disponible sur cet appareil."
        );
      }*/
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
      Alert.alert("Erreur", "Une erreur est survenue pendant la sauvegarde.");
    } finally {
      setIsRecording(false);
      setTimeout(() => setRecordingStatus("idle"), 3000); // Réinitialiser le statut après 3 secondes
    }
  };

  const uploadVideo = async (videoUri: string) => {
    try {
      const formData = new FormData();
      formData.append("video", {
        uri: videoUri,
        name: "video.mp4",
        type: "video/mp4",
      } as any);

      const response = await fetch("http://192.168.25.55:5000/process-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Récupération de la réponse JSON
      const responseData = await response.json();

      // Vérification de la présence des données base64
      if (!responseData.video_base64) {
        throw new Error("Aucune donnée vidéo dans la réponse");
      }

      if (!responseData.Score) {
        throw new Error("Aucun score dans la réponse");
      }

      // Affichage du score dans une alerte
      Alert.alert(
        `Votre score pour cette séance est de : ${responseData.Score}%`
      );

      // Conversion base64 -> fichier vidéo
      const processedUri =
        FileSystem.documentDirectory + `processed_${Date.now()}.mp4`;
      await FileSystem.writeAsStringAsync(
        processedUri,
        responseData.video_base64,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      // Mise à jour de l'état avec la nouvelle URI
      setProcessedVideoUri(processedUri);
      setScore(responseData.Score);
      Alert.alert("Succès", "Vidéo traitée reçue avec succès !");
    } catch (error) {
      console.error("Erreur d'upload:", error);
      //Alert.alert("Erreur", error.message || "Échec de la communication avec le serveur");
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
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
            <Button title="Enregistrer 10s" onPress={startRecording} />
          )}
          {showCamera && isRecording && (
            <Button title="Stopper" onPress={stopRecording} color="red" />
          )}
        </View>

        {recordingStatus === "recording" && (
          <Text style={styles.recordingText}>
            🎥 Enregistrement en cours...
          </Text>
        )}
        {recordingStatus === "saved" && (
          <Text style={styles.savedText}>
            ✅ Vidéo sauvegardée avec succès !
          </Text>
        )}
        {processedVideoUri && (
          <View style={styles.videoContainer}>
            <Text style={styles.sectionTitle}>Vidéo Traitée:</Text>
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: processedVideoUri }}
              useNativeControls
              resizeMode={"contain" as any}
              isLooping
            />
            {score !== null && (
              <Text style={styles.scoreText}>
                Score: {score.toFixed(1)}/100 {/* Assuming score is 0-100 */}
              </Text>
            )}

            <Button
              title="Effacer"
              onPress={() => {
                setProcessedVideoUri(null);
                setScore(null);
              }}
              color="grey"
            />
          </View>
        )}
      </ScrollView>
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
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
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
  videoContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  video: {
    width: 300,
    height: 300,
    backgroundColor: "black",
    borderRadius: 10,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
    marginVertical: 10,
    textAlign: "center",
  },
});

export default MotionDetection;
