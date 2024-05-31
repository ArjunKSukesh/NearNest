import { View, Text ,SafeAreaView,TouchableOpacity,Image,navigation} from 'react-native'
import { Card, ListItem, Button, Icon, Avatar } from "react-native-elements";
import React,{useState} from 'react'
import { useNavigation } from "@react-navigation/native";
const Ownercard = () => {
  const navigation = useNavigation();
  return (
    <View>
      <SafeAreaView>
      <Card containerStyle={{ width: "100%", height: 185, borderRadius: 10 }}>
      
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("./assets/download.jpeg")}
              resizeMode="cover"
              style={{
                width: "50%",
                height: 185,
                marginLeft: -15,
                marginTop: -15,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius:10,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: 125,
                top: -10,
              }}
            >
              
            </View>
            <View style={{ marginLeft: 10,marginBottom:10  }}>
              <Text style={{ fontSize:20}}>House Name: </Text>
              <Text>Accomodation For: Boys</Text>
              <Text>Property Type: House</Text>
              <View style={{ flexDirection: "row" }}>
                <Text>Rating: </Text>
                <Icon
                  name="star"
                  color="#FFD700"
                  iconStyle={{ alignSelf: "flex-start" }}
                />
                <Text> 4.5</Text>
              </View>
              <Text>price: ₹15000</Text>
              <View>
                <View style={{ flexDirection: "row",marginTop:10,}}>
                  <Button title="Edit" containerStyle={{borderRadius:10, marginRight:20}}></Button>
                  <Button title="View Feedback" containerStyle={{borderRadius:10}}></Button>
                </View>
              </View>
            </View>
          </View>
       
      </Card>
    </SafeAreaView>
    </View>
  )
}

export default Ownercard