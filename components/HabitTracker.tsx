import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Configuración inicial
const startDate = new Date(2024, 6, 1); // 1 de julio de 2024
const today = new Date();
const rows = 7; // Número de filas (alto)
const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // Letras de los días de la semana, correcta posición

// Función para obtener la etiqueta y la fecha de cada día en la cuadrícula
function getDayLabelAndNumber(rowIndex: number, colIndex: number) {
  const currentDate = new Date(startDate);
  const dayIndex = colIndex * rows + rowIndex; // Índice del día en la cuadrícula
  currentDate.setDate(startDate.getDate() + dayIndex); // Avanza 'dayIndex' días desde la fecha inicial

  const dayLabel = daysOfWeek[currentDate.getDay()]; // Obtiene el día de la semana real
  const dayNumber = currentDate.getDate(); // Obtiene el número de día del mes
  
  return { label: `${dayLabel}${dayNumber}`, date: currentDate };
}

export default function HabitTracker() {
  const [markedDays, setMarkedDays] = useState<string[]>([]);
  const [isIconPressed, setIsIconPressed] = useState(false);

  // Función para marcar el día actual
  const markToday = () => {
    const todayLabel = `${daysOfWeek[today.getDay()]}${today.getDate()}`;
    console.log("Día actual:", todayLabel);

    setMarkedDays((prev) => {
      if (prev.includes(todayLabel)) {
        console.log(`Desmarcando el día actual: ${todayLabel}`);
        return prev.filter((day) => day !== todayLabel);
      } else {
        console.log(`Marcando el día actual: ${todayLabel}`);
        return [...prev, todayLabel];
      }
    });

    setIsIconPressed((prev) => !prev);
  };

  // Calcula el número de columnas necesarias
  const columns = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24) / rows);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ir al gym</Text>
          <Text style={styles.subtitle}>Ir al gym</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.iconContainer,
            isIconPressed ? styles.iconPressed : styles.iconUnpressed,
          ]}
          onPress={markToday}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
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
                const { label } = getDayLabelAndNumber(rowIndex, colIndex);
                const isMarked = markedDays.includes(label);

                console.log(`Día ${label}: ${isMarked ? 'Marcado' : 'No marcado'}`);

                return (
                  <View
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.day,
                      isMarked && styles.markedDay,
                    ]}
                  >
                    <Text style={styles.dayText}>
                      {label} {/* Muestra la letra y número del día */}
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
    borderWidth: 1, // Agrega borde
    borderColor: '#555', // Color del borde
    marginVertical: 10, // Espaciado entre cada habit tracker
    alignSelf: 'center', // Centra horizontalmente
    width: '90%', // Ajusta el ancho para que no llegue a los bordes de la pantalla
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Alinea el título y el ícono de extremo a extremo
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8, // Bordes redondeados
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconUnpressed: {
    backgroundColor: '#b34771', // Color rosado oscuro cuando no está presionado
  },
  iconPressed: {
    backgroundColor: '#ff69b4', // Color rosado claro cuando se presiona
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
  markedDay: {
    backgroundColor: '#ff69b4', // Fondo rosado para los días marcados
  },
  dayText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
});