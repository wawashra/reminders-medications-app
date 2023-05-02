import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { xorBy } from "lodash";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectBox from "react-native-multi-selectbox";
import Constants from "./utils/Constants";

const Detail = ({ route, navigation }) => {
  const { item } = route.params;

  const mapDaysToSelectBox = () => {
    if (!item.reminder) return [];
    return item.reminder.days.map((day) => {
      return { item: day, id: Constants.WEEK_DAYS_REVERCE_LIST[day] };
    });
  };

  const mapTimeToSelectBox = () => {
    if (!item.reminder) return [];
    return item.reminder.times.map((time) => {
      return { item: time, id: Constants.TIMES_LIST_REVERCE[time] };
    });
  };

  const [selectedDays, setSelectedDays] = useState(mapDaysToSelectBox);
  const [selectedTimes, setSelectedTimes] = useState(mapTimeToSelectBox);

  const [reminders, setReminders] = useState({
    id: item.reminder?.id,
    times: item.reminder?.times || [],
    startDate: item.reminder?.start_date || new Date(),
    endDate: item.reminder?.end_date || new Date(),
  });

  const [medication, setMedication] = useState({
    name: item.name,
    id: item.id,
    isMedicationChanged: false,
  });

  const onMultiChangeSelectedDays = () => {
    return (item) => setSelectedDays(xorBy(selectedDays, [item], "id"));
  };

  const onMultiChangeSelectedTimes = () => {
    return (item) => setSelectedTimes(xorBy(selectedTimes, [item], "id"));
  };

  const onChangeName = (value) => {
    setMedication({ ...medication, name: value, isMedicationChanged: true });
    console.log("is change " + medication.isMedicationChanged);
  };

  const onChangeStartDay = (event, date) => {
    if (event.type === "set") {
      setReminders({ ...reminders, startDate: date });
    }
  };

  const onChangeEndDay = (event, date) => {
    if (event.type === "set") {
      setReminders({ ...reminders, endDate: date });
    }
  };

  const updateData = () => {
    var myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      "Bearer af13005c6aeee31f7a405fc6bb1db2a6"
    );

    myHeaders.append("Content-Type", "application/json");

    let newDays = [];
    let newTimes = [];

    selectedDays.forEach((day) => {
      newDays.push(day.item);
    });

    selectedTimes.forEach((time) => {
      newTimes.push(time.item);
    });

    fetch("http://192.168.1.4:3000/medications/" + item.id + "/reminders", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        times: newTimes,
        days: newDays,
        start_date: reminders.startDate,
        end_date: reminders.endDate,
      }),
    })
      .then((response) => {
        response.text();
        navigation.push("Get");
      })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };

  const deleteData = () => {
    var myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      "Bearer 62ddfa7559d5fdec64517e3ab70ee4fd60b2244e71fa042a44f914f8fa688263"
    );

    myHeaders.append("Content-Type", "application/json");

    fetch("https://gorest.co.in/public-api/users/" + item.reminders.id, {
      method: "DELETE",
      headers: myHeaders,
      body: JSON.stringify({
        name: medication.name,
        times: medication.times,
        email: medication.email,
        status: medication.status,
      }),
    })
      .then((response) => {
        response.text();
        navigation.push("Get");
      })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };
  return (
    <View style={styles.container}>
      {/* <Text>Medical Name : </Text> */}
      <TextInput
        placeholder={"Name"}
        onChangeText={(value) => onChangeName(value)}
        style={styles.input}
        value={medication.name}
      />

      <View style={styles.datePicker}>
        <SelectBox
          label="Select Weekdays"
          options={Constants.WEEK_DAYS_LIST}
          selectedValues={selectedDays}
          onMultiSelect={onMultiChangeSelectedDays()}
          onTapClose={onMultiChangeSelectedDays()}
          isMulti
        />
      </View>

      <View style={styles.datePicker}>
        <SelectBox
          label="Select Times"
          options={Constants.TIMES_LIST}
          selectedValues={selectedTimes}
          onMultiSelect={onMultiChangeSelectedTimes()}
          onTapClose={onMultiChangeSelectedTimes()}
          isMulti
        />
      </View>

      <View style={styles.datePicker}>
        <Text>Start Date: </Text>
        <DateTimePicker
          mode="date"
          value={new Date(reminders.startDate)}
          onChange={onChangeStartDay}
        />
      </View>

      <View style={styles.datePicker}>
        <Text>End Date: </Text>
        <DateTimePicker
          mode="date"
          value={new Date(reminders.endDate)}
          onChange={onChangeEndDay}
        />
      </View>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={updateData}>
          <View style={{ backgroundColor: "blue", padding: 10 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Update</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={deleteData}>
          <View style={{ backgroundColor: "red", padding: 10 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 15,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 20,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
});

//make this component available to the app
export default Detail;
