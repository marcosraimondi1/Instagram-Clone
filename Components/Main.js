import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser } from '../redux/actions/index.js'

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser()
    }

    render() {
        const { currentUser } = this.props
        // console.log('currentUser: ', currentUser)
        if (currentUser != undefined) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text>{currentUser.name} is logged in</Text>
                </View>
            )
        } else { return (<View />) }
    }
}

// to get via props, data from the store
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

// to get via props, functions from the store
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)
