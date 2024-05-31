import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { Card, Icon } from "react-native-elements";
import { db } from "../firebase";

export default function MainPage({ navigation, route }) {
  const { searchResults, userD } = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const userId = userD.email;
    const wishlistRef = db.collection("wishlist");

    wishlistRef
      .where("userId", "==", userId)
      .get()
      .then((querySnapshot) => {
        const wishlistItems = querySnapshot.docs.map(
          (doc) => doc.data().propertyId
        );
        const updatedSearchResults = searchResults.map((item) => ({
          ...item,
          isWishlisted: wishlistItems.includes(item.propertyId.toString()),
        }));
        setData(updatedSearchResults);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  const handleWishlist = (propertyId, index) => {
    const userId = userD.email;
    const wishlistRef = db.collection("wishlist");

    const item = data[index];
    const isWishlisted = !item.isWishlisted;

    if (isWishlisted) {
      wishlistRef
        .add({
          userId: userId,
          propertyId: propertyId.toString(),
        })
        .then(() => {
          setData((prevData) =>
            prevData.map((item, i) =>
              i === index ? { ...item, isWishlisted: true } : item
            )
          );
        })
        .catch((error) => {
          console.log("Error adding document: ", error);
        });
    } else {
      wishlistRef
        .where("userId", "==", userId)
        .where("propertyId", "==", propertyId.toString())
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            querySnapshot.docs[0].ref
              .delete()
              .then(() => {
                setData((prevData) =>
                  prevData.map((item, i) =>
                    i === index ? { ...item, isWishlisted: false } : item
                  )
                );
              })
              .catch((error) => {
                console.log("Error deleting document: ", error);
              });
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };

  const book = async (item) => {
    const formData = {
      studentId: userD.email,
      ownerId: item.OwnerId,
      propertyId: item.propertyId,
      status: "pending",
      houseName: item.houseName,
      price: item.price,
    };

    try {
      const response = await db.collection("booking").add(formData);
      console.log("Form data submitted successfully:", response);
      ToastAndroid.show("processing your request", ToastAndroid.SHORT);
    } catch (error) {
      console.log("Error submitting form data:", error);
      // ToastAndroid.show('Property is removed from wishlist', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          {data.map((item, index) => (
            <Card key={index} containerStyle={{ width: "95%", height: 150, borderRadius: 10, padding: 10, alignSelf: 'center' }}>
              <TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{ uri: item.Images[0] }}
                    resizeMode="cover"
                    style={{
                      width: "55%",
                      height: 150,
                      marginLeft: -15,
                      marginTop: -15,
                      marginTop: -10,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      left: 140,

                    }}
                  >
                    <TouchableOpacity>
                      <Icon
                        name="heart"
                        type="font-awesome"
                        onPress={() => handleWishlist(item.propertyId, index)}
                        color={item.isWishlisted ? "red" : "white"} // Use isWishlisted property to determine color
                        size={25}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    {/* <Text style={{ fontSize: 18,fontWeight:'200',marginBottom:10}}>{item.type}</Text> */}
                    <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>{item.houseName}</Text>


                    <View style={{ flexDirection: "row" }}>
                      <Text></Text>

                      <Text style={{ fontSize: 15 }}>{item.gender}</Text>
                      <Icon
                        name="star"
                        color="#FFD700"
                        iconStyle={{ alignSelf: "flex-start" }}
                      />
                      <Text> 4.5</Text>

                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '200', textDecorationLine: 'underline' }}
                      onPress={() => navigation.navigate("HouseDetails", { item: item, userD: userD })}>Show Details</Text>

                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'space-between', }}>
                      <Text style={{ color: '#2637C3', fontSize: 18, marginTop: 5 }}>₹{item.price}  </Text>
                      {item.status === "booked" ? (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#ccc", // Set a different background color for disabled state
                            height: 40,
                            borderRadius: 5,
                            width: 80,
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
                            Book
                          </Text>
                        </TouchableOpacity>
                      ) : (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#52A9E3",
                              height: 40,
                              borderRadius: 5,
                              width: 80,
                            }}
                            onPress={() => book(item)}
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
                              Book
                          </Text>
                          </TouchableOpacity>
                        )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
