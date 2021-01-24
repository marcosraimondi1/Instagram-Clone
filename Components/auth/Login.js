import React, { Component } from 'react'
import { View, Button, TextInput, Keyboard } from 'react-native'

import firebase from 'firebase';

export class Login extends Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        }
    }

    // anonymous function to avoid explicitly binding [this]
    onSignIn = () => {
        Keyboard.dismiss()
        const { email, password } = this.state
        firebase.auth().signInWithEmailAndPassword(email, password) //returns a promise, async function
            // handle promis with .then .catch
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log('error: ', error)
            })
    }


    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', margin: 10 }}>
                <TextInput
                    value={this.state.email}
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    value={this.state.password}
                    placeholder="password"
                    onChangeText={(password) => this.setState({ password })}
                    secureTextEntry={true}
                />
                <Button
                    onPress={this.onSignIn}
                    title="Sign In"
                />
            </View>
        )
    }
}

export default Login
