import { useState,useEffect } from "react";
import { TouchableOpacity,Text,View,Image,Navigation,Alert} from 'react-native';
import back from "./assets/back.png";
import { Avatar,ListItem ,Button } from '@rneui/themed';
import {db} from '../firebase'



const Inmates = ({navigation,route}) => {
  const {userD }=route.params;
  const ownerId=userD.email
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const bookingSnapshot = await db.collection("booking").where("ownerId", "==", ownerId).where("status","==","booked").get();
      const bookingDataArray = [];
      const promises = [];
      bookingSnapshot.forEach((bookingDoc) => {
        const bookingData = bookingDoc.data();
        const studentDetails=bookingData.studentId
        bookingDataArray.push({ ...bookingData, bookId: bookingDoc.id });
  
        const studentRef = db.collection("users").where("email", "==", studentDetails);
        // Add a promise that resolves when both the booking data and student data are fetched
        promises.push(
          Promise.all([
            studentRef.get(),
            Promise.resolve({ ...bookingData, bookId: bookingDoc.id })
          ]).then(([studentSnapshot, bookingData]) => {
            const studentData = studentSnapshot.docs[0].data(); // Use docs[0] to get the first result
            bookingData.student = studentData;
            return bookingData;
          })
        );
      });
  
      // Wait for all promises to resolve before setting the state with the combined data
      Promise.all(promises).then((bookingDataArray) => {
        setData(bookingDataArray);
      }).catch((error) => {
        console.log("Error getting documents: ", error);
      
      });
      
    };
    fetchData();
  }, []); 
  
  return (
      <View >
      {data && data.map((item, index) => (
     <ListItem key={index} bottomDivider >      
     <ListItem.Content style={{flexDirection:"row",alignItems:'center',justifyContent:'space-around',}}>
     <Avatar
    size={32}
    rounded
     source={{ uri: userD.imageURL }}
  />
      <ListItem.Title>{item.student.name}</ListItem.Title>
      
    </ListItem.Content>
    <Button title="View Details" buttonStyle={{borderRadius:20,backgroundColor:'#52A9E3'}}
        onPress={()=>navigation.navigate("StudentDetails",{item})}
    />
    
    
    
  </ListItem>
  ))}
</View>

    
  )
}

export default Inmates