import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const data = {
  labels: [1, 2, 3, 4, 5,6,7,8,9,10],
  datasets: [
    {
      data: [10, 20, 25, 32, 40,45,48,52,56,60,],
      strokeWidth: 2,
    },
  ],
};

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const MotionDetection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_title}>Bienvenue sur votre profil hammer curl🏋️</Text>
      </View>
      <View style={styles.graphSection}>
        <Text style={styles.text_subtitle}>Evolution de votre progression </Text>
        <LineChart
          data={data}
          width={width * 0.9}
          height={220}
          chartConfig={chartConfig}
          style={styles.graph}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    backgroundColor: '#eeebeb',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  graphSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  text_title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginTop: 50, 
    textAlign: 'center',
  },
  text_subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fb8c00',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  graph: {
    borderRadius: 16,
  }
});

export default MotionDetection;

