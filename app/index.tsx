import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Modal, TextInput, Button, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import HabitTracker from '@/components/HabitTracker';

const colors = [
  '#ff69b4', '#b34771', '#ff4500', '#4682b4', '#32cd32', '#9370db',
  '#ffd700', '#708090', '#8b4513', '#00ced1',
];

interface Habit {
  title: string;
  description: string;
  color: string;
}

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openModal = (index: number | null = null) => {
    if (index !== null) {
      const habit = habits[index];
      setNewHabitTitle(habit.title);
      setNewHabitDescription(habit.description);
      setSelectedColor(habit.color);
      setEditIndex(index);
    } else {
      setNewHabitTitle('');
      setNewHabitDescription('');
      setSelectedColor(colors[0]);
      setEditIndex(null);
    }
    setModalVisible(true);
  };

  const addOrEditHabit = () => {
    if (editIndex !== null) {
      const updatedHabits = [...habits];
      updatedHabits[editIndex] = {
        title: newHabitTitle,
        description: newHabitDescription,
        color: selectedColor,
      };
      setHabits(updatedHabits);
    } else {
      setHabits([
        ...habits,
        { title: newHabitTitle, description: newHabitDescription, color: selectedColor },
      ]);
    }
    setModalVisible(false);
  };

  const deleteHabit = () => {
    if (editIndex !== null) {
      Alert.alert(
        "Eliminar Hábito",
        "¿Estás seguro de que deseas eliminar este hábito?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => {
              setHabits(habits.filter((_, index) => index !== editIndex));
              setModalVisible(false);
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>HabitFast</Text>
        <TouchableOpacity onPress={() => openModal()} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.motivationalText}>¡Comienza a construir tus hábitos hoy!</Text>
          <TouchableOpacity onPress={() => openModal()} style={styles.addButtonLarge}>
            <Text style={styles.addButtonText}>Agregar Hábito</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
          {habits.map((habit, index) => (
            <HabitTracker 
              key={index} 
              title={habit.title} 
              description={habit.description} 
              color={habit.color} 
              onEdit={() => openModal(index)}
            />
          ))}
        </ScrollView>
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editIndex !== null ? 'Editar Hábito' : 'Nuevo Hábito'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Título del Hábito"
              placeholderTextColor="#aaa"
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              placeholderTextColor="#aaa"
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
            />
            <Text style={styles.colorPickerLabel}>Selecciona un color:</Text>
            <View style={styles.colorPicker}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0 },
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" color="#999" onPress={() => setModalVisible(false)} />
              {editIndex !== null && (
                <Button title="Eliminar" color="#d9534f" onPress={deleteHabit} />
              )}
              <Button title="Guardar" color="#ff69b4" onPress={addOrEditHabit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 5, paddingTop: 60, backgroundColor: '#000' },
  headerText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  addButton: { backgroundColor: '#fff', padding: 12, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  motivationalText: { color: '#aaa', fontSize: 18, marginBottom: 20, textAlign: 'center' },
  addButtonLarge: { backgroundColor: '#fff', padding: 15, borderRadius: 8 },
  addButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: '#2a2a2a', borderRadius: 10 },
  modalTitle: { fontSize: 20, color: '#fff', marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { backgroundColor: '#444', color: '#fff', padding: 10, borderRadius: 5, marginBottom: 15 },
  colorPickerLabel: { color: '#fff', marginBottom: 10 },
  colorPicker: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  colorOption: { width: 30, height: 30, borderRadius: 15, margin: 5 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});