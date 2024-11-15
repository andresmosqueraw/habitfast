import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Configuración inicial
const startDate = new Date(2024, 3, 1); // 1 de abril de 2024
const today = new Date();
const rows = 7;
const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

// Función para obtener la etiqueta y la fecha de cada día en la cuadrícula
function getDayLabelAndNumber(rowIndex: number, colIndex: number) {
  const currentDate = new Date(startDate);
  const dayIndex = colIndex * rows + rowIndex;
  currentDate.setDate(startDate.getDate() + dayIndex);

  const dayLabel = daysOfWeek[currentDate.getDay()];
  const dayNumber = currentDate.getDate();
  
  return { label: `${dayLabel}${dayNumber}`, date: currentDate };
}

interface HabitTrackerProps {
  title: string;
  description: string;
  color: string;
  onEdit: () => void;
}

export default function HabitTracker({ title, description, color, onEdit }: HabitTrackerProps) {
  const [markedDays, setMarkedDays] = useState<string[]>([]);
  const [isIconPressed, setIsIconPressed] = useState(false);

  const markToday = () => {
    const todayLabel = `${daysOfWeek[today.getDay()]}${today.getDate()}`;
    setMarkedDays((prev) =>
      prev.includes(todayLabel) ? prev.filter((day) => day !== todayLabel) : [...prev, todayLabel]
    );
    setIsIconPressed(!isIconPressed);
  };

  const columns = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24) / rows);

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title || 'Título del Hábito'}</Text>
          <Text style={styles.subtitle}>{description || 'Descripción del Hábito'}</Text>
        </View>
        <TouchableOpacity style={[styles.editIcon, { backgroundColor: color }]} onPress={onEdit}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { backgroundColor: isIconPressed ? color : `${color}99` }, // Botón más oscuro cuando no está presionado
          ]}
          onPress={markToday}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        contentOffset={{ x: columns * 24 - 300, y: 0 }}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {Array.from({ length: columns }, (_, colIndex) => {
                const { label, date } = getDayLabelAndNumber(rowIndex, colIndex);
                const isMarked = markedDays.includes(label);
                const isFuture = date > today;

                return (
                  <View
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.day,
                      isMarked
                        ? { backgroundColor: color }
                        : isFuture
                        ? { backgroundColor: `${color}15` }
                        : { backgroundColor: `${color}35` }, // Fondo más oscuro para días no seleccionados
                    ]}
                  >
                    <Text style={styles.dayText}>{label}</Text>
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
    padding: 8,
    backgroundColor: '#181818',
    borderRadius: 10,
    borderWidth: 0,
    marginVertical: 10,
    alignSelf: 'center',
    width: '95%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  editIcon: {
    marginRight: 10,
    padding: 6,
    borderRadius: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  day: {
    width: 16,
    height: 16,
    margin: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#fff',
    fontSize: 5,
    fontWeight: 'bold',
  },
});