import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, LayoutChangeEvent, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

const startDate = new Date(2024, 3, 1); // 1 de abril de 2024
const today = new Date();
const rows = 7;
const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const months = ['EN', 'FB', 'MR', 'AB', 'MY', 'JN', 'JL', 'AG', 'SP', 'OC', 'NV', 'DC'];

function getDayLabelAndNumber(date: Date) {
  const dayLabel = daysOfWeek[date.getDay()];
  const monthLabel = months[date.getMonth()];
  const yearLabel = date.getFullYear().toString().slice(-2);
  const dayNumber = date.getDate();

  const label = `${monthLabel}${dayLabel}${dayNumber}-${yearLabel}`;
  return { label, date };
}

function getTodayLabel() {
  return getDayLabelAndNumber(today).label;
}

interface HabitTrackerProps {
  title: string;
  description: string;
  color: string;
  onEdit: () => void;
}

export default function HabitTracker({ title, description, color, onEdit }: HabitTrackerProps) {
  const [markedDays, setMarkedDays] = useState<string[]>([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [isIconPressed, setIsIconPressed] = useState(false);
  const confettiRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });
  const soundRef = useRef<Audio.Sound | null>(null);

  const storageKey = `markedDays_${title}`;

  useEffect(() => {
    const loadMarkedDays = async () => {
      try {
        const savedDays = await AsyncStorage.getItem(storageKey);
        if (savedDays) {
          setMarkedDays(JSON.parse(savedDays));
        }
      } catch (error) {
        console.error('Error loading marked days:', error);
      }
    };

    loadMarkedDays();
  }, [storageKey]);

  useEffect(() => {
    const saveMarkedDays = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(markedDays));
      } catch (error) {
        console.error('Error saving marked days:', error);
      }
    };

    saveMarkedDays();
  }, [markedDays, storageKey]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [markedDays]);

  const playCelebrationSound = async () => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/cheer.mp3')
      );
      soundRef.current = sound;
    }
    await soundRef.current?.replayAsync();
  };

  const markToday = async () => {
    const todayLabel = getTodayLabel();
    const isMarking = !markedDays.includes(todayLabel);

    if (isMarking) {
      setConfettiVisible(true);
      playCelebrationSound();
      setTimeout(() => {
        if (confettiRef.current) confettiRef.current.start();
        setTimeout(() => setConfettiVisible(false), 500);
      }, 0);
    }

    setMarkedDays((prev) =>
      isMarking ? [...prev, todayLabel] : prev.filter((day) => day !== todayLabel)
    );
    setIsIconPressed(isMarking);
  };

  const handleIconLayout = (event: LayoutChangeEvent) => {
    const { x, y } = event.nativeEvent.layout;
    setConfettiPosition({ x: x + 24, y: y + 24 });
  };

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleDayPress = (day: { dateString: string }) => {
    const date = new Date(`${day.dateString}T00:00:00`);
    const { label } = getDayLabelAndNumber(date);

    setMarkedDays((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label]
    );
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: { marked: boolean; dotColor: string } } = {};
    markedDays.forEach((day) => {
      const dateParts = day.match(/([A-Z]{2})([A-Z]{1})(\d+)-(\d+)/);
      if (dateParts) {
        const [_, month, dayLabel, dayNumber, year] = dateParts;
        const dateString = new Date(
          `20${year}-${months.indexOf(month) + 1}-${dayNumber}`
        )
          .toISOString()
          .split("T")[0];
        marked[dateString] = { marked: true, dotColor: color };
      }
    });
    return marked;
  };

  const columns = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24) / rows);

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title || 'Título del Hábito'}</Text>
          <Text style={styles.subtitle}>{description || 'Descripción del Hábito'}</Text>
        </View>
        <TouchableOpacity style={[styles.calendarIcon, { backgroundColor: color }]} onPress={toggleCalendar}>
          <Ionicons name="calendar" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.editIcon, { backgroundColor: color }]} onPress={onEdit}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { backgroundColor: isIconPressed ? color : `${color}99` },
          ]}
          onPress={markToday}
          onLayout={handleIconLayout}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerStyle={{ flexGrow: 1 }}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
          }
        }}
      >
        <View style={styles.gridContainer}>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {Array.from({ length: columns }, (_, colIndex) => {
                const { label, date } = getDayLabelAndNumber(new Date(startDate.getTime() + ((colIndex * rows + rowIndex) * 24 * 60 * 60 * 1000)));
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
                        : { backgroundColor: `${color}35` },
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
      {confettiVisible && (
        <ConfettiCannon
          count={100}
          origin={confettiPosition}
          autoStart={false}
          fadeOut
          fallSpeed={3000}
          explosionSpeed={3000}
          ref={confettiRef}
        />
      )}
      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()} // Aplica dots a los días marcados
              maxDate={today.toISOString().split('T')[0]} // Restringe fechas futuras
              theme={{
                backgroundColor: '#181818',
                calendarBackground: '#181818',
                textSectionTitleColor: '#fff',
                dayTextColor: '#fff',
                selectedDayBackgroundColor: color,
                selectedDayTextColor: '#fff',
                todayTextColor: color,
                arrowColor: '#fff',
                monthTextColor: '#fff',
                textDisabledColor: '#555',
              }}
            />
            <TouchableOpacity onPress={toggleCalendar} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  calendarIcon: {
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
    width: 32,
    height: 32,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: '#181818',
    borderRadius: 10,
    padding: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
  },
});