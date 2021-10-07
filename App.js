import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [content, setContent] = useState({})
  const [success, setSuccess] = useState(false)
  const [text, onChanteText] = useState('https://')
  const [urlList, setList] = useState([])

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('urlList')
      if(value !== null) {
        const listArr = JSON.parse(value)
        if(urlList.length === 0) {
          setList(listArr)
        }
        console.log(listArr)
      }
      console.log('async success')
    } catch(e) {
      console.log(e)
    }
  }
  getData()

  const storeData = async (value) => {
    try {

      if(!urlList.includes(value)) {
        let list = [value].concat(urlList)
        setList(list)
        const jsonValue = JSON.stringify(list)
        await AsyncStorage.setItem('urlList', jsonValue)
      }
    } catch (e) {
      // saving error
    }
  }

  function getAPI() {
    console.log('start')
    Axios.get(text)
        .then((response) => {
        setContent(response.data)
        storeData(text)
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

  const urls = () => {
    return urlList.map((url, index) => (<View key={index} style={styles.listItem}><Text
      selectable={true}
    >{url}</Text></View>))
  }

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
          <View style={styles.list}>
            {urls()}
          </View>
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

  list: {
    display: 'flex',
    marginTop: 10,
  },

  listItem: {
    backgroundColor: 'lightsalmon',
    margin: 3,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 5,
    padding: 4
  }
});
