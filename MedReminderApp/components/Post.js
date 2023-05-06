import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";

const Post = ({ navigation }) => {
  const [medication, setMedication] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeName = (value) => {
    setMedication({ ...medication, name: value });
  };

  const saveData = () => {
    setLoading(true);
    var myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      "Bearer af13005c6aeee31f7a405fc6bb1db2a6"
    );

    myHeaders.append("Content-Type", "application/json");

    fetch("http://192.168.1.4:3000/medications", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        name: medication.name,
      }),
    })
      .then((response) => {
        setLoading(false);
        navigation.pop();
        return response.text();
      })
      .then((result) => console.log("Result " + result))
      .catch((error) => console.log("Error " + error));
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={"Name"}
        onChangeText={(value) => onChangeName(value)}
        style={styles.input}
      />

      <TouchableOpacity onPress={saveData}>
        <View style={{ backgroundColor: "blue", padding: 10 }}>
          <Text style={{ color: "white", textAlign: "center" }}>
            {loading ? "Inserting..." : "Add"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    margin: 15,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
  },
});
export default Post;
