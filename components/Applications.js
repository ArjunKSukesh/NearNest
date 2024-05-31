import { Text,View,ScrollView} from 'react-native';
import { Avatar,Button,Card } from '@rneui/themed';
import { useEffect ,useState} from 'react';
import {  db } from "../firebase";
import { ToastAndroid } from 'react-native';


export default function Applications({navigation,route}){
  const {userD }=route.params;
  const ownerId=userD.email
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false); 
  useEffect(() => {
  const fetchData = async () => {
    const bookingSnapshot = await db.collection("booking").where("ownerId", "==", ownerId).where("status","==","pending").get();
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
      setIsLoading(false);
    }).catch((error) => {
      console.log("Error getting documents: ", error);
      setIsLoading(false);
    });
    
  };

  fetchData();
}, [isUpdated]); 
const [status, setStatus] = useState('');




const handleAccept = async (bookId) => {
  const bookingRef = db.collection('booking').doc(bookId);
  try {
    await bookingRef.update({ status: 'accepted' });
    console.log('Booking status updated to accepted');
    ToastAndroid.show('Booking status updated to accepted', ToastAndroid.SHORT);
  } catch (error) {
    console.error('Error updating booking status: ', error);
  }
  setIsUpdated(true);
};

const handleDecline = async (bookId) => {
  const bookingRef = db.collection('booking').doc(bookId);
  try {
    await bookingRef.update({ status: 'declined' });
    console.log('Booking status updated to declined');
    ToastAndroid.show('Booking status updated to declined', ToastAndroid.SHORT);

  } catch (error) {
    console.error('Error updating booking status: ', error);
  }
  setIsUpdated(true);
};

return (
  <View style={{marginBottom:10}}>
  <ScrollView>
    {data && data.map((item, index) => (
      <Card key={index} containerStyle={{borderRadius:20}}>
        <View style={{ flexDirection: "row",alignItems:'center', justifyContent:'space-between' ,marginLeft:10,marginRight:10,marginBottom:10}}>
          <Avatar source={{ uri: userD.imageURL }}></Avatar>
          <Text style={{fontSize:15}}>{item.student.name} Interested in the property</Text>
        </View>
        <View style={{ flexDirection: "row",justifyContent:'space-between',alignItems:'center' ,marginBottom:10}}>
          <View style={{justifyContent:'space-evenly',marginLeft:10,marginRight:10}}>
            <Text style={{fontWeight:'200'}}>House Name</Text>
            <Text>{item.houseName}</Text>
          </View>
          <View >
            <Text style={{fontWeight:'500'}} onPress={()=>navigation.navigate("StudentDetails",{item})}>Show Details</Text>
          </View>
        </View>
        <Card.Divider />
        <View style={{ flexDirection: "row",justifyContent:'space-between',alignItems:'center' ,marginLeft:10,marginRight:10}}>
          <Button title="Decline" color="#000000" containerStyle={{width:150,borderRadius:10}} titleStyle={{fontSize:18}}  onPress={() => handleDecline(item.bookId)}></Button>
          <Button title="Accept" color="#52A9E3" containerStyle={{width:150,borderRadius:10}} titleStyle={{fontSize:18}} onPress={() => handleAccept(item.bookId)} ></Button>
        </View>
      </Card>
    ))}
    </ScrollView>
  </View>
);
}
