import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default function ImagePickerExample(props) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        console.log("the status", status)
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
        const image = props.profilePic ? props.profilePic : "https://res.cloudinary.com/developer-inn/image/upload/v1607354990/Account-512_rmc3wq.png"  
        setImage(image)
      }
    })();
  }, []);

  const cloudinaryUpload = (base64) => {
    let base64Img = `data:image/jpg;base64,${base64}`
    console.log("the base", base64);
    //Add your cloud name
    let apiUrl = 'https://api.cloudinary.com/v1_1/developer-inn/image/upload';

    let data = {
      "file": base64Img,
      "upload_preset": "obid55oq",
    }

    fetch(apiUrl, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async r => {
        let data = await r.json()
        props.onUpload(data.secure_url);
        return data.secure_url
    }).catch(err=>console.log( "the error", err))
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
    
    cloudinaryUpload(result.base64)

  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button style = {{ position: "absolute" }} title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} resizeMode = "cover" style={{ width: 200,borderWidth: 1 ,height: 200 , borderRadius: 200/ 2}} />}
    </View>
  );
}