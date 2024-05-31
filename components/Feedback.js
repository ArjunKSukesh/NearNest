import { View, Text, TouchableOpacity, TextInput,ToastAndroid } from "react-native";
import React, { useState } from "react";
import {  Rating,} from "react-native-elements";
import {db,}from '../firebase'


const Feedback = ({navigation,route}) => {

  const { item, userD } = route.params;
  const [feedback, setFeedback] = useState();
  const [rate,setRate]=useState(0);

  const handlePost = async () => {
    const formData = {
      propertyId: item.propertyId,
      houseName: item.houseName,
      studentId: userD.email,
      studentName:userD.name,
      feedback: feedback,
      rating:rate,
   
    };
    try {
    
      const response = await db.collection("feedbacks").add(formData);
      console.log("Form data submitted successfully:", response);
      ToastAndroid.show('Feedback successfully', ToastAndroid.SHORT);
      navigation.navigate("HouseDetails",{userD:userD,item:item});
    } 
    catch (error) {
      console.log("Error submitting form data:", error);
      ToastAndroid.show('Feeddback is not posted', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ backgroundColor: "#FFFFFF", height: "100%" }}>
      <View style={{ marginTop: 30, marginLeft: 20,marginBottom:10 }}>
        <Text style={{ fontSize: 30, fontWeight: "600", }}>Give feedback</Text>
      </View>
      <View style={{ padding: 10, marginBottom: 30,  }}>
        <Text style={{ fontSize: 18, marginBottom: 20, marginLeft:10}}>
          RATE YOUR EXPERIENCE
        </Text>

        <Rating
          ratingCount={5}
          imageSize={60}
          style={{ height: 60, marginLeft: -50 }}
          startingValue={0} 
          onFinishRating={setRate}
          
        ></Rating>

      </View>
      <View style={{ marginBottom: 10 ,borderTopWidth: 0.2}}>
        <TextInput
          multiline={true}
          placeholder="Share Your Experience"
          numberOfLines={8}
          value={feedback}
          onChangeText={setFeedback}
          style={{
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            width: "90%",
            height: 150,
            marginLeft: 10,
            marginTop: 30,
            marginBottom: 20,
          }}
        />
        <View style={{ flexDirection: "row",padding:10,justifyContent:'space-between',marginLeft:10,marginRight:10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#52A9E3",
              height: 50,
              borderRadius: 5,
              width: "45%",
            }}
            onPress={handlePost}
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
              post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#000000",
              height: 50,
              borderRadius: 5,
              width: "45%",
            }}
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
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Feedback;
