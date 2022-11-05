import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, Alert, TextInput, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const heightKey = '@MyApp:hKey';
const weightKey = '@MyApp:wKey';

export default class App extends Component {
  state = {
    weight: '',
    height: '',
    BMI: '',
  };

 //componentWillMount() {
  constructor(props) {
    super(props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const height = await AsyncStorage.getItem(heightKey);
      const weight = await AsyncStorage.getItem(weightKey);
      this.setState({ height, weight });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {
    const { height, weight} = this.state;

    try {
      await AsyncStorage.setItem(heightKey, height);
      await AsyncStorage.setItem(weightKey, weight);
      Alert.alert('Saved', 'Successfully saved on device');
    } catch (error) {
      Alert.alert('Error', 'There was an error while saving the data');
    }
  }

  onHChange = (height) => {
    this.setState({ height });
  }
  onWChange = (weight) => {
    this.setState({ weight });
  }

  onCal = () =>{
    const {weight, height} = this.state;
    if(isNaN(height)){
      Alert.alert('Error', 'Height must be a valid number');
    }else if(isNaN(weight) ){
      Alert.alert('Error', 'Weight must be a valid number');
    }else{
      const BMI = ((weight / (height * height)) * 703).toFixed(1);
      this.setState({height, BMI});
      this.onSave(BMI); 
    }
  }

  render() {
    const { height, weight, BMI } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.tbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
          <TextInput
            style={styles.input}
            onChangeText={this.onWChange}
            value={weight}
            placeholder="Weight in Pounds"
          />
          <TextInput
            style={styles.input}
            onChangeText={this.onHChange}
            value={height}
            placeholder="Height in Inches"
          />
          <TouchableOpacity onPress={this.onCal} style={styles.button}>
            <Text style={styles.btntext}>Compute BMI</Text>
          </TouchableOpacity>

          <Text style={styles.result}>Body Mass Index is {BMI}</Text>
          <Text style={styles.preview}>Assessing Your BMI</Text>
          <Text style={styles.preview1}>
            Underweight:  less than 18.5{"\n"}
            Healthy:  18.5 to 24.9{"\n"}
            Overweight:  25.0 to 29.9{"\n"}
            Obese:  30.0 or higher
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  tbar:  {
    backgroundColor:  '#f4511e',
    color:  '#fff',
    textAlign:  'center',
    padding:  25,
    fontSize:  28,
    fontWeight:  'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    fontSize: 24,
    height: 40,
    margin: 10,
  },
  button:{
    height: 40,
    alignItems: "center",
    backgroundColor:'#34495e',
    fontSize: 24,
    borderRadius: 3,
    margin: 10,
    padding: 3,
  },
  btntext: {
    color: '#fff',
    fontSize: 24,
  },
  result: {
    color: '#000',
    flex: 1,
    height: 80,
    fontSize: 28,
    marginTop: 60,
    marginBottom:30,
    textAlign: 'center'
  },
  preview: {
    backgroundColor: '#fff',
    fontSize: 20,
  },
  preview1: {
    backgroundColor: '#fff',
    fontSize: 20,
    marginBottom: 50,
    paddingLeft:  25,
  },
});