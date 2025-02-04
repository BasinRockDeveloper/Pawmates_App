import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/images';
import Headertext from '../../Components/HeaderText';
import CustomText from '../../Components/Text';
import CustomButton from '../../Components/Button';
import BackButton from '../../Components/BackButton';
import {COLORS} from '../../Constants/theme';

const WhichAnimal = ({navigation, route}) => {
  const {categName, animalName, nickName, gender, age, breed} = route.params;
  const [service, setServices] = useState('boarding');


  const Data = [
    {
      id: 1,
      image: images.BOARDING,
      title: 'BOARDING',
      service: 'boarding',
    },
    {
      id: 2,
      image: images.HOUSESITTING,
      title: 'HOUSE SITTING',
      service: 'house sitting',
    },
    {
      id: 3,
      image: images.DROPINVISIT,
      title: 'DROP IN VISIT',
      service: 'drop in visit',
    },
    {
      id: 4,
      image: images.PETDAYCARE,
      title: 'PET DAY CARE',
      service: 'pet day care',
    },
    {
      id: 5,
      image: images.PETWALKING,
      title: 'PET WALKING',
      service: 'pet walking',
    },
  ];

  return (
    <FastImage source={images.BackGround} style={{flex: 1}}>
      <BackButton onPressBack={() => navigation.goBack()} />
      <Headertext />
      <View style={styles.container}>
        <Text style={styles.header}>For When You're Away</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          numColumns={2}
          data={Data}
          renderItem={({item}) => {
            return (
              <View style={styles.flatlist_container}>
                <TouchableOpacity
                  onPress={() => setServices(item.service)}
                  style={[
                    styles.Data_View,
                    service === item.service ? styles.selected : null,
                  ]}>
                  <Image source={item.image} />
                  <CustomText
                    text={item.title}
                    style={{marginHorizontal: 6, fontSize: 13}}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />

        <View style={{height: 30}} />
      </View>
      <View style={{height: '12%'}} />

      <View style={{alignItems: 'flex-end'}}>
        <CustomButton
          buttonText={'Continue'}
          style={{borderRadius: 25}}
          onPress={() => navigation.navigate('Boarding', {categName, animalName, nickName, gender, age, breed, service})}
        />
      </View>
    </FastImage>
  );
};

export default WhichAnimal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.text_white,
    width: '98%',
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  header: {
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 20,
    fontWeight: '600',
  },
  domestic: {
    borderColor: '#1EBA1E',
  },
  flatlist_container: {
    flex: 1,
  },
  Data_View: {
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor: 'rgba(112, 112, 112,100)',
    width: '90%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  selected: {borderColor: COLORS.primary, borderWidth: 3},
});
