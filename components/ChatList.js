  import React, { useState, useEffect } from 'react';
  import { View, TouchableOpacity, FlatList ,Text} from 'react-native';
  import { Card, Avatar } from '@rneui/themed';
  import { useNavigation } from '@react-navigation/native';
  import { db } from '../firebase';
  import _ from 'lodash';

  const ChatList = ({ route }) => {
    const {userD} = route.params;
    const [data, setData] = useState([]);
    const navigation = useNavigation(); // Get the navigation object

    useEffect(() => {
      const fetchData = async () => {
        try {
          const querySnapshot = await db
            .collection('chats')
            .where('ownerId', '==', userD.email)
            .get();
    
          const dataArray = [];
    
          for (const doc of querySnapshot.docs) {
            const chatData = doc.data();
            const studentId = chatData.studentId;
            
            const userSnapshot = await db
              .collection('users')
              .where('email', '==', studentId)
              .get();
    
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
    
              dataArray.push({
                id: doc.id,
                ...chatData,
                student: userData,
              });
            }
          }
    
          setData(dataArray);
        } catch (error) {
          console.log('Error getting chat documents:', error);
        }
      };
    
      fetchData();
    }, []);
  
    
return (
  <View>
    <FlatList
      data={_.uniqBy(data, 'student.name')} // Use lodash uniqBy to filter unique names
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('OwnerChat', { item ,userD})}>
          <Card key={item.id} bottomDivider containerStyle={{width:'100%',marginLeft:10,marginBottom:-5,borderRadius:10}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
              <TouchableOpacity onPress={() => navigation.navigate('StudentDetails', { userD: item, item })}>
                <Avatar rounded source={{ uri: item.student.imageURL }} />
              </TouchableOpacity>
              <Text style={{ flex: 1, marginLeft: 30, fontSize: 18 }}>{item.student.name}</Text>
              <Avatar source={require('./assets/forward.png')} containerStyle={{ marginRight: 10 }} />
            </View>
            <Text style={{ marginLeft: 65, fontSize: 15, fontWeight: '300' }}>{item.houseName}</Text>
          </Card>
        </TouchableOpacity>
      )}
    />
  </View>
);
  };

  export default ChatList;
