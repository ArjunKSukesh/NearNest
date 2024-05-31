import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,TouchableOpacity
} from "react-native";
import { Avatar } from "@rneui/base";
import { auth } from "../firebase";

export default function Profile({navigation,route}) {
  // const navigation = useNavigation();
  const {userD }=route.params;
  const signOut = () => { 
  
    console.log("Signout called")
   auth.signOut().then(()=>navigation.navigate("Login")).catch((err)=>console.log(err)) }
  
  return (
<View>
<ScrollView showsVerticalScrollIndicator={false}>
<View style={{padiing:10,width:'100%',backgroundColor:'#000',height:150}}>
  <TouchableOpacity>
    <Avatar source={require('./assets/back.png')}/>
  </TouchableOpacity>
  
</View>
<View style={{alignItems:'center'}}>
<Image source={{ uri: userD.imageURL }} style={{width:140,height:140,borderRadius:100,marginTop:-70}}/>
  <Text style={{fontSize:25,fontWeight:'bold',padding:10}}>{userD.name}</Text>
</View>


<View style={{alignSelf:'center',
flexDirection:'row',justifyContent:'center',backgroundColor:'#fff',width:'90%',
padding:20,paddingBottom:22,borderRadius:10,shadowOpacity:80,elevation:15,marginTop:10}}>
  <Image source={require('./assets/email.png')} style={{width:20,height:20}}/>
  <Text> {userD.email}</Text>
  </View>

  <View style={{alignSelf:'center',
flexDirection:'row',justifyContent:'center',backgroundColor:'#fff',width:'90%',
padding:20,paddingBottom:22,borderRadius:10,shadowOpacity:80,elevation:15,marginTop:20}}>
 <Image source={require('./assets/location1.jpeg')} style={{width:20,height:20}}/>
 <Text>{userD.place}</Text>
 
</View>
<View style={{alignSelf:'center',
flexDirection:'row',justifyContent:'center',backgroundColor:'#fff',width:'90%',
padding:20,paddingBottom:22,borderRadius:10,shadowOpacity:80,elevation:15,marginTop:20}}>
 <Image source={require('./assets/phone.png')} style={{width:20,height:20}}/>
 <Text>{userD.phone}</Text>
 
</View>
{userD.userType === "students" && (
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "#fff",
              width: "90%",
              padding: 20,
              paddingBottom: 22,
              borderRadius: 10,
              shadowOpacity: 80,
              elevation: 15,
              marginTop: 20,
            }}
            >
            {/* <Image source={require('./assets/email.png')} style={{width:20,height:20}}/> */}
            <Text onPress={() => navigation.navigate("Booking",{userD})} >booking</Text>
          </View>
        )}

        <View style={{alignSelf:'center',
flexDirection:'row',justifyContent:'center',backgroundColor:'#fff',width:'90%',
padding:20,paddingBottom:22,borderRadius:10,shadowOpacity:80,elevation:15,marginTop:20}}>
 <Image source={require('./assets/edit.png')} style={{width:20,height:20}}/>
 <Text onPress={() => navigation.navigate("EditProfile",{userD})} >Edit Profile</Text></View>

<TouchableOpacity style={{alignSelf:'center',
flexDirection:'row',justifyContent:'center',backgroundColor:'#fff',width:'90%',
padding:20,paddingBottom:22,borderRadius:10,shadowOpacity:80,elevation:15,marginTop:20,backgroundColor:'#000',marginBottom:20}} onPress={signOut}>
 <Image source={require('./assets/phone.png')} style={{width:20,height:20}}/>
 <Text style={{color:"#FFFFFF"}}>Logout</Text></TouchableOpacity>

</ScrollView></View>
)}