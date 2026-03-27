import { Image } from "expo-image";
import { Text, View, StyleSheet } from "react-native";
import ImageViewer from "../../../components/ImageViewer";
import Button from "../../../components/Buttons";

const PlaceholderImage = require("../../../assets/images/appCare.jpg");
export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>

      <View style={styles.footerContainer}>
        <Button label="Choose a photo" theme="primary" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#25292e",
  }, 
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  }
});
 