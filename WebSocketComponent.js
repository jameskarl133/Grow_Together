import React, { useEffect, useContext, useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { ApiContext } from '../../Provider';
import NotificationDisplay from './Notification';
import PushNotification from 'react-native-push-notification';

const WebSocketComponent = () => {
  const { sendMessage, messages, handleSelectCrop } = useContext(ApiContext);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Initialize Push Notification Configuration
  useEffect(() => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });
  }, []);

  // Listen for WebSocket messages and trigger notification
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      setNotificationMessage(latestMessage);
      triggerPushNotification(latestMessage);
    }
  }, [messages]);

  // Function to trigger push notification
  const triggerPushNotification = (message) => {
    PushNotification.localNotification({
      title: "Notification",
      message: message,
    });
  };

  // Handler when user selects a crop
  const onSelectCrop = (cropName) => {
    handleSelectCrop(cropName);
    sendMessage(cropName);  // Send crop selection via WebSocket
  };

  return (
    <View>
      <Button title="Select Crop to Monitor" onPress={() => onSelectCrop('Wheat')} />
      <NotificationDisplay message={notificationMessage} />
    </View>
  );
};

export default WebSocketComponent;
