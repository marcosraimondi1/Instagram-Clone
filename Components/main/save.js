import React, { useState } from 'react'
import { View, TextInput, Image, Button, SnapshotViewIOS } from 'react-native'

import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function save(props) {
    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        // upload image to firebase storage
        const uri = props.route.params.image
        // using random number represented as a string in a 36 base to identiy image
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        console.log('childPath ', childPath)

        const response = await fetch(uri)
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}   `)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                // console.log(snapshot)
                savePostData(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log('Error: ', snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }

    const savePostData = (downloadURL) => {
        // Post image to firestore db
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                // navigate back to main components
                props.navigation.popToTop()
            }))
    }


    // console.log(props.route.params.image)
    return (
        <View style={{ flex: 1, margin: 15 }}>
            <Image source={{ uri: props.route.params.image }} />
            <TextInput
                placeholder="Write a Caption . . ."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    )
}
