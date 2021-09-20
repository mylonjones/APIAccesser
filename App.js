import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import Axios from 'axios'


export default function App() {
  const [content, setContent] = useState({})
  const [success, setSuccess] = useState(false)
  const [text, onChanteText] = useState('https://')

  function getAPI() {
    console.log('start')
    Axios.get(text)
        .then((response) => {
        setContent(response.data)
        console.log('sent')
      })
        .catch((error) => {
          console.log(error)
        })
  }

  function findImage(data) {
    let images = []
    if(typeof data === 'object') {
      for(let key in data) {
        let val = data[key]
        if(typeof val === 'string' && val.includes('https://')) {
          images.push(val)
        }
        images = images.concat(findImage(val))
      }
    }
    return images
  }

  // useEffect(() => {
  //   if(!success) {
  //     Axios.get('https://botw-compendium.herokuapp.com/api/v2/entry/123')
  //       .then((response) => {
  //       setContent(response.data.data)
  //       setSuccess(true)
  //     })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //   }
  // })

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View><Text
            selectable={true}
          >http://api.weatherstack.com/current?access_key=87d14c22ddb04612578f5425b6bdd988&query=Lancaster California</Text></View>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={onChanteText}
          ></TextInput>
          <Button
            title="GO"
            color="#841584"
            onPress={getAPI}
          />
          <View><Text>{JSON.stringify(content, undefined, 4)}</Text></View><Image style={styles.image} source={{uri: findImage(content)[0]}}></Image>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 300,
    height: 300
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
});
