import { Card } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import Transactions from "./Transactions";
import Pending from "./Pending";
import Paid from './Paid';
import { db } from '../firebase';

export default function Dues({ navigation, route }) {
  const { userD } = route.params;
  const ownerId = userD.email;
  const [selectedItem, setSelectedItem] = useState('Transactions');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookingSnapshot = await db
        .collection("booking")
        .where("ownerId", "==", ownerId)
        .get();

      let total = 0;

      bookingSnapshot.forEach((bookingDoc) => {
        const bookingData = bookingDoc.data();
        total += bookingData.price;
      });

      setTotalPrice(total);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  return (
    <View>
    <ScrollView>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={{
            width: 200,
            height: 200,
            borderRadius: 200 / 2,
            backgroundColor: "#aedbeb",
            borderWidth: 0.5,
          }}
        >
          <Text style={{ textAlign: 'center', padding: 10, marginTop: 50, fontSize: 30, fontWeight: '200' }}>Total</Text>
          <Text style={{ textAlign: 'center', fontSize: 30, fontWeight: '200' }}>₹{totalPrice}</Text>
        </TouchableOpacity>
      </View>

      <Card>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              backgroundColor: selectedItem === 'Transactions' ? "#d1f1ff" : "#aedbeb",
              justifyContent: "center",
              marginRight: 15,
            }}
            onPress={() => handleItemClick('Transactions')}
          >
            <Image style={{ width: 40, height: 40, marginLeft: 5 }} source={require("./assets/transaction.png")} />
            <Text style={{ textAlign: "center" }}>Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              backgroundColor: selectedItem === 'Paid' ? "#d1f1ff" : "#aedbeb",
              justifyContent: "center",
              marginRight: 15,
            }}
            onPress={() => handleItemClick('Paid')}
          >
            <Image style={{ width: 40, height: 40, marginLeft: 5 }} source={require("./assets/paid.png")} />
            <Text style={{ textAlign: "center" }}>Paid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              backgroundColor: selectedItem === 'Pending' ? "#d1f1ff" : "#aedbeb",
              justifyContent: "center",
              marginRight: 15,
            }}
            onPress={() => handleItemClick('Pending')}
          >
            <Image style={{ width: 40, height: 40, marginLeft: 5 }} source={require("./assets/pending.png")} />
            <Text style={{ textAlign: "center" }}>Pending</Text>
          </TouchableOpacity>
        </View>
      </Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10, marginTop: 20 }}>
        <Text style={{ fontSize: 20 }}>{selectedItem}</Text>
        <Text style={{ fontSize: 15 }}>see all</Text>
      </View>
      
        {/* Render the appropriate component based on the selected item */}
        {selectedItem === 'Transactions' && <Transactions userD={userD} />}
        
        {selectedItem === 'Pending' && <Pending userD={userD} />}
        
        {selectedItem === 'Paid' && <Paid userD={userD} />}
      </ScrollView>
    </View>
  );
}
