import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Modal, TextInput, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import HabitTracker from '@/components/HabitTracker';

export default function Index() {
  const [habits, setHabits] = useState<React.ReactElement[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  const openModal = () => {
    setNewHabitTitle('');
    setNewHabitDescription('');
    setModalVisible(true);
  };

  const addHabit = () => {
    setHabits([
      ...habits,
      <HabitTracker key={habits.length} title={newHabitTitle} description={newHabitDescription} />,
    ]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mis Hábitos</Text>
        <TouchableOpacity onPress={openModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
        {habits}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Hábito</Text>
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
            <View style={styles.modalButtons}>
              <Button title="Cancelar" color="#999" onPress={() => setModalVisible(false)} />
              <Button title="Guardar" color="#ff69b4" onPress={addHabit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 60,
    backgroundColor: '#2a2a2a',
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ff69b4',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro transparente
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#444',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});