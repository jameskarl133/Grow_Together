import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.textColor}>We Are The Grow Together Team!</Text>
      <StatusBar style="auto" />
      <View style={{width:100, height:40}}>
        <Button
        title='Yes'
        color={'red'}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColor: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold'
  }
});
