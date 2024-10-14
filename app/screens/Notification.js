import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NotificationDisplay = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create a new WebSocket connection
    const ws = new WebSocket('ws://192.168.1.28:8000/ws');

    // Listen for WebSocket messages
    ws.onmessage = (event) => {
      const receivedMessage = event.data;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prevMessages) => [{ text: receivedMessage, time: timestamp }, ...prevMessages]); // Add new message at the top
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.text}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
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
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Space items evenly
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  notificationText: {
    fontSize: 18,
    color: '#007BFF',
  },
  notificationTime: {
    fontSize: 16,
    color: '#888',
  },
  noNotificationText: {
    fontSize: 16,
    color: '#888',
  },
});

export default NotificationDisplay;
