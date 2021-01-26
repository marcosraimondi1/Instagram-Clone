//REACT
import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase'
// REDUX
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing } from '../redux/actions/index.js'
//COMPONENTS
import FeedScreen from './main/feed.js'
import ProfileScreen from './main/profile.js'
import SearchScreen from './main/search.js'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser()
        this.props.fetchUserPosts()
        this.props.fetchUserFollowing()
    }

    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="AddContainer" component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        )
                    }}
                />
                <Tab.Screen name="Feed" component={FeedScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        )
                    }}
                />
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        )
                    }}
                />
                <Tab.Screen name="Profile" component={ProfileScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                        )
                    }}
                />
            </Tab.Navigator>
        )

    }
}

// to get via props, data from the store
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

// to get via props, functions from the store
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)
