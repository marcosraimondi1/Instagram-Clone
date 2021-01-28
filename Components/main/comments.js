import React, { useState, useEffect } from 'react'
import { View, TextInput, Text, FlatList, Button, Keyboard } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index.js'


function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {
        function matchUserToComments(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator)
                if (user == undefined) {
                    fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }
        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return { id, ...data }
                    })
                    matchUserToComments(comments)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComments(comments)
        }

    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
        Keyboard.dismiss()
    }

    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        {item.user !== undefined ? (
                            <Text>
                                {item.user.name}
                            </Text>
                        ) : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View>
                <TextInput
                    placeholder='comment...'
                    onChangeText={(text) => setText(text)}
                />
                <Button
                    onPress={() => onCommentSend()}
                    title="Send"
                />
            </View>
        </View>
    )
}

// to get via props, data from the store
const mapStateToProps = (store) => ({
    users: store.usersState.users
})

// to get via props, functions from the store
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Comment)
