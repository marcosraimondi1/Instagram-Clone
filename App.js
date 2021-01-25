// REACT
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//REDUX
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))


// FIREBASE
import * as firebase from 'firebase';
// initialize firebase
// in prodcution, use environment variables to hide keys
const firebaseConfig = {
  apiKey: "AIzaSyCDipAkUpoATc2bH8fKijQvzcEVpuzLqLI",
  authDomain: "instagram-clone-29e9b.firebaseapp.com",
  projectId: "instagram-clone-29e9b",
  storageBucket: "instagram-clone-29e9b.appspot.com",
  messagingSenderId: "1067208499101",
  appId: "1:1067208499101:web:3200bd398d6c2dd7afd974",
  measurementId: "G-KW2PHVDY0T"
};

// check no app is already running
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

// COMPONENTS
import LandingScreen from './Components/auth/Landing.js';
import RegisterScreen from "./Components/auth/Register.js";
import LoginScreen from './Components/auth/Login.js'
import MainScreen from './Components/Main.js'
import AddScreen from './Components/main/add.js'

const Stack = createStackNavigator();


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false
    }
  }

  componentDidMount() {
    // authentication listener, listens for changes
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        // user hasn't logged in, but loaded because we know the state of the user
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      // if not sure about user state, show loading page
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }
    if (!loggedIn) {
      // if not logged in show landing navigator
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Add" component={AddScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}
