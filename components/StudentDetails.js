import { View, Text,StyleSheet } from 'react-native'
import { Card } from '@rneui/base'
import React from 'react'
import { Button } from 'react-native-elements'

const StudentDetails = ({navigation,route}) => {
  const {item}=route.params
  const {userD }=route.params;
  return (
    <View>
      <Card>
     
      <Text style={styles.head}>Student Details</Text>
        <View style={styles.details}>
        <Text style={styles.text}>Name</Text>
        <Text style={styles.text}>{item.student.name}</Text>
        </View>
        <View style={styles.details}>
         <Text style={styles.text}>Contact Number</Text>
         <Text style={styles.text}>{item.student.phone}</Text>
        </View>
        <View style={styles.details}>
         <Text style={styles.text}>place</Text>
         <Text style={styles.text}>{item.student.place}</Text>
        </View>
        <View style={styles.details}>
         <Text style={styles.text}>House Name</Text>
         <Text style={styles.text}>{item.houseName}</Text>
         </View>
         <View style={styles.details}>
         <Text style={styles.text}>Status</Text>
         <Text style={styles.text}>{item.status}</Text>
         </View>
         <View style={{marginTop:20}}>
        {/* <Button color="#52A9E3" onPress={()=>navigation.navigate("Applications")} title="Back" titleStyle={{fontSize:20}}></Button> */}
        </View>
      </Card>
    </View>
  )
}

export default StudentDetails


const styles = StyleSheet.create({

details:{
  flexDirection:'row',
  justifyContent:'space-between',
  marginLeft:10,
  marginRight:10
  ,marginBottom:10,
},
head:{
   fontSize:25,
   textAlign:'center',
   fontWeight:'500',
   marginBottom:30
},
text:{
  fontSize:18
}
})