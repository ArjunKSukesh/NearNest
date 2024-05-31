import { View, Text,TextInput,StyleSheet ,ScrollView,TouchableOpacity,Image , ToastAndroid,} from 'react-native';
import {Slider,Icon } from "@rneui/themed";
import React, {useState,useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker'
import {db}from '../firebase'


const Edit = ({ navigation ,route}) => {


  const [isUpdated, setIsUpdated] = useState(false); 
  const {item }=route.params;
  // console.log(item.propertyId)
  const propertyId=item.propertyId
  const [houseName, setHouseName] = useState('');
  // const [location, setLocation] = useState('');
    const [type,setType] = useState();
    const [price, setPrice] = useState();
    const [gender,setGender]=useState()
    const [furniture,setFurniture]=useState()
    const [food,setFood]=useState();
    const [water,setWater] =useState();
    const [total, setTotal] = useState();
    const [bedroom,setBedroom]=useState();
    const [description, setDescription] = useState();
    const [phone, setPhone] = useState();
    const [picture,setPicture]=useState();
    const [status,setStatus]=useState();

const interpolate = (start, end) => {
  let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
  return Math.ceil((1 - k) * start + k * end) % 256;
};

    const color = () => {
    };

    const [value, setValue] = useState(0);
    const [vertValue, setVertValue] = useState(0);



   
    
            
            // Images:picture,
            useEffect(() => {
             
              const userRef = db.collection('property').doc(propertyId);
              userRef.get().then((doc) => {
                const data = doc.data();
                setHouseName(data.houseName);
                setType(data.type);
                if (data.price !== undefined) {
                  setPrice(data.price);
                }
                if (data.gender !== undefined) {
                  setGender(data.gender);
                }
                setFurniture(data.furniture);
                setFood(data.food);
                setWater(data.water);
                setTotal(data.total);
                setBedroom(data.bedroom);
                setDescription(data.description);
                setPhone(data.phone);
                setStatus(data.status);
              });
            }, [isUpdated]); ;
            
            const handleUpdate = async () => {
      
              const userRef = db.collection('property').doc(propertyId);
              await userRef.update({
                houseName: houseName,
                type: type,
                price: price,
                gender: gender,
                furniture: furniture,
                food: food,
                water: water,
                total: total,
                bedroom: bedroom,
                description: description,
                phone: phone,
              });
              console.log('User data updated successfully');
              ToastAndroid.show("Property Updated successfully", ToastAndroid.SHORT);
              setIsUpdated(true);
            };
    

   

  return (
    <View style={styles.container}>
    <ScrollView>
    <Text style={styles.subhead}>
        Property Type
      </Text> 
      <View style={styles.btnGroup}>
                <TouchableOpacity style={[styles.btn, type === 'Hostel' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setType('Hostel')}>
                    <Text style={[styles.btnText, type === 'Hostel' ? { color: "white" } : null]}>Hostel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, type === 'House' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setType('House')}>
                    <Text style={[styles.btnText, type === 'House' ? { color: "white" } : null]}>House</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, type === 'Room' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setType('Room')}>
                    <Text style={[styles.btnText, type === 'Room' ? { color: "white" } : null]}>Room</Text>
                </TouchableOpacity>
                
            </View>
    <Text style={styles.subhead}>House Name</Text>
            <TextInput placeholder="House Name:" style={styles.input} value={houseName} onChangeText={setHouseName}></TextInput>

            {/*  */}
            {/*  */}
            <Text style={styles.subhead}>
        Accomodation For
      </Text> 
      <View style={styles.btnGroup}>
                <TouchableOpacity style={[styles.btn, gender === 'Boys' ? { backgroundColor: "#4F9FA0" } : null]}  onPress={() => setGender('Boys')}>
                    <Text style={[styles.btnText, gender === 'Boys' ? { color: "white" } : null]}>Boys</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, gender === 'Girls' ? { backgroundColor: "#4F9FA0" } : null]}  onPress={() => setGender('Girls')}>
                    <Text style={[styles.btnText, gender === 'Girls' ? { color: "white" } : null]}>Girls</Text>
                </TouchableOpacity>
                
                
            </View>




             
            <Text style={styles.subhead}>Price: {price}</Text> 
             <View style={[styles.contentView]}>
            <Slider
        value={price}
        onValueChange={setPrice}
        maximumValue={20000}
        minimumValue={1000}
        step={1}
        allowTouchTrack
        trackStyle={{ height: 5, backgroundColor: 'transparent' }}
        thumbStyle={{ height: 20, width: 10, backgroundColor: 'transparent' }}
        thumbProps={{
          children: (
            <Icon
              name="circle"
              type="font-awesome"
              size={10}
              reverse
              containerStyle={{ bottom: 10, right: 10 }}
              color={color()}
            />
          ),
        }}
      />
      </View>
            
             {/*  */}
            <Text style={styles.subhead}>Contact Number</Text>

            <TextInput style={styles.input} value={phone} onChangeText={setPhone}/>
            {/*  */}
            <Text style={styles.subhead}>Total Accomodation</Text>

            <TextInput style={styles.input} value={total} onChangeText={setTotal}/>
               
            {/*  */}
            <Text style={styles.subhead}>
       Total Bedrooms
      </Text> 
      <View style={styles.btnGroup}>
                <TouchableOpacity style={[styles.btn, bedroom === 1 ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setBedroom(1)}>
                    <Text style={[styles.btnText, bedroom === 1 ? { color: "white" } : null]}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, bedroom === 2 ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setBedroom(2)}>
                    <Text style={[styles.btnText, bedroom === 2 ? { color: "white" } : null]}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, bedroom === 3 ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setBedroom(3)}>
                    <Text style={[styles.btnText, bedroom ===3 ? { color: "white" } : null]}>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, bedroom === 4 ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setBedroom(4)}>
                    <Text style={[styles.btnText, bedroom ===4 ? { color: "white" } : null]}>4</Text>
                </TouchableOpacity>
                
                
            </View>
            
          

            <Text style={styles.subhead}>
        Furniture
      </Text> 
      <View style={styles.btnGroup}>
                <TouchableOpacity style={[styles.btn, furniture === 'Fully-Furnished' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setFurniture('Fully-Furnished')}>
                    <Text style={[styles.btnText, furniture === 'Fully-Furnished' ? { color: "white" } : null]}>Fully-Furnished</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, furniture === 'Semi-Furnished' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setFurniture('Semi-Furnished')}>
                    <Text style={[styles.btnText, furniture === 'Semi-Furnished' ? { color: "white" } : null]}>Semi-Furnished</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, furniture === 'No-furnished' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setFurniture('No-furnished')}>
                    <Text style={[styles.btnText, furniture === 'No-furnished' ? { color: "white" } : null]}>No-furnished</Text>
                </TouchableOpacity>
                
                
            </View>
            


            <Text style={styles.subhead}>
        Food
      </Text>

            <View style={styles.btnGroup}>
                <TouchableOpacity style={[styles.btn, food === 'Yes' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setFood('Yes')}>
                    <Text style={[styles.btnText, food === 'Yes' ? { color: "white" } : null]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, food === 'No' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setFood('No')}>
                    <Text style={[styles.btnText, food === 'No' ? { color: "white" } : null]}>No</Text>
                </TouchableOpacity>
                </View>


                <Text style={styles.subhead}>
         Water
      </Text>

            <View style={styles.btnGroup}>
                <TouchableOpacity style={[styles.btn, status === 'Available' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setWater('Available')}>
                    <Text style={[styles.btnText, status === 'Yes' ? { color: "white" } : null]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, status === 'booked' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setStatus('booked')}>
                    <Text style={[styles.btnText, water === 'booked' ? { color: "white" } : null]}>No</Text>
                </TouchableOpacity>
                </View>
              

      

      

     
    <Text style={styles.subhead}>Description</Text>   
    <TextInput
    multiline={true}
    placeholder="Enter Description"
    numberOfLines={6}
    value={description}
    onChangeText={setDescription}
    style={{borderColor:'black',borderWidth:1,borderRadius:10,padding:10, width:'90%',
        height: 100,marginLeft:10}}
    
    />  
     <Text style={styles.subhead}></Text>

<View style={styles.btnGroup}>
                <TouchableOpacity style={[styles.btn, food === 'Yes' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setStatus('Available')}>
                    <Text style={[styles.btnText, food === 'Yes' ? { color: "white" } : null]}>Available</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, food === 'No' ? { backgroundColor: "#4F9FA0" } : null]} onPress={() => setStatus('No')}>
                    <Text style={[styles.btnText, food === 'No' ? { color: "white" } : null]}>Booked</Text>
                </TouchableOpacity>
                </View>


    <View style={{alignItems:'center',marginTop:20,marginBottom:20}}>
    <TouchableOpacity style={{backgroundColor:"#52A9E3",width:'90%',borderRadius:10}} onPress={handleUpdate}>
                    <Text style={{textAlign:'center',padding:10,fontSize:20,color:'white',fontWeight:'600'}}>Update Property</Text>
                </TouchableOpacity>
    </View>

</ScrollView>
    </View>
  )
}

export default Edit
const styles = StyleSheet.create({



    container:{
        flex:1,
        padding:10,
        backgroundColor:'#e5e5fe',
        alignItems:'center',
        marginLeft:20
        // justifyContent:'center'End
    },

    input: {
        width: '95%',
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginTop:20,
        marginLeft:10,
        marginBottom: 20,
        borderRadius: 10,
        
      },
      head: {
        fontSize:20,
        textAlign:'center',
        padding:10,
        marginLeft:10
        
      },subhead:{
        fontSize:20,
        fontWeight:'500'
        ,marginLeft:20,
        marginBottom:20,
        marginTop:20
      }
      , container: {
        flex: 1,
    },
    btnGroup: {
        flexDirection: 'row',
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: '#6B7280'
    },
    btn: {
        flex: 1,
        borderWidth:.25,
        borderColor: '#6B7280',
    },
    btnText: {
        textAlign: 'center',
        paddingVertical: 16,
        fontSize: 14
    },
    contentView: {
        padding: 20,
        width: '95%',
        justifyContent: 'center',
        alignItems: 'stretch',
      },
      ImageConatiner:{
            marginTop:20,
            marginBottom:20,
      },
      uploadButton: {
        backgroundColor:'#e5e5fe',
      }
    
    
  });





