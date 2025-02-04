import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {COLORS} from '../../Constants/theme';
import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import InputField from '../../Components/InputField';
import ChatHeader from '../../Components/ChatHeader';
import Modal from 'react-native-modal';
import {createThumbnail} from 'react-native-create-thumbnail';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import socketServices from '../../socket/socketService';

const ChatScreen = ({navigation, route}) => {
  const [messageText, setMessageText] = useState('');
  const [pickedImage, setPickedImage] = useState('');
  const [pickedVideo, setPickedVideo] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatExists, setChatExists] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('');
  const [readByIds, setReadByIds] = useState([]);
  const [typing, setTyping] = useState(false);
  const [messageSendingLoading, setMessageSendingLoading] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [deletedFor, setDeletedFor] = useState({});
  const [blockedBy, setBlockedBy] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);


  const {user} = useSelector(state => state.authData);
  const otherUserId = route.params?.otherUserId;
  const {
    userData,
  } = route.params;
  console.log(")))))))))))))))))----->>>    ", otherUserId, user.id, userData )

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    socketServices.on('receiveMessage', (data)=>{
      console.log("data from socket :", data)
    })
  }, [messages]);

  useEffect(() => {
    const sub = navigation.addListener('focus',()=>{

      openChat()
    })
    return sub

  }, [navigation]);

  const openChat = () => {
    // console.log("userData,:", user)
    socketServices.emit('openChat', {username : user.name, recieversName: userData.user_name})
    
  }

  const onSend = async () => {
    socketServices.emit('sendMessage', {sender: user.name, receiver : userData.user_name , message : messageText})

    const data = [
      {sender: user.name, receiver : userData.user_name , message : messageText }
  ]

  setMessages(data)
  };

  const renderMessages = ({item, index}) => {
      if(item.messageTime >= deletedFor[user.id]){
        return (
          <View key={index} style={styles.messageContainer}>
            <View style={[
              styles.message,
              item.senderId === user.id ? styles.messageByMe : styles.messageByOther
            ]}>
              {item.imageUrl ? (
                <FastImage
                  source={{uri: item.imageUrl}}
                  style={styles.messageImage}
                />
              ) : null}
      
              {item.videoUrl ? (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('VideoPlayer', {url: item.videoUrl})}
                  style={styles.videoContainer}
                >
                  <FastImage
                    source={{uri: item.thumbnailUrl}}
                    style={styles.messageImage}
                  />
                  <Entypo 
                    name="controller-play"
                    color="black" 
                    size={55} 
                    style={styles.playButton} 
                  /> 
                </TouchableOpacity>
              ) : null}
              
              <Text style={styles.messageText}>{item.messageText}</Text>
              <Text style={styles.time}>
                {new Date(item.messageTime).toLocaleString()}
              </Text>
            </View>
      
            {item.senderId === user.id && 
              index === 0 &&
              readByIds.includes(otherUserId) && (
                <Text style={styles.seenMessage}>seen</Text>
              )
            }
      
            {item.senderId === user.id && 
              index === 0 &&
              !readByIds.includes(otherUserId) && (
                <Text style={styles.seenMessage}>sent</Text>
              )
            }
          </View>
        );
      }
  };



  
  const uploadFile = async (path) => {

  };

  const pickVideo = () => {
    setPickedImage('');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'video',
    }).then(video => {
      setModalVisible(false);
      setPickedVideo(video);
      createThumbnail({
        url: video.path,
        timeStamp: 10000,
      })
        .then(response => setThumbnail(response))
        .catch(err => console.log({err}));
    });
  };
  const pickImage = () => {
    setPickedVideo('');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'photo',
      cropping: true,
    }).then(image => {
      setModalVisible(false);
      setPickedImage(image);
    });
  };

  
  const onBlockPress = () => {

  }
  const onUnblockPress = () => {

  }
  
  const onDeletePress = () => {

  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? "padding" : null} enabled >
      <View style={styles.chatHeaderContainer}>
        <ChatHeader
          blocked={blockedBy?.includes(user.id) ? true : false}
          onUnblockPress={onUnblockPress}
          onBlockPress={onBlockPress}
          onDeletePress={onDeletePress}
          onBackPress={() => navigation.goBack()}
          userData={userData}
        />
      </View>
      <View style={styles.messagesContainer}>
        <FlatList data={messages} renderItem={renderMessages} inverted={true} contentContainerStyle={{paddingBottom: 50}} />
        {typing === otherUserId ? (
          <View style={styles.lottieCont}>
            <AnimatedLottieView
              source={require('../../Assets/lottie/typing-lottie.json')}
              autoPlay
              loop
              style={{width: 100, height: 100}}
            />
          </View>
        ) : null}
      </View>
      {
        blockedBy?.includes(user.id) ? <Text style={styles.blockText}>You have blocked this user</Text> : blockedBy.includes(otherUserId) ? <Text style={styles.blockText}>You have been blocked</Text> : (
          <View style={[styles.messageInputContainer, isKeyboardVisible ? {marginBottom: 70} : null]}>
            <View style={{width: '70%', borderRadius: 50}}>
              {pickedImage.path ? (
                <View style={{justifyContent:'center', alignItems: 'center'}}>
                  <View style={styles.crossIcon}>
                    <Entypo
                      onPress={() => setPickedImage('')}
                      name="circle-with-cross"
                      color={'black'}
                      size={25}
                      // style={styles.crossIcon}
                    />
                  </View>
                  <FastImage
                    source={{uri: pickedImage.path}}
                    style={styles.image}
                  />
                </View>
              ) : null}
              {pickedVideo.path ? (
                <TouchableOpacity onPress={() => navigation.navigate('VideoPlayer', {url: pickedVideo.path})} style={{justifyContent:'center', alignItems: 'center'}}>
                  <Entypo
                    onPress={() => [setPickedVideo(''), setThumbnail('')]}
                    name="circle-with-cross"
                    color={'black'}
                    size={25}
                    style={styles.crossIcon}
                  />
                  <FastImage
                    source={{uri: thumbnail.path}}
                    style={styles.image}
                  />
                  <Entypo name='controller-play' color='black' size={55} style={{position: 'absolute'}} /> 
                </TouchableOpacity>
              ) : null}
              <InputField
                placeholder={'Write your message'}
                value={messageText}
                onChangeText={changedText => setMessageText(changedText)}
                // placeholderColor="grey"
                // style={styles.messageInput}
                containerStyle={styles.messageInput}
              />
            </View>
    
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setModalVisible(true)}
              style={styles.attachmentBtn}>
              <Entypo name="attachment" size={25} color={'grey'} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={messageSendingLoading}
              activeOpacity={0.6}
              onPress={onSend}
              style={styles.sendBtn}>
                {messageSendingLoading ? <ActivityIndicator color={'black'} size={hp('3.5%')} /> : <Feather name="send" size={25} color={COLORS.primary} />}
            </TouchableOpacity>
          </View>
        )
      }
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Entypo
            onPress={() => setModalVisible(false)}
            name="circle-with-cross"
            color={'black'}
            size={25}
            style={styles.cross}
          />
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.option}>Upload a photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickVideo}>
            <Text style={styles.option}>Upload a video</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  cross: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  crossIcon: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 30,
    backgroundColor:'white',
    padding: 5,
    borderRadius: 30
  },
  option: {
    padding: 15,
    fontSize: hp('3%'),
    color: 'black',
  },
  image: {
      width: '90%',
      height: hp('40%'),
      backgroundColor: 'lightyellow',
      margin: 10,
      borderRadius: 30,
  },
  messageImage: {
      width: '90%',
      height: hp('40%'),
      backgroundColor: 'lightyellow',
      margin: 10,
      borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  headingText: {
    color: 'black',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginLeft: 15,
  },
  chatHeaderContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    zIndex: 30,
  },
  otherUserMessage: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginHorizontal: 25,
    marginTop: 60,
  },
  yourMessage: {
    backgroundColor: COLORS.secondary_with_opacity,
    padding: 15,
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginHorizontal: 25,
    marginTop: 10,
  },
  messagesContainer: {
    width: '100%',
    paddingTop: hp('7%'),
    flex: 1,
  },
  messageInputContainer: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'lightgrey',
    marginBottom: 6,
  },
  messageInput: {
    width: '100%',
    borderRadius: 30,
    color: 'black',
    marginTop: 0
  },
  attachmentBtn: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    alignSelf: 'flex-end',
  },
  sendBtn: {
    padding: 15,
    backgroundColor: 'lightgrey',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignSelf: 'flex-end',
  },
  messageByOther: {
    width: wp('70%'),
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignSelf: 'flex-start',
    margin: 10,
  },
  messageByMe: {
    width: wp('70%'),
    backgroundColor: COLORS.primary_with_opacity,
    alignSelf: 'flex-end',
    borderRadius: 15,
    margin: 10,
    borderRadius: 10
  },
  messageText: {
    fontSize: hp('2.2%'),
    color: 'black',
    padding: 15,
  },
  time: {
    color: 'rgba(0,0,0,0.7)',
    marginLeft: 12,
    marginBottom: 3,
    fontSize: hp('1.7%'),
  },
  lottieCont: {
    width: '20%',
    height: hp('5%'),
    paddingLeft: wp('5%'),
    marginBottom: 30
  },
  seenMessage: {
    alignSelf:'flex-end',
    marginRight: 20,
    marginTop: -5,
    marginBottom: 10
  },
  blockText: {
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: hp('2.2%'),
    color: 'grey',
    marginVertical: 15
  }
});
