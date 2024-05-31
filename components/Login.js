import React, { useState, useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ScrollView
} from "react-native";
import Lottie from 'lottie-react-native';
import * as Location from 'expo-location';


export default function Login({ navigation }) {

  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // handle permission denied
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    };

    getLocationAsync();
  }, []);
  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  
  const changepassword = () => {
    if (email) {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to reset your password?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              auth.sendPasswordResetEmail(email)
                .then(() => {
                  alert("Password reset email sent");
                })
                .catch((error) => {
                  alert(error.message);
                });
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      alert("Please enter your email");
    }
  };
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is already logged in, navigate to the appropriate screen
        db.collection("users")
          .where("email", "==", user.email)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const userD = querySnapshot.docs[0].data();

              if (userD.userType === "students") {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "HomeScreen", params: { userD: userD } }],
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "OwnerHome", params: { userD: userD } }],
                });
              }
            }
          })
          .catch((err) => console.log(err));
      }
    });

    return () => unsubscribe();
  }, []);
  


  const handleLogin = async () => {
    try {
      setIsLoading(true); // Start the loading animation
      await auth.signInWithEmailAndPassword(email, password);
      const user = auth.currentUser;
      console.log("login---");
      db.collection("users")
        .where("email", "==", user.email)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const userD = querySnapshot.docs[0].data();
            console.log(userD.userType);
  
            if (userD.userType == "students") {
              console.log(userD, "userD PASSED");
              navigation.reset({
                index: 0,
                routes: [{ name: "HomeScreen", params: { userD: userD } }],
              });
            } else {
              console.log("true1", userD.userType);
              navigation.reset({
                index: 0,
                routes: [{ name: "OwnerHome", params: { userD: userD } }],
              });
            }
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      Alert.alert("Invalid Username or Password");
    } finally {
      setIsLoading(false); // Stop the loading animation
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Image
            source={require("./assets/login.png")}
            style={styles.image}
          />
        </View>

        <Text style={styles.head}>Login to your account</Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            width: 400,
          }}
        >
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 30,
              }}
              onPress={togglePasswordVisibility}
            >
              <Image
                source={
                  showPassword
                    ? require("./assets/eye-open.png")
                    : require("./assets/eye-closed.png")
                }
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
          <Text onPress={changepassword} style={styles.text}>Forgot Password?</Text>


          
            {isLoading ? ( // Show loader animation if isLoading is true
              <View style={{alignItems:'center'}}>
              <Lottie
                source={require("./assets/loader.json")}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              </View>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
           
          </TouchableOpacity>
          )}
          <View style={{ flexDirection: "row", alignContent: "center" }}>
            <Text style={{ marginTop: 20, marginLeft: 100 }}>
              Don't have an account ?
            </Text>
            <Text
              style={styles.text}
              onPress={() => navigation.navigate("SignUp")}
            >
              {" "}
              Register
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    alignItems: "center",
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
    marginBottom: -10,
    borderColor: "#16C72E",
    alignSelf: "center",
  },
  inputView: {
    position: "relative",
    marginTop: 35,
  },
  button: {
    backgroundColor: "#038E47",
    padding: 5,
    marginTop: 10,
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
  image: {
    width: 400,
    height: 250,
  },
  text: {
    textAlign: "right",
    marginBottom: 5,
    color: "#16C72E",
    marginTop: 20,
    marginRight: 50,
  },
  login: {
    position: "absolute",
    backgroundColor: "#E4E4E4",
    width: "100%",
    marginTop: 200,
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});
