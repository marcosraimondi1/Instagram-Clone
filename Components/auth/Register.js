import React, { Component } from 'react'
import { View, Button, TextInput, Keyboard } from 'react-native'

import firebase from 'firebase';

export class Register extends Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            name: ""
        }
    }

    // anonymous function to avoid explicitly binding [this]
    onSignUp = () => {
        Keyboard.dismiss()
        // alert("PRESSED!")
        const { email, name, password } = this.state
        firebase.auth().createUserWithEmailAndPassword(email, password) //returns a promise, async function
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
                    value={this.state.name}
                    placeholder="name"
                    onChangeText={(name) => this.setState({ name })}
                />
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
                    onPress={this.onSignUp}
                    title="Sign Up"
                />


            </View>
        )
    }
}

export default Register
