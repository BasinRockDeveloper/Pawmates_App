import { StyleSheet } from "react-native";
import { COLORS } from "../../../Constants/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.text_white,
    width: "98%",
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  header: {
    alignSelf: "center",
    fontSize: 20,
    marginTop: 40,
    fontWeight: "600",
  },
  domestic: {
    borderColor: "#707070",
  },
  flatlist_container: {
    flex: 1,
    alignItems:'center'
  },
  Data_View: {
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor: "rgba(112, 112, 112,100)",
    width: "80%",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop:20
  },
});
