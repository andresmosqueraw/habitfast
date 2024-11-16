import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const startDate = new Date(2024, 6, 1);
const today = new Date();
const rows = 7;
const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

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
  onEdit: () => void;
}

export default function HabitTracker({ title, description, onEdit }: HabitTrackerProps) {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title || 'Título del Hábito'}</Text>
          <Text style={styles.subtitle}>{description || 'Descripción del Hábito'}</Text>
        </View>
        <TouchableOpacity style={styles.editIcon} onPress={onEdit}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
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
                      isMarked ? styles.markedDay : isFuture ? styles.futureDay : styles.unmarkedDay,
                    ]}
                  >
                    <Text style={styles.dayText}>
                      {label}
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
    padding: 8,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
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
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  editIcon: {
    marginRight: 10,
    backgroundColor: '#ff69b4',
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
  iconUnpressed: {
    backgroundColor: '#b34771',
  },
  iconPressed: {
    backgroundColor: '#ff69b4',
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
    margin: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markedDay: {
    backgroundColor: '#ff69b4', // Fondo rosado claro para los días marcados
  },
  unmarkedDay: {
    backgroundColor: '#663344', // Fondo rosado muy oscuro para los días no marcados
  },
  futureDay: {
    backgroundColor: '#3a1e2a', // Fondo casi negro para los días futuros
  },
  dayText: {
    color: '#fff',
    fontSize: 5,
    fontWeight: 'bold',
  },
});