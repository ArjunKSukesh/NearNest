import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Image,
 
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { auth, db } from '../firebase';
import firebase from "firebase/compat/app";
import * as ImagePicker from 'expo-image-picker';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [place, setPlace] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState('house owner');
  const [emptyFields, setEmptyFields] = useState([]);
  const [image, setImage] = useState(null);

  const handleSignUp = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredentials.user;
      console.log(user.email);

      // Upload the image to Firebase Storage
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = firebase.storage().ref(`images/${user.uid}`);
        await imageRef.put(blob);
        const downloadURL = await imageRef.getDownloadURL();

        // Store user data in Firestore with the image URL
        await db.collection('users').add({
          userType: checked,
          email: email,
          phone: phone,
          place: place,
          name: name,
          imageURL: downloadURL,
        });
      } else {
        // If no image is selected, store the user data without the image URL
        await db.collection('users').add({
          userType: checked,
          email: email,
          phone: phone,
          place: place,
          name: name,
        });
      }

      ToastAndroid.show('SignUp successful', ToastAndroid.SHORT);
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'place':
        setPlace(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    if (emptyFields.includes(field) && value.trim() !== '') {
      setEmptyFields(emptyFields.filter(item => item !== field));
    } else if (!emptyFields.includes(field) && value.trim() === '') {
      setEmptyFields([...emptyFields, field]);
    }
  };

  const isFormValid = () => {
    if (
      email === '' ||
      name === '' ||
      phone === '' ||
      place === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      ToastAndroid.show('Some Fields are empty', ToastAndroid.SHORT);
      return false;
    }
    return true;
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const imageUri = result.assets[0].uri; // Use the first selected asset's URI
      setImage(imageUri);
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image source={require('./assets/login.png')} style={styles.image} />
        </View>
        <Text style={styles.head}>Sign Up</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <RadioButton
            value="house owner"
            status={checked === 'house owner' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('house owner')}
          />
          <Text style={{ marginRight: 20, fontSize: 18 }}>House Owner</Text>
          <RadioButton
            value="students"
            status={checked === 'students' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('students')}
          />
          <Text style={{ marginRight: 20, fontSize: 18 }}>Student</Text>
        </View>
        <TextInput
          style={[styles.input, emptyFields.includes('email') && styles.emptyInput]}
          placeholder="Email"
          value={email}
          onChangeText={value => handleFieldChange('email', value)}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, emptyFields.includes('name') && styles.emptyInput]}
          placeholder="Name"
          value={name}
          onChangeText={value => handleFieldChange('name', value)}
        />
        <TextInput
          style={[styles.input, emptyFields.includes('phone') && styles.emptyInput]}
          placeholder="Phone"
          value={phone}
          onChangeText={value => handleFieldChange('phone', value)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, emptyFields.includes('place') && styles.emptyInput]}
          placeholder="Place"
          value={place}
          onChangeText={value => handleFieldChange('place', value)}
        />
        <TextInput
          style={[styles.input, emptyFields.includes('password') && styles.emptyInput]}
          placeholder="Password"
          value={password}
          onChangeText={value => handleFieldChange('password', value)}
          secureTextEntry
        />
        <TextInput
          style={[styles.input, emptyFields.includes('confirmPassword') && styles.emptyInput]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={value => handleFieldChange('confirmPassword', value)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
          <Text style={styles.buttonText}>Upload Profile Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 30 }}>
          <Text style={{ fontSize: 15, alignSelf: 'center', marginLeft: 100 }}>
            Already have an account?
          </Text>
          <Text style={styles.text} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </View>
        <View style={{ marginTop: 20 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    alignItems: 'center',
  },
  head: {
    textAlign: 'center',
    fontSize: 25,
    padding: 10,
  },
  input: {
    width: '95%',
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 15,
    borderColor: '#16C72E',
    alignSelf: 'center',
  },
  emptyInput: {
    borderColor: 'red',
  },
  image: {
    width: 350,
    height: 200,
  },
  button: {
    backgroundColor: '#038E47',
    padding: 5,
    marginTop: 20,
    width: 350,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    height: 20,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  text: {
    color: '#16C72E',
  },
});

export default SignUp;
