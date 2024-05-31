import { View, Text } from 'react-native'
import React,{useEffect} from 'react'
import Lottie from 'lottie-react-native';

const AppLoader = () => {
    useEffect(() => {
        Animated.timing(animationProgress.current, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: false
        }).start();
      }, [])
  return (
    <View>
      <Lottie
      source={require('./assets/loader.json')}
      progress={animationProgress.current}
    />
    </View>
  )
}

export default AppLoader