import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';

import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

const firebase = require('firebase');
require('firebase/firestore');

export default class App extends Component {
  constructor() {
    super()
    firebase.initializeApp({
      apiKey: "AIzaSyBd49Bp2BjbqPq_IpyvtUUBsrfa8LqRB5w",
      authDomain: "test-ea056.firebaseapp.com",
      databaseURL: "https://test-ea056.firebaseio.com",
      projectId: "test-ea056",
      storageBucket: "test-ea056.appspot.com",
      messagingSenderId: "16100889352",
      appId: "1:16100889352:web:bd1080f58b28541cff92bd",
      measurementId: "G-D9XW571ZD4"
    });

    this.referenceShoppingLists = firebase.firestore().collection('shoppinglists');

    this.state = {
      lists: [],
    }
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });
      this.referenceShoppingListUser = firebase.firestore().collection('shoppinglists').where("uid", "==", this.state.uid);
    });
    this.unsubscribeListUser = this.referenceShoppingListUser.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  };

  addList() {
    this.referenceShoppingLists.add({
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
      uid: this.state.uid,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.loggedInText}</Text>
        <Text style={styles.text}>All Shopping Lists</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) => 
          <Text style={styles.item}>{item.name}: {item.items}</Text>}
        />
        <Button title="Add the list" onPress={() => {this.addList();}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  },
});
