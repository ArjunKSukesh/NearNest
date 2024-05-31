import { View, Text, Linking,Alert,ToastAndroid} from 'react-native'
import React, { useEffect, useState } from 'react'
import {Card ,CheckBox,Button ,} from '@rneui/themed';
import {db} from '../firebase'
import RazorpayCheckout from 'react-native-razorpay';





const Payment = ({ navigation,route }) => {
  const { item } = route.params;
  const[data,setData]=useState('');

  useEffect(() => {
    var docRef = db.collection('property').doc(item.propertyId);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          // console.log('Document data:', doc.data());
          setData(doc.data());
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
  }, []);
  
  const bookProperty = async () => {
    const updateRef = db.collection('property').doc(item.propertyId);
  
    try {
      await updateRef.update({ status: 'booked' });
      ToastAndroid.show('Payment is successful', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  
    const bookingRef = db.collection('booking').doc(item.bookId);
    try {
      await bookingRef.update({ status: 'booked' });
      console.log('Booking status updated to accepted');
      ToastAndroid.show('Booking status updated to booked', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error updating booking status: ', error);
    }
  
    alert(`Success: ${data.razorpay_payment_id}`);
  };
  
  const reduceBedroomsAndBook = async () => {
    const updatedBedrooms = data.bedroom - 1;
  
    if (updatedBedrooms === 0) {
      const updateRef = db.collection('property').doc(item.propertyId);
      try {
        await updateRef.update({ status: 'booked' });
        ToastAndroid.show('Payment is successful', ToastAndroid.SHORT);
      } catch (error) {
        console.error('Error updating status: ', error);
      }
    } else {
      const updateRef = db.collection('property').doc(item.propertyId);
      try {
        await updateRef.update({ bedroom: updatedBedrooms });
        ToastAndroid.show('Payment is successful', ToastAndroid.SHORT);
      } catch (error) {
        console.error('Error updating bedrooms: ', error);
      }
    }
  
    const bookingRef = db.collection('booking').doc(item.bookId);
    try {
      await bookingRef.update({ status: 'booked' });
      console.log('Booking status updated to accepted');
      ToastAndroid.show('Booking status updated to booked', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error updating booking status: ', error);
    }
  
    alert('Payment Successfull');
  };
  
  const handlePayment = () => {
    var options = {
      description: 'Pay rent',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_khUmCYzgRhD0o3', // Your api key
      amount: item.price * 100,
      name: item.owner.name,
      prefill: {
        email: 'contact@rentaroom.com',
        contact: '9191919191',
        name: 'RentAroom',
      },
    };
  
    if (item.type === 'House') {
      bookProperty();
    } else {
      RazorpayCheckout.open(options)
        .then((data) => {
          reduceBedroomsAndBook()
    })}}
  return (

    <View containerStyle={{flex:1}}>

   
      <View>
      <Text style={{marginBottom:20,fontSize:30,fontWeight:'600',marginTop:20,marginLeft:20}}>Payment</Text>
      <Card containerStyle={{borderRadius:20,marginBottom:20}}>
      <View style={{alignItems:'center'}}>
        <Text style={{fontSize:30,fontWeight:'600',marginTop:50}}> {item.owner.name}</Text>
        <Text style={{fontWeight:'300',fontSize:12,marginBottom:50}}>    {item.owner.phone}</Text>
        <View style={{backgroundColor:'#ebeff2',borderRadius:40,alignItems:'center',padding:10,marginBottom:50}}>
        <Text style={{fontSize:30,fontWeight:'bold',color:'#2a44ae'}}>₹ {item.price}</Text>

        </View>
        <Text style={{marginBottom:50}}>{item.houseName}</Text>
        </View>
        <View style={{flexDirection:'row',marginBottom:10}}>
        <Card>
          <Text>Bank</Text>
          <Text>Transfer</Text>
        </Card>
        <Card>
          <Text> Credit </Text>
          <Text> Card</Text>
        </Card>
        <Card>
          <Text>   ...   </Text>
          <Text></Text>
        </Card>
        </View>
      </Card>

      </View>
         <Button 
         buttonStyle={{height:50,width:'90%',marginTop:20,marginLeft:10,borderRadius:10,alignSelf:'center'}}
         onPress={handlePayment}>
      <Text style={{color:'#ffffff'}}>Pay Now</Text>
      </Button>
    </View>
  )
}
export default Payment;