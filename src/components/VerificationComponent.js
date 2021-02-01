import * as React from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';

try {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyAkqr6EVIOafD3OgZ4yJ61r7Xw9iatZXsQ",
      authDomain: "bar-peak.firebaseapp.com",
      projectId: "bar-peak",
      storageBucket: "bar-peak.appspot.com",
      messagingSenderId: "679573729418",
      appId: "1:679573729418:web:6f247e063bc33567aa7d73",
      measurementId: "G-640X1HCE70"
    }); 
  }
} catch (err) {
  console.log("the error", err)
}

export default function App(props) {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const [message, showMessage] = React.useState(
    !firebaseConfig || Platform.OS === 'web'
      ? {
          text:
            'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
        }
      : undefined
  );
  const attemptInvisibleVerification = true;

  const sendVerificationCode = async () => {

    const phoneNumber = "+" + props.currentcountry + props.phoneNumber;
    console.log("the phone number to text", phoneNumber)
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      props.onSendVerification(verificationId)
    } catch (err) {
      console.log("here the verification error", err)
      showMessage({ text: `Error: ${err.message}`, color: 'red' });
    }
  }

  return (
    <View style={{ padding: 0, marginTop: 0 }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
      <TouchableOpacity
        onPress = {()=> { 
         sendVerificationCode()
        }}
        disabled = { props.phoneNumber === '' ? true : false}
        style = {[styles.continueButton, props.phoneNumber === '' && { backgroundColor: "#e0dede"}] }
        
      >
        <Text style = {styles.continueText} >Continue</Text>
      </TouchableOpacity>
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 0xffffffee, justifyContent: 'center' },
          ]}
          onPress={() => showMessage(undefined)}>
          <Text
            style={{
              color: message.color || 'blue',
              fontSize: 17,
              textAlign: 'center',
              margin: 20,
            }}>
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : (
        undefined
      )}
      {!attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  );
}

const styles = StyleSheet.create({
  continueText:{ 
    textAlign: "center", 
    color: "white", 
    fontSize: 18
  },
  continueButton: {
    backgroundColor: '#e33446',
    padding: 20,
    paddingTop: 17,
    paddingBottom: 17,
    borderRadius: 10,
    width: "100%"
  }

})