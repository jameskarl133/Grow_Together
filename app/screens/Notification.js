import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NotificationDisplay = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch saved messages from the backend when the component mounts
    fetchSavedMessages();

    // Create a new WebSocket connection
    const ws = new WebSocket('ws://192.168.1.7:8000/ws');

    // Listen for WebSocket messages
    ws.onmessage = (event) => {
      const receivedMessage = event.data;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Use a callback function to ensure the latest state is used
      setMessages((prevMessages) => [{ text: receivedMessage, time: timestamp }, ...prevMessages]);

      // Fetch new messages immediately after receiving a new WebSocket message
      fetchSavedMessages(); 
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  // Function to fetch saved messages from the backend
  const fetchSavedMessages = async () => {
    try {
      const response = await fetch('http://192.168.1.7:8000/notification');
      const data = await response.json();
  
      // Ensure data is an array before reversing
      if (Array.isArray(data)) {
        setMessages(data.reverse());  // Reverse to show the latest messages first
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching saved messages:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationText}>{item.message || item.text}</Text>
        <Text style={styles.notificationTime}>{item.timestamp || item.time}</Text>
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
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Space items evenly
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e0f7fa', // Change background color (example: light cyan)
    marginBottom: 10,
    // Removed shadow properties
  },
  notificationTextContainer: {
    flex: 1, // Take remaining space
    marginRight: 10, // Add some spacing between text and time
  },
  notificationText: {
    fontSize: 18,
    color: '#000', // Change font color to black
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
