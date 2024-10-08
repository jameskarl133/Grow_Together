import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationDisplay = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification</Text>
      <View style={styles.notificationBox}>
        {message ? (
          <Text style={styles.notificationText}>{message}</Text>
        ) : (
          <Text style={styles.noNotificationText}>No notifications yet.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  notificationBox: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
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
  noNotificationText: {
    fontSize: 16,
    color: '#888',
  },
});

export default NotificationDisplay;
