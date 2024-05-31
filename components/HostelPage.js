import {
    TouchableOpacity,
    Text,
    View,
    Image,
    Navigation,
    ScrollView,
    TextInput,
  } from "react-native";
  import React, {  useState } from "react";
  import HostelCards from "./HostelCards";
  export default function HostelPage({ navigation, route }) {
    
    const [searchText, setSearchText] = useState("");
    const {userD} = route.params;
    const onSearch = () => {
      console.log(`Searching for ${searchText}`);
    };
  
    return (
      <View style={{flex:1,}}>
        <ScrollView >
          <View style={{ justifyContent: "center"}}>
            <TextInput
              style={{
                height: 50,
                width: "95%",
                padding: 10,
                borderRadius: 15,
                borderColor: "gray",
                marginTop: 20,
                marginLeft: 10,
                borderWidth: 1,
                fontSize: 20,
              }}
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
              onPress={onSearch}
              placeholder="Search Here"
            />
          </View>
          <View style={{ alignItems:'center' }}>
            <HostelCards userD={userD}/>
            
          </View>
        </ScrollView>
      </View>
    );
  }
  