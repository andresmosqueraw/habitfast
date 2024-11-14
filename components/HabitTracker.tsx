import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

// Configuración inicial
const startDate = new Date(2024, 6, 1); // 1 de julio de 2024
const today = new Date();
const timeDiff = Math.abs(startDate.getTime() - today.getTime());
const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Total de días entre startDate y hoy
const rows = 7; // Número de filas (alto)
const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D']; // Letras de los días de la semana, fija en cada fila

// Función para obtener la letra y número de cada día a partir de una fecha
function getDayLabelAndNumber(rowIndex: number, colIndex: number) {
  const currentDate = new Date(startDate);
  const dayIndex = colIndex * rows + rowIndex; // Índice del día en la cuadrícula
  currentDate.setDate(startDate.getDate() + dayIndex); // Avanza 'dayIndex' días desde la fecha inicial

  const dayLabel = daysOfWeek[rowIndex]; // Usa el índice de la fila para obtener el día fijo
  const dayNumber = currentDate.getDate(); // Obtiene el número de día del mes
  
  return `${dayLabel}${dayNumber}`;
}

export default function HabitTracker() {
  // Calcula el número de columnas necesarias
  const columns = Math.ceil(totalDays / rows);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ir al gym</Text>
      </View>
      <ScrollView 
        horizontal 
        contentOffset={{ x: columns * 24 - 300, y: 0 }} // Desplazamiento inicial hacia la derecha
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {Array.from({ length: columns }, (_, colIndex) => {
                const dayIndex = colIndex * rows + rowIndex; // Calcula el índice de día en base a la fila y columna
                if (dayIndex >= totalDays) return null; // Evita celdas extra si excede el total de días
                return (
                  <View
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.day,
                      // Aquí puedes agregar `completedDays` para personalizar los días completados si lo necesitas
                    ]}
                  >
                    <Text style={styles.dayText}>
                      {getDayLabelAndNumber(rowIndex, colIndex)} {/* Muestra la letra y número del día */}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1e1e1e', // Fondo oscuro
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  day: {
    width: 20,
    height: 20,
    margin: 2,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
});