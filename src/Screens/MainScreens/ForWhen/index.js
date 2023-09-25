import { View, Text } from "react-native";
import React, { useState } from "react";
import FastImage from "react-native-fast-image";
import images from "../../../Constants/images";
import Headertext from "../../../Components/HeaderText";
import { styles } from "./index.style";
import InnerButton from "../../../Components/innerButton";
import { COLORS } from "../../../Constants/theme";

const ForWhen = ({ navigation }) => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonText) => {
    setSelectedButton(buttonText);
  };

  return (
    <FastImage source={images.BackGround} style={{ flex: 1 }}>
      <Headertext />
      <View style={styles.container}>
        <Text style={styles.header}>
          I'm looking for service {"\n"} for my:
        </Text>
        <InnerButton
          buttonText={"FARM ANIMALS"}
          style={{
            borderColor: selectedButton === "FARM ANIMALS" ? COLORS.primary : null,
          }}
          onPress={() => {
            handleButtonClick("FARM ANIMALS");
          }}
        />
        <InnerButton
          buttonText={"REPTILES"}
          style={{
            borderColor: selectedButton === "REPTILES" ? COLORS.primary  : null,
          }}
          onPress={() => {
            handleButtonClick("REPTILES");
          }}
        />
        <InnerButton
          buttonText={"BIRDS"}
          style={{
            borderColor: selectedButton === "BIRDS" ? COLORS.primary  : null,
          }}
          onPress={() => {
            handleButtonClick("BIRDS");
          }}
        />
        <InnerButton
          buttonText={"DOMESTICATED ANIMALS"}
          style={{
            borderColor:
              selectedButton === "DOMESTICATED ANIMALS" ? COLORS.primary  : null,
          }}
          onPress={() => {
            handleButtonClick("DOMESTICATED ANIMALS");
            navigation.navigate("Service");
          }}
        />
        <InnerButton
          buttonText={"EXOTIC ANIMALS"}
          style={{
            borderColor: selectedButton === "EXOTIC ANIMALS" ? COLORS.primary  : null,
          }}
          onPress={() => {
            handleButtonClick("EXOTIC ANIMALS");
          }}
        />
        <View style={{ height: 20 }} />
      </View>
    </FastImage>
  );
};

export default ForWhen;
