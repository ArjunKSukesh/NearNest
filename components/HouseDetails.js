import { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ToastAndroid,
} from "react-native";

import * as Location from "expo-location";

import { Card, Avatar, Rating, Icon } from "react-native-elements";
import Swiper from "react-native-swiper";
import {db,firebase}from '../firebase'
// import {useRoute} from '@react-navigation/native'

export default function HouseDetails({ route, navigation }) {

  const { item, userD } = route.params;

  console.log(userD);

useEffect(() => {

  db.collection("feedbacks").where("propertyId", "==", item.propertyId)
    .get()
    .then((querySnapshot) => {
      const dataArray = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            dataArray.push(doc.data());
        });
        setData(dataArray);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
   
}, [])




  const redirectToMaps = (longi, lati) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lati},${longi}`;
    Linking.openURL(url);
  };

  const getPlaceName = async (latitude, longitude) => {
    console.log("====lat===long===", latitude, longitude);
    try {
      const location = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const address = `${location[0].city}, ${location[0].region}, ${location[0].country}`;
      return address;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const [placeName, setPlaceName] = useState(null);

  useEffect(() => {
    const fetchPlaceName = async () => {
      const address = await getPlaceName(
        item.location.latitude,
        item.location.longitude
      );
      setPlaceName(address);
    };

    fetchPlaceName();
  }, []);

 
  //  const ownerId=item.ownerId
  console.log(item.propertyId);

  const book = async () => {
    const formData = {
      studentId: userD.email,
      ownerId: item.OwnerId,
      propertyId: item.propertyId,
      status: "pending",
      houseName: item.houseName,
      price:item.price
      
    };

    try {
      
      const response = await db.collection("booking").add(formData);
      console.log("Form data submitted successfully:", response);
      ToastAndroid.show('processing your request', ToastAndroid.SHORT);
    } catch (error) {
      console.log("Error submitting form data:", error);
      ToastAndroid.show('Property is removed from wishlist', ToastAndroid.SHORT);
    }
  };
 

  const [data, setData] = useState([]);

  const [color, setColor] = useState("white");
  return (
    <View>
      <ScrollView>
        <View>
          <Swiper
            containerStyle={{ height: 300, width: "100%" }}
            showsButtons={true}
            autoplay={true}
            loadMinimal={true}
          >
            {item.Images.map((image, i) => (
              <Image
                key={i}
                style={{
                  width: "100%",
                  height: 300,
                }}
                source={{ uri: image }}
              ></Image>
            ))}
          </Swiper>
          {/* <View
            style={{
              position: "absolute",
              left: 5,
              top: 5,
            }}
          >
            <TouchableOpacity>
              <Avatar
                rounded
                source={require("./assets/back.png")}
                onPress={() => navigation.navigate("MainPage",{userD})}
              />
            </TouchableOpacity>
          </View> */}
          {/* <View
            style={{
              position: "absolute",
              right: 10,
              top: 5,
            }}
          >
            <TouchableOpacity>
              <Icon
                name="heart"
                type="font-awesome"
                onPress={()=>color=="red"?setColor("white"):setColor("red")}
                color={color}
                size={30}
              />
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              position: "absolute",
              right: 5,
              top: 5,
            }}
          ></View>
        </View>
        <View>
          <Card containerStyle={{ width: "96%",alignContent:'center' }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="star"
                color="#FFD700"
                iconStyle={{ alignSelf: "flex-start" }}
              />
              <Text>4.5</Text>
              <TouchableOpacity
      style={{
        backgroundColor: "#52A9E3", // Set a different background color for disabled state
        height: 40,
        borderRadius: 5,
        width: 100,
        marginLeft:200
      }}
      onPress={() => navigation.navigate("Chat",{item,userD})}
    >
      <Text
        style={{
          textAlign: "center",
          padding: 10,
          fontSize: 15,
          color: "white",
          fontWeight: "600",
        }}
      >
        Chat
      </Text>
    </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20 }}>
              {item.type}
              {"\n"}
            </Text>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <Avatar
                rounded
                source={require("./assets/location.png")}
              ></Avatar>
              <TouchableOpacity
                onPress={() =>
                  redirectToMaps(
                    item.location.longitude,
                    item.location.latitude
                  )
                }
              >
                <Text style={{color: '#2637C3',marginLeft:5,fontSize:18}}>{item.houseName}</Text>
              </TouchableOpacity>
            </View>
            <Card.Divider />
            <Text style={{ fontSize: 20, marginTop: 10 }}>Descrption</Text>
            <Text style={{ textAlign: "justify" }}>{item.description}</Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <ScrollView horizontal={true}>
                <Card
                  containerStyle={{
                    width: 100,
                    height: 120,
                    borderRadius: 10,
                    backgroundColor: "#aedbeb",
                  }}
                >
                  <Avatar source={require("./assets/for.png")} />
                  <Text style={{ fontWeight: "100" }}>For</Text>
                  <Text>{item.gender}</Text>
                </Card>

                <Card
                  containerStyle={{
                    width: 100,
                    height: 120,
                    borderRadius: 10,
                    backgroundColor: "#aedbeb",
                  }}
                >
                  <Avatar source={require("./assets/phone.png")} />
                  <Text style={{ fontWeight: "100" }}>Phone</Text>
                  <Text>{item.phone}</Text>
                </Card>
                <Card
                  containerStyle={{
                    width: 100,
                    height: 120,
                    borderRadius: 10,
                    backgroundColor: "#aedbeb",
                  }}
                >
                  <Avatar source={require("./assets/food.png")} />
                  <Text style={{ fontWeight: "100" }}>Food</Text>
                  <Text>{item.food}</Text>
                </Card>
                <Card
                  containerStyle={{
                    width: 100,
                    height: 120,
                    borderRadius: 10,
                    backgroundColor: "#aedbeb",
                  }}
                >
                  <Avatar source={require("./assets/furnished.png")} />
                  <Text style={{ fontWeight: "100" }}>Furniture</Text>
                  <Text>{item.furniture}</Text>
                </Card>

                <Card
                  containerStyle={{
                    width: 100,
                    height: 120,
                    borderRadius: 10,
                    backgroundColor: "#aedbeb",
                  }}
                >
                  <Avatar source={require("./assets/bed.png")} />
                  <Text style={{ fontWeight: "100" }}>Bedroom</Text>
                  <Text>{item.bedroom}</Text>
                </Card>

                <Card
                  containerStyle={{
                    width: 100,
                    height: 120,
                    borderRadius: 10,
                    backgroundColor: "#aedbeb",
                  }}
                >
                  <Avatar source={require("./assets/water.png")} />
                  <Text style={{ fontWeight: "100" }}>Water</Text>
                  <Text>{item.water}</Text>
                </Card>
              </ScrollView>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                padding: 10,
                backgroundColor: "#e6e6e6",
                marginTop: 10,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ padding: 15, fontSize: 20 }}>₹{item.price}</Text>
              {item.status === "booked" ? (
    <TouchableOpacity
      style={{
        backgroundColor: "#ccc", // Set a different background color for disabled state
        height: 40,
        borderRadius: 5,
        width: 100,
      }}
      disabled // Disable the TouchableOpacity component
    >
      <Text
        style={{
          textAlign: "center",
          padding: 10,
          fontSize: 15,
          color: "white",
          fontWeight: "600",
        }}
      >
        Book Now
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={{
        backgroundColor: "#52A9E3",
        height: 40,
        borderRadius: 5,
        width: 100,
      }}
      onPress={book}
    >
      <Text
        style={{
          textAlign: "center",
          padding: 10,
          fontSize: 15,
          color: "white",
          fontWeight: "600",
        }}
      >
        Book Now
      </Text>
    </TouchableOpacity>
  )}
            </View>
            <Card.Divider/>
            <View>
            <Text style={{ fontSize: 20, marginTop: 10,height:50,borderBottomWidth:.2}}>View Feedback</Text>
            {data &&
        data.map((rating, index) => (
                  <Card key={index} containerStyle={{marginTop:20,borderRadius:10,backgroundColor:'#f6f6f6'}}>
                  <Text style={{marginBottom:10}}>{rating.studentName}</Text>
                    <Rating startingValue={rating.rating} readonly imageSize={20} style={{alignSelf:'flex-start'}}></Rating>
                    <Text  style={{  marginTop: 10 }}>{rating.feedback}</Text>
                  </Card>
                        ))}

            <TouchableOpacity onPress={() => navigation.navigate("Feedback",{item,userD})} style={{backgroundColor:'#52A9E3',height:50,
            justifyContent:'center',borderRadius:10,marginTop:20}}>
              <Text style={{textAlign:'center',fontSize:15,color:'white',fontWeight: "600",}}>ADD FEEDBACK</Text></TouchableOpacity>
              </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
