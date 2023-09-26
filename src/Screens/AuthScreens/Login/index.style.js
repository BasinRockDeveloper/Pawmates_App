import {StyleSheet} from 'react-native';
import { COLORS } from '../../../Constants/theme';

export const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  container: {
    marginHorizontal: 30,
  },
  screen_title:{
    marginTop:30,
    fontSize:25,
    fontWeight:'bold'
  },
  createBtn:{
    borderWidth:1,
    height:50,
    borderColor: 'white',
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },
  devider_View:{
    height:2,
    backgroundColor:'#D4D4D4',
    marginTop:30,
    borderRadius:10
  },
  container_create: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor:COLORS.black,
    borderRadius:10,
    marginTop:10,
    alignContent:'center',
    flexDirection:'row'
  },
  txt:{
    color:COLORS.text_white
  },
  errors: {
    fontSize: 11,
    fontWeight: "bold",
    color: "red",
    marginTop: 5,
  },
  checkView: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText:{
    fontSize:11,
   
  },
});
