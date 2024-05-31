import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import {
  Button,
  Slider,
  Icon,
} from "@rneui/themed";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { db } from "../firebase";
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';
const storageRef = firebase.storage().ref();
import * as Location from "expo-location";


const AddProperty = ({ navigation, route }) => {
  const { userD } = route.params;
  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // handle permission denied
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    let addressResponse = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setLocation(location.coords);
  };
  const [houseName, setHouseName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState();
  const [price, setPrice] = useState();
  const [gender, setGender] = useState();
  const [furniture, setFurniture] = useState();
  const [food, setFood] = useState();
  const [water, setWater] = useState();
  const [total, setTotal] = useState();
  const [bedroom, setBedroom] = useState();
  const [description, setDescription] = useState();
  const [phone, setPhone] = useState();
  const [picture, setPicture] = useState([]);
  const [images, setImages] = useState([]);
  const interpolate = (start, end) => {
    let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };
  
  const [value, setValue] = useState(0);
  const [vertValue, setVertValue] = useState(0);
  const [isImagesSelected, setIsImagesSelected] = useState(false);
  const [imageResult, setImageResult] = useState("");

  
  const handleSubmit = async () => {
    const formData = {
      houseName: houseName,
      type: type,
      price: price,
      gender: gender,
      furniture: furniture,
      food: food,
      water: water,
      total: total,
      bedroom: bedroom,
      description: description,
      phone: phone,
      location: location,
      Images: [], // Initialize the Images array
      OwnerId: userD.email,
      status: "Available",
    };
  
    if (isImagesSelected) {
      try {
        for (let image of imageResult.assets) {
          const uri = image.uri;
          const filename = uri.substring(uri.lastIndexOf("/") + 1);
          const uploadUri =
            Platform.OS === "ios" ? uri.replace("file://", "") : uri;
          const response = await fetch(uploadUri);
          const blob = await response.blob();
          const ref = storageRef.child(filename);
          await ref.put(blob);
          console.log("Image uploaded successfully!");
          const url = await ref.getDownloadURL();
          formData.Images.push(url); // Push the URL to the formData.Images array
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Images not selected.");
    }
  
    try {
      const response = await db.collection("property").add(formData);
      console.log("Form data submitted successfully:", response);
      ToastAndroid.show("Property added successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.log("Error submitting form data:", error);
    }
    // navigation.navigate('OwnerHome',{userD})
  };
  
  const color = () => {
    // let r = interpolate(255, 0);
    // let g = interpolate(0, 255);
    // let b = interpolate(0, 0);
    // return `rgb(${r},${g},${b})`;
  };
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
    setIsImagesSelected(!result.canceled);
    setImageResult(result);
  };
  
  const [imageList, setImageList] = useState([]);
  
  const addImage = (uri) => {
    setImageList([...imageList, uri]);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.subhead}>Property Type</Text>
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[
              styles.btn,
              type === "Hostel" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setType("Hostel")}
          >
            <Text
              style={[
                styles.btnText,
                type === "Hostel" ? { color: "white" } : null,
              ]}
            >
              Hostel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              type === "House" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setType("House")}
          >
            <Text
              style={[
                styles.btnText,
                type === "House" ? { color: "white" } : null,
              ]}
            >
              House
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              type === "Room" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setType("Room")}
          >
            <Text
              style={[
                styles.btnText,
                type === "Room" ? { color: "white" } : null,
              ]}
            >
              Room
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subhead}>House Name</Text>
        <TextInput
          placeholder="House Name:"
          style={styles.input}
          onChangeText={setHouseName}
        ></TextInput>

        {/*  */}
        {/*  */}
        <Text style={styles.subhead}>Accomodation For</Text>
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[
              styles.btn,
              gender === "Boys" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setGender("Boys")}
          >
            <Text
              style={[
                styles.btnText,
                gender === "Boys" ? { color: "white" } : null,
              ]}
            >
              Boys
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              gender === "Girls" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setGender("Girls")}
          >
            <Text
              style={[
                styles.btnText,
                gender === "Girls" ? { color: "white" } : null,
              ]}
            >
              Girls
            </Text>
          </TouchableOpacity>
        </View>

        {/*  */}
        <Text style={styles.subhead}>Price: {price}</Text>
        <View style={[styles.contentView]}>
          <Slider
            value={price}
            onValueChange={setPrice}
            maximumValue={20000}
            minimumValue={1000}
            step={1}
            allowTouchTrack
            trackStyle={{ height: 5, backgroundColor: "transparent" }}
            thumbStyle={{
              height: 20,
              width: 10,
              backgroundColor: "transparent",
            }}
            thumbProps={{
              children: (
                <Icon
                  name="circle"
                  type="font-awesome"
                  size={10}
                  reverse
                  containerStyle={{ bottom: 10, right: 10 }}
                  color={color()}
                />
              ),
            }}
          />
        </View>

        {/*  */}
        <Text style={styles.subhead}>Contact Number</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Contact Number"
          value={phone}
          onChangeText={setPhone}
        />
        {/*  */}
        <Text style={styles.subhead}>Total Accomodation</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Total Accomodation"
          value={total}
          onChangeText={setTotal}
        />

        {/*  */}
        <Text style={styles.subhead}>Total Bedrooms</Text>
      
        <TextInput
          style={styles.input}
          placeholder="Enter Total Bedrooms"
          value={bedroom}
          onChangeText={setBedroom}
        />
        

        <Text style={styles.subhead}>Furniture</Text>
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[
              styles.btn,
              furniture === "Fully-Furnished"
                ? { backgroundColor: "#4F9FA0" }
                : null,
            ]}
            onPress={() => setFurniture("Fully-Furnished")}
          >
            <Text
              style={[
                styles.btnText,
                furniture === "Fully-Furnished" ? { color: "white" } : null,
              ]}
            >
              Fully-Furnished
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              furniture === "Semi-Furnished"
                ? { backgroundColor: "#4F9FA0" }
                : null,
            ]}
            onPress={() => setFurniture("Semi-Furnished")}
          >
            <Text
              style={[
                styles.btnText,
                furniture === "Semi-Furnished" ? { color: "white" } : null,
              ]}
            >
              Semi-Furnished
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              furniture === "No-furnished"
                ? { backgroundColor: "#4F9FA0" }
                : null,
            ]}
            onPress={() => setFurniture("No-furnished")}
          >
            <Text
              style={[
                styles.btnText,
                furniture === "No-furnished" ? { color: "white" } : null,
              ]}
            >
              No-furnished
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subhead}>Food</Text>

        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[
              styles.btn,
              food === "Yes" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setFood("Yes")}
          >
            <Text
              style={[
                styles.btnText,
                food === "Yes" ? { color: "white" } : null,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              food === "No" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setFood("No")}
          >
            <Text
              style={[
                styles.btnText,
                food === "No" ? { color: "white" } : null,
              ]}
            >
              No
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subhead}>Water</Text>

        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[
              styles.btn,
              water === "Yes" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setWater("Yes")}
          >
            <Text
              style={[
                styles.btnText,
                water === "Yes" ? { color: "white" } : null,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              water === "No" ? { backgroundColor: "#4F9FA0" } : null,
            ]}
            onPress={() => setWater("No")}
          >
            <Text
              style={[
                styles.btnText,
                water === "No" ? { color: "white" } : null,
              ]}
            >
              No
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.subhead}>Location</Text>
          <Button
            title="Get Location"
            onPress={getLocationAsync}
            color="#4F9FA0"
            containerStyle={{
              backgroundColor: "",
              width: "90%",
              borderRadius: 10,
              alignSelf: "center",
            }}
            titleStyle={{ fontSize: 20 }}
          />
          {location && (
            <TextInput
              value={`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
              editable={false}
              style={styles.input}
            />
          )}
        </View>

        <Text style={styles.subhead}>Description</Text>
        <TextInput
          multiline={true}
          placeholder="Enter Description"
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
          style={{
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            width: "90%",
            height: 100,
            marginLeft: 10,
          }}
        />
       

        <Text style={styles.subhead}>Add Images</Text>
        <TouchableOpacity
          style={{
            width: 150,
            height: 150,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "",
            marginLeft: 10,
          }}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}></Text>
          <Icon
            name="plus"
            type="font-awesome"
            color="#4F9FA0"
            onPress={() => console.log("hello")}
            containerStyle={{ size: 50 }}
          />
          <Text>Add Images</Text>
        </TouchableOpacity>
        <View style={styles.ImageConatiner}>
          {imageList.map((uri) => (
            <Image
              key={uri}
              source={{ uri }}
              style={{ width: 200, height: 200 }}
            />
          ))}
        </View>

        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#52A9E3",
              width: "90%",
              borderRadius: 10,
            }}
            onPress={handleSubmit}
          >
            <Text
              style={{
                textAlign: "center",
                padding: 10,
                fontSize: 20,
                color: "white",
                fontWeight: "600",
              }}
            >
              Add Property
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#e5e5fe",
    alignItems: "center",
    marginLeft: 20,
    // justifyContent:'center'End
  },

  input: {
    width: "95%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  head: {
    fontSize: 20,
    textAlign: "center",
    padding: 10,
    marginLeft: 10,
  },
  subhead: {
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  btnGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#6B7280",
  },
  btn: {
    flex: 1,
    borderWidth: 0.25,
    borderColor: "#6B7280",
  },
  btnText: {
    textAlign: "center",
    paddingVertical: 16,
    fontSize: 14,
  },
  contentView: {
    padding: 20,
    width: "95%",
    justifyContent: "center",
    alignItems: "stretch",
  },
  ImageConatiner: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
  },
  uploadButton: {
    backgroundColor: "#e5e5fe",
  },
});
