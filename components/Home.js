import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card } from "react-native-elements";
import LatestHomeCards from "./LatestHomeCards";
import BoysHomeCards from "./BoysHomeCards";
import GirlsHomeCards from "./GirlsHomeCards";
// import {use} from '@react-navigation/native-stack'
import { useNavigation } from "@react-navigation/native";

export default function Home(props) {
  const navigation = useNavigation();
  const userD = props.userD;
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            fontFamily: "serif",
            marginTop: 20,
            marginLeft: 10,
          }}
        >
          Find the best place
        </Text>

        <View
          style={{
            justifyContent: "space-around",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("HostelPage", { userD: userD });
            }}
          >
            <Card
              containerStyle={{ borderWidth: 0, shadowColor: "white" }}
              wrapperStyle={{ borderWidth: 0 }}
            >
            
                <Card.Image
                  source={require("./assets/hostel.jpeg")}
                  style={{ width: 100, height: 100, borderRadius: 15 }}
                />
                <Text style={{ textAlign: "center" }}>Hostel</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
              navigation.navigate("HousePage", { userD: userD });
            }}
          >
            <Card containerStyle={{ borderWidth: 0, shadowColor: "white" }}>
              <Card.Image
                source={require("./assets/house1.jpg")}
                style={{ width: 100, height: 100, borderRadius: 15 }}
              />
              <Text style={{ textAlign: "center" }}>House</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
              navigation.navigate("RoomPage", { userD: userD });
            }}>
            <Card containerStyle={{ borderWidth: 0, shadowColor: "white" }}>
              <Card.Image
                source={require("./assets/rooms.jpeg")}
                style={{ width: 100, height: 100, borderRadius: 15 }}
              />
              <Text style={{ textAlign: "center" }}>Room</Text>
            </Card>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{ fontSize: 30, fontFamily: "serif", padding: 20 }}>
            Latest
          </Text>
          <View
            style={{
              justifyContent: "space-around",
              flexDirection: "row",
              backgroundColor: "white",
            }}
          >
            <ScrollView horizontal={true} style={styles.scrollView}>
              <LatestHomeCards userD={userD} />
            </ScrollView>
          </View>
        </View>
        <View>
          <Text style={{ fontSize: 30, fontFamily: "serif", padding: 10 }}>
            {" "}
            For Boys
          </Text>
          <ScrollView horizontal={true} style={styles.scrollView}>
            <BoysHomeCards userD={userD} />
          </ScrollView>
        </View>

        <View>
          <Text style={{ fontSize: 30, fontFamily: "serif", padding: 10 }}>
            {" "}
            For Girls
          </Text>
          <ScrollView horizontal={true} style={styles.scrollView}>
            <GirlsHomeCards userD={userD} />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    horizontal: "true",
    alignContent: "space-around",
  },
  text: {
    fontSize: 42,
  },
});
