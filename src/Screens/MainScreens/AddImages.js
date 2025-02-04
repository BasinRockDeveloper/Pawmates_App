import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/images';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../Constants/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import BackButton from '../../Components/BackButton';
import BasUrl from '../../BasUrl';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LoaderModal from '../../Components/LoaderModal';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { updatePetAddStatus } from '../../Redux/authSlice';

const AddImages = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.authData)
  const {
    categName,
    animalName,
    nickName,
    gender,
    age,
    breed,
    address,
    petSize,
    about
  } = route.params;
  const [pickedImages, setPickedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'photo',
      multiple: true,
      cropping: true,
    })
      .then(image => {
        setPickedImages([...pickedImages, ...image]);
      })
      .catch(err => {
        console.log('Some error message occurred with picking images');
      });
  };

  const onRemovePress = path => {
    const filteredImages = pickedImages.filter(eachImg => {
      return eachImg.path !== path;
    });
    setPickedImages(filteredImages);
  };

  const showToast = (type,msg) =>{
    Toast.show({
        type: type,
        text1: msg,
    })
  }

  
  const sendAddPetRequest = () => {
    let data = new FormData();

    data.append('gender', gender);
    data.append('pet_nickname', nickName);
    data.append('breed', breed);
    data.append('age', age);
    data.append('cat_name', categName);
    pickedImages.length > 0 ? data.append('images', {
        name: 'image',
        type: pickedImages[0].mime,
        uri: pickedImages[0].path
      }) : null
    pickedImages.length > 1 ? data.append('images', {
        name: 'image',
        type: pickedImages[1].mime,
        uri: pickedImages[1].path
      }) : null
    pickedImages.length > 2 ? data.append('images', {
        name: 'image',
        type: pickedImages[2].mime,
        uri: pickedImages[2].path
      }) : null
    data.append('pet_type', animalName);
    data.append('pet_address', `${address}`);
    // data.append('pet_drop_off', startDate);
    // data.append('pet_pick_up', endDate);
    data.append('pet_size', petSize);
    // data.append('pet_purpose_type', service);
    data.append('pet_descp', about);

    let config = {
      method: 'post',
      url: `${BasUrl}/pet/add-pet`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      data: data,
    };

    setLoading(true)
    axios
      .request(config)
      .then(response => {
        setLoading(false)
        if(response.data.success){
            navigation.navigate('Home')
            showToast('success', "Pet added successfully 😃")
            dispatch(updatePetAddStatus(1))
        }else {
            showToast('error', response.data.message)
        }
      })
      .catch(error => {
        console.log("@#@#@#@#@#@#@#--->>    ", error)
        setLoading(false)
        showToast('error', error.message)
      });
  };

  if(loading){
    return <LoaderModal />
  }

  return (
    <FastImage
      source={images.BackGround}
      style={{flex: 1, justifyContent: 'center', padding: 20}}>
      <BackButton
        onPressBack={() => navigation.goBack()}
        style={{position: 'absolute', top: 10, left: 6}}
      />
      <Text style={[styles.HeadingText, {fontWeight: 'bold'}]}>
        Your pet images
      </Text>
      <Text style={{color: COLORS.black, width: wp('70%')}}>
        You can add upto 3 images
      </Text>

      <View style={{flexDirection: 'row'}}>
        {pickedImages.map((eachImg, index) => {
          return (
            <View key={index} style={styles.imageStyling}>
              <Image
                source={{uri: eachImg.path}}
                style={{width: '100%', height: '100%', borderRadius: 10}}
              />
              <TouchableOpacity
                style={styles.crossIcon}
                onPress={() => onRemovePress(eachImg.path)}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                  x
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
        {pickedImages.length < 3 ? (
          <TouchableOpacity
            onPress={() => pickImage()}
            style={styles.placeholderCont}>
            <FontAwesome name={'photo'} size={30} color={'gray'} />
            <View style={styles.plusIcon}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                +
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={sendAddPetRequest}
        style={{
          height: 60,
          width: wp('90%'),
          alignSelf: 'center',
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 200,
          marginTop: 70,
        }}>
        <Text style={{color: COLORS.text_white}}>Continue</Text>
      </TouchableOpacity>
    </FastImage>
  );
};

export default AddImages;

const styles = StyleSheet.create({
  HeadingText: {
    color: COLORS.black,
    fontSize: 30,
  },
  container: {
    backgroundColor: COLORS.text_white,
    width: '96%',
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  header: {
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 10,
    fontWeight: '600',
    color: COLORS.black,
  },
  domestic: {
    borderColor: '#1EBA1E',
  },
  txtInput: {
    height: 50,
    width: wp('90%'),
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.text_placeholder,
    borderRadius: 5,
    marginTop: 5,
  },
  plusIcon: {
    height: 30,
    width: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 200,
    position: 'absolute',
    zIndex: 10,
    bottom: -10,
    right: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossIcon: {
    height: 30,
    width: 30,
    backgroundColor: COLORS.secondary_with_opacity,
    borderRadius: 200,
    position: 'absolute',
    zIndex: 10,
    top: -10,
    right: -10,
    alignItems: 'center',
  },
  imageStyling: {
    height: hp('20%'),
    width: wp('28%'),
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginRight: 10,
  },
  placeholderCont: {
    height: hp('20%'),
    width: wp('28%'),
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
});
