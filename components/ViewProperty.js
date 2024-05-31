import { View, Text ,SafeAreaView,TouchableOpacity,Image, ScrollView} from 'react-native'
import { Card,  Button, Icon, Avatar } from "@rneui/themed";
import React,{useState,useEffect} from 'react'
import {db,firebase}from '../firebase'

const ViewProperty = ({navigation,route}) => {
  const {userD }=route.params;
  console.log(userD)
  const [data,setData]=useState([]);
  useEffect (()=>{
    
    db.collection("property").where("OwnerId", "==", userD.email)
    .get()
    .then((querySnapshot) => {
      const dataArray = [];
      let docIndex = 0;
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            dataArray.push(doc.data());
            dataArray[docIndex].propertyId = doc.id;
            docIndex++;
        });
        setData(dataArray);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    

  }, []);

  return (
      <SafeAreaView style={{alignItems:'center',marginBottom:10}}>
      <ScrollView>
      {data && data.map((item, index) => (
      <Card key={index} containerStyle={{ width: "97%", height: 175, borderRadius: 10 ,marginLeft:-.5}}>
      
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{uri:item.Images[0]}}
              resizeMode="cover"
              style={{
                width: "50%",
                height: 175,
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
              <Text style={{ fontSize:20,fontWeight:'500',marginBottom:5}}>{item.houseName} </Text>
              <Text>{item.gender}</Text>
              <Text>{item.type}</Text>
              <Text>price: {item.price}</Text>
              <View>
                <View style={{ justifyContent:'center',marginTop:10,}}>
                  <Button color="#52A9E3" title="Edit" containerStyle={{borderRadius:10, marginRight:20,width:150}} onPress={()=>{ navigation.navigate("Edit",{item});}}></Button>
                </View>
              </View>
            </View>
          </View>
       
      </Card>
      ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ViewProperty