import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GiftedChat, Avatar } from 'react-native-gifted-chat';
import { db } from '../firebase';

const OwnerChat = ({ navigation, route }) => {
  const { item, userD } = route.params;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .orderBy('time', 'desc')
      .onSnapshot((snapshot) => {
        const chatsData = snapshot.docs.map((doc) => doc.data());
        setChats(chatsData);
      });

    return () => {
      unsubscribe();
    };
  }, []);

 
    const onSend = async (messages) => {
      try {
        const newMessage = messages[0];
        const chatMessage = {
          _id: newMessage._id,
          time: new Date().getTime(),
          text: newMessage.text,
          studentId: userD.email,
          ownerId: item.OwnerId,
          userType:userD.userType
        };

      await db.collection('chats').add(chatMessage);
      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = (props) => {
    const { currentMessage, user } = props;
    const isOwnerMessage = currentMessage.userType === 'house owner';
    const isStudentMessage = currentMessage.userType === 'students';

    return (
      <View style={{ alignSelf: isOwnerMessage ? 'flex-start' : 'flex-end' }}>
        <Text style={{ backgroundColor: isOwnerMessage ? '#ECECEC' : '#DCF8C6', padding: 10,borderRadius:10,margin:10 }}>
          {currentMessage.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.ownerContainer}>
        <Text style={styles.ownerText}>{item.OwnerId}</Text>
        <Text style={{ fontWeight: '200' }}>{item.houseName}</Text>
      </View>
      <GiftedChat
        messages={chats}
        onSend={messages => onSend(messages)}
        user={{
          _id: userD.email,
          avatar: userD.userType === 'house owner' ? userD.imageURL : null,
          renderAvatar: () => {
            if (userD.userType === 'house owner') {
              return <Avatar source={{ uri: userD.imageURL }} />;
            }
            return null;
          },
        }}
        renderMessage={renderMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ownerContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    height: 70,
  },
  ownerText: {
    fontWeight: 'bold',
    fontSize: 16,
    padding:10
  },
  time: {
    fontSize: 12,
    color: '#777777',
  },
});

export default OwnerChat;
