import { ScrollView, Text, View } from 'react-native'
import React,  { useEffect, useState } from "react";
import { Avatar, Card } from '@rneui/base'
import { db } from '../firebase';
export default function Transactions(props)  {
  const userD = props.userD;
  const ownerId=userD.email
    const [data,setData]=useState();
    useEffect(() => {
      const fetchData = async () => {
        // Fetch booking data for both "booked" and "accepted" statuses
        const bookedSnapshot = await db.collection("booking").where("ownerId", "==", ownerId).where("status", "==", "booked").get();
        const acceptedSnapshot = await db.collection("booking").where("ownerId", "==", ownerId).where("status", "==", "accepted").get();
  
        const bookingDataArray = [];
        const promises = [];
  
        // Process "booked" bookings
        bookedSnapshot.forEach((bookingDoc) => {
          const bookingData = bookingDoc.data();
          const studentDetails = bookingData.studentId;
          bookingDataArray.push({ ...bookingData, bookId: bookingDoc.id });
  
          const studentRef = db.collection("users").where("email", "==", studentDetails);
  
          promises.push(
            Promise.all([
              studentRef.get(),
              Promise.resolve({ ...bookingData, bookId: bookingDoc.id }),
            ]).then(([studentSnapshot, bookingData]) => {
              const studentData = studentSnapshot.docs[0].data();
              bookingData.student = studentData;
              return bookingData;
            })
          );
        });
  
        // Process "accepted" bookings
        acceptedSnapshot.forEach((bookingDoc) => {
          const bookingData = bookingDoc.data();
          const studentDetails = bookingData.studentId;
          bookingDataArray.push({ ...bookingData, bookId: bookingDoc.id });
  
          const studentRef = db.collection("users").where("email", "==", studentDetails);
  
          promises.push(
            Promise.all([
              studentRef.get(),
              Promise.resolve({ ...bookingData, bookId: bookingDoc.id }),
            ]).then(([studentSnapshot, bookingData]) => {
              const studentData = studentSnapshot.docs[0].data();
              bookingData.student = studentData;
              return bookingData;
            })
          );
        });
  
        Promise.all(promises)
          .then((bookingDataArray) => {
            setData(bookingDataArray);
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      };
  
      fetchData();
    }, []);

    return (
      <View>
      <ScrollView >
        {data && data.map((item, index) => (
      <Card key={index} containerStyle={{borderRadius:20}}>
        <View  style={{ flexDirection: "row",alignItems:'center',justifyContent:'space-between' }}>
        <Avatar source={require('./assets/profile.jpg')}></Avatar>
        <View  style={{ flexDirection: 'column'}}>
        <Text>{item.student.name}</Text>
        <Text style={{fontWeight:'200'}}>{item.houseName}</Text>
        </View>
        <Text>₹{item.price}</Text>
        {item.status === "booked" ? (
        <Text>Paid</Text>
        ) : ( <Text>Pending</Text>
        )}
        </View>
        </Card>
        ))}
        </ScrollView>
      </View>
    )
  }
