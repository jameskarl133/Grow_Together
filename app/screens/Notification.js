import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

LogBox.ignoreLogs(['Setting a timer']); // Suppress WebSocket warnings

const NotificationDisplay = () => {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    // Fetch saved messages from the backend when the component mounts
    fetchSavedMessages();

    // Create a new WebSocket connection
    // ws.current = new WebSocket('ws://192.168.137.141:8000/ws');

    // // Handle WebSocket message reception
    // ws.current.onmessage = () => {
    //   console.log('WebSocket message received');
    //   fetchLatestMessageFromDatabase();
    // };

    // ws.current.onerror = (e) => console.error("WebSocket error: ", e);
    
    // // Clean up WebSocket connection on component unmount
    // return () => {
    //   ws.current.close();
    // };
  }, []);

  // Function to fetch saved messages from the backend
  const fetchSavedMessages = async () => {
    try {
      const response = await fetch('http://192.168.137.141:8000/notification');
      const data = await response.json();
      console.log('Fetched messages:', data);

      if (Array.isArray(data)) {
        setMessages(data.reverse()); // Show the latest messages first
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching saved messages:', error);
    }
  };

  // // Function to fetch the latest message from the database and trigger a notification
  // const fetchLatestMessageFromDatabase = async () => {
  //   try {
  //     const response = await fetch('http://192.168.137.141:8000/notification');
  //     const data = await response.json();
  //     console.log('Latest message:', data[0]);

  //     if (Array.isArray(data) && data.length > 0) {
  //       const latestMessage = data[0]; // Get the latest message
  //       const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  //       // Update the messages list with the latest message from the database
  //       const newMessage = { message: latestMessage.message, timestamp };
  //       setMessages((prevMessages) => [newMessage, ...prevMessages]);

  //       // Trigger a local notification with the latest message from the database
  //       scheduleNotification(newMessage.message);
  //     } else {
  //       console.error('No messages found in the database.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching the latest message:', error);
  //   }
  // };

  // Function to delete all notifications
  const deletenotifs = async () => {
    try {
      const response = await fetch('http://192.168.137.141:8000/notifications/delete_all', {
        method: 'DELETE',
      });
      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Error deleting notifications');
    }
  };

  // Handle deleting notifications and showing alert
  const handleDeletenotifs = async () => {
    try {
      const response = await deletenotifs();
      Alert.alert('Success', response.message);
      // Reload messages after deletion
      await fetchSavedMessages();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Schedule a local push notification
  // const scheduleNotification = async (message) => {
  //   try {
  //     console.log('notifying:', message);
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: 'New Message',
  //         body: message, // Display the fetched message from the database
  //       },
  //       trigger: null, // Display immediately
  //     });
  //   } catch (error) {
  //     console.error('Error scheduling notification:', error);
  //   }
  // };

  // Render each notification item
  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationText}>{item.message || 'No message'}</Text>
        <Text style={styles.notificationTime}>{item.timestamp || 'Unknown time'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      
      {messages.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.notificationList}
        />
      ) : (
        <View style={styles.notificationBox}>
          <Text style={styles.noNotificationText}>No notifications yet.</Text>
        </View>
      )}

      {/* Delete All Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeletenotifs}>
        <Text style={styles.deleteButtonText}>Delete All</Text>
      </TouchableOpacity>

      {/* Reload Button */}
      <TouchableOpacity style={styles.reloadButton} onPress={fetchSavedMessages}>
        <Ionicons name="reload" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  notificationList: {
    width: '100%',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e0f7fa',
    marginBottom: 10,
  },
  notificationTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  notificationText: {
    fontSize: 18,
    color: '#000',
  },
  notificationTime: {
    fontSize: 16,
    color: '#888',
  },
  noNotificationText: {
    fontSize: 16,
    color: '#888',
  },
  reloadButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: '#ff0000',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NotificationDisplay;