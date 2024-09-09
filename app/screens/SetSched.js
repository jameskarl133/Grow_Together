import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';

export default function SetSched() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [alarmType, setAlarmType] = useState('once');
  const [schedules, setSchedules] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleConfirm = (selectedDate) => {
    setShowPicker(false);
    setDate(selectedDate);
  };

  const handleSetAlarm = () => {
    const selectedHours = date.getHours();
    const selectedMinutes = date.getMinutes();

    if (selectedHours >= 10 && selectedHours <= 15) {
      alert('Invalid Time: Please choose a time outside of 10 AM to 4 PM.');
    } else {
      const formattedTime = formatAMPM(date);
      const alarmFrequency = alarmType === 'everyday' ? 'Daily' : 'Once';

      if (editingIndex !== null) {
        const updatedSchedules = [...schedules];
        updatedSchedules[editingIndex] = { time: formattedTime, frequency: alarmFrequency, enabled: true };
        setSchedules(updatedSchedules);
        setEditingIndex(null);
      } else {
        setSchedules([...schedules, { time: formattedTime, frequency: alarmFrequency, enabled: true }]);
      }
    }
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
  };

  const toggleSwitch = (index) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index].enabled = !updatedSchedules[index].enabled;
    setSchedules(updatedSchedules);
  };

  const handleEditAlarm = (index) => {
    const schedule = schedules[index];
    const [time, ampm] = schedule.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    const selectedDate = new Date();
    selectedDate.setHours(ampm === 'PM' && hours !== 12 ? hours + 12 : hours);
    selectedDate.setMinutes(minutes);

    setDate(selectedDate);
    setAlarmType(schedule.frequency === 'Daily' ? 'everyday' : 'once');
    setEditingIndex(index);
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.textColor}>Set Watering Schedule</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={alarmType}
            style={styles.picker}
            onValueChange={(itemValue) => setAlarmType(itemValue)}
          >
            <Picker.Item label="Once" value="once" />
            <Picker.Item label="Everyday" value="everyday" />
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Select Time" onPress={() => setShowPicker(true)} color="green" />
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={handleSetAlarm} title={editingIndex !== null ? "Update Alarm" : "Set Alarm"} color="green" />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={showPicker}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
        date={date}
      />

      <ScrollView style={styles.bottomContainer}>
        <Text style={styles.scheduleTitle}>Scheduled Alarms:</Text>
        {schedules.length > 0 ? (
          schedules.map((schedule, index) => (
            <TouchableOpacity key={index} onPress={() => handleEditAlarm(index)} style={styles.scheduleItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{schedule.time}</Text>
                <Text style={styles.frequencyText}>{schedule.frequency}</Text>
              </View>
              <Switch
                value={schedule.enabled}
                onValueChange={() => toggleSwitch(index)}
                thumbColor={schedule.enabled ? "#81b0ff" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noAlarmText}>No alarms set yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7e9',
    padding: 20,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textColor: {
    color: '#2c3e50',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '50%',
    borderRadius: 5,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 20,
    width: '50%',
  },
  bottomContainer: {
    flex: 1,
    marginTop: 20,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#d1f7dc',
    borderRadius: 5,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'column',
  },
  timeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  frequencyText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  noAlarmText: {
    fontSize: 16,
    color: '#2c3e50',
  },
});