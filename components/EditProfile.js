import React, { useState } from "react";
import { View, Text, TextInput, Button,StyleSheet ,TouchableOpacity} from "react-native";
import { db } from "../firebase";

export default function EditProfile({ navigation, route }) {
    const { userD } = route.params;
    const [name, setName] = useState(userD.name);
    const [phone, setPhone] = useState(userD.phone);
    const [place, setPlace] = useState(userD.place);
console.log(userD.email)

const handleSaveChanges = () => {
    // Check if the document exists
    db.collection("users")
      .where("email", "==", userD.email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Get the first document from the query snapshot
          const doc = querySnapshot.docs[0];
  
          // Update the user data in Firestore
          db.collection("users")
            .doc(doc.id)
            .update({
              name: name,
              phone: phone,
              place: place,
            })
            .then(() => {
              console.log("Profile updated successfully");
              // Navigate back to the Profile screen
              navigation.goBack();
            })
            .catch((error) => {
              console.log("Error updating profile: ", error);
            });
        } else {
          console.log("User document doesn't exist");
        }
      })
      .catch((error) => {
        console.log("Error retrieving document: ", error);
      });
  };
  
      
  
    return (
      <View style={styles.container}>
        <Text style={styles.head}>Edit Profile</Text>
        <Text style={styles.text}>Name: </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          style={styles.input}/>
          <Text style={styles.text}>phone: </Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          style={styles.input}
        />
        <Text style={styles.text}>place: </Text>
        <TextInput
          value={place}
          onChangeText={setPlace}
          placeholder="Place"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>Save Changes</Text>
           
          </TouchableOpacity>
        
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFFFFF",
      height: "100%",
      
    },
    head: {
      textAlign: "center",
      fontSize: 25,
      fontWeight: "20",
      marginBottom: 20,
    },
    input: {
      width: "90%",
      height: 50,
      padding: 10,
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 5,
      marginBottom: 20,
      borderColor: "#16C72E",
      alignSelf: "center",
    },
    button: {
        backgroundColor: "#347deb",
        padding: 5,
        marginTop: 30,
        width: 350,
        height: 50,
        alignSelf: "center",
        borderRadius: 10,
        justifyContent: "center",
        marginBottom: 30,
        borderRadius: 30,
        
      },
      buttonText: {
        color: "white",
        // width: 200,
        height: 20,
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
      },
      text:{
        fontSize:18,
        marginLeft:20,
        fontWeight:'500'
        ,marginBottom:10
      },
});