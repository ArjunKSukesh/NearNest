import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, Image, ToastAndroid, ScrollView } from 'react-native';
import { Avatar, Button, Card } from '@rneui/themed';
import { db } from '../firebase';

export default function Booking({ navigation, route }) {
  const { userD } = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingSnapshot = await db
          .collection('booking')
          .where('studentId', '==', userD.email)
          .where('status', '==', 'booked')
          .get();
  
        const bookingDataArray = [];
  
        for (const bookingDoc of bookingSnapshot.docs) {
          const bookingData = bookingDoc.data();
          const ownerDetails = bookingData.ownerId;
          const propertyDetails = bookingData.propertyId;
  
          let propertyData = {};
  
          if (propertyDetails) {
            const propertySnapshot = await db
              .collection('property')
              .where('OwnerId', '==', ownerDetails)
              .get();
  
            if (!propertySnapshot.empty) {
              propertyData = propertySnapshot.docs[0].data();
            }
          }
  
          if (ownerDetails) {
            const ownerSnapshot = await db
              .collection('users')
              .where('email', '==', ownerDetails)
              .get();
  
            const ownerData = ownerSnapshot.docs[0].data();
            bookingDataArray.push({ ...bookingData, bookId: bookingDoc.id, owner: ownerData, property: propertyData });
          }
        }
  
        setData(bookingDataArray);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };
  
    fetchData();
  }, [userD.email]);
  
  

  return (
    <View>
    <ScrollView>
      {data.length > 0 ? (
        data.map((item, index) => (
          <Card key={index} containerStyle={{ borderRadius: 10,height: 150, }}>
          <View style={{ flexDirection: "row" }}>
           
              <Image
                source={{ uri: item.property.Images[0] }}
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
           <View style={{ marginLeft: 10,}}>
              <Text style={{ fontSize: 18, marginRight: 10, fontWeight: '600',marginBottom:5 }}>
                {item.property.houseName}
              </Text>
           
            <Text>Owner Name: {item.owner.name}</Text>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
                <Avatar source={require("./assets/phone.png")} size={20}/>
                <Text>  {item.property.phone}</Text>
            </View>
            <Button
              title="Make Payment"
              containerStyle={{ borderRadius: 10, width: 150, alignSelf: 'center', }}
              titleStyle={{ fontSize: 15, fontWeight: '600' }}
              onPress={() => navigation.navigate('Payment', { item })}
            />
            </View>
             </View>
          </Card>
        ))
      ) : (<Card>
        <Text>No bookings found.</Text>
        </Card>
      )}
      </ScrollView>
    </View>
  );
}
