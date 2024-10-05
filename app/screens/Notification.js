import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const Notification = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Watering Reminder', message: 'Your crop needs watering today.', isRead: false },
    { id: '2', title: 'New Crop Added', message: 'You have successfully added a new crop.', isRead: true },
    { id: '3', title: 'Schedule Set', message: 'Watering schedule has been set for tomorrow.', isRead: false },
  ]);

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={[styles.notificationItem, item.isRead && styles.read]}>
      <View style={styles.notificationText}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      {!item.isRead && <Ionicons name="ellipse" size={14} color="blue" />} {/* Unread indicator */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  read: {
    opacity: 0.5, // Make read notifications appear faded
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  notificationMessage: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
});

export default Notification;
