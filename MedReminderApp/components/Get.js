//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

// create a component
const Get = ({ navigation }) => {
  const [medication, setMedication] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      getUserData();
    }, 1000);

    const unsubscribe = navigation.addListener("focus", () => {
      getUserData();
    });

    return () => {
      clearTimeout(interval);
      unsubscribe;
    };
  }, [navigation]);

  const getUserData = async () => {
    try {
      var myHeaders = new Headers();

      myHeaders.append(
        "Authorization",
        "Bearer af13005c6aeee31f7a405fc6bb1db2a6"
      );
      myHeaders.append("Content-Type", "application/json");

      let response = await fetch("http://192.168.1.4:3000/medications", {
        headers: myHeaders,
      });
      let json = await response.json();
      setMedication(json.content);
    } catch (error) {
      console.error(error);
    }
  };

  useState(() => {
    getUserData();
  }, []);

  const renderItem = ({ item }) => {
    let days = item.reminder
      ? item.reminder.days.join(", ")
      : "reminder Not setup yet";

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Detail", {
            item: item,
          })
        }
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            padding: 5,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
          <Text>{days}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={medication}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

//make this component available to the app
export default Get;
