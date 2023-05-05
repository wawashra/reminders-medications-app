import React, { Component, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { xorBy } from "lodash";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectBox from "react-native-multi-selectbox";
import Constants from "./utils/Constants";
import TagInput from "react-native-tags-input";
import { Ionicons } from "@expo/vector-icons";
import reSchedulePushNotification from "./utils/NotifyUtlils";

const Detail = ({ route, navigation }) => {
  const { item } = route.params;

  const mapDaysToSelectBox = () => {
    if (!item.reminder) return [];
    return item.reminder.days.map((day) => {
      return { item: day, id: Constants.WEEK_DAYS_REVERCE_LIST[day] };
    });
  };

  const [selectedTime, setSelectedTime] = useState(new Date());

  const mapTimeToSelectdTags = () => {
    const timesTags = {
      tag: "",
      tagsArray: [],
    };

    if (!item.reminder) return timesTags;

    item.reminder.times.map((time) => {
      const datetime = new Date("1970-01-01T" + time);
      timesTags.tagsArray.push(datetime.toLocaleTimeString());
    });

    return timesTags;
  };

  const [selectedTags, setSelectedTags] = useState(mapTimeToSelectdTags);

  updateTagState = (state) => {
    setSelectedTags(state);
  };

  const onChangeTimes = (event, date) => {
    if (event.type === "set") {
      setSelectedTime(date);
    }
  };

  const addTimeToTimes = () => {
    const tagsNew = { ...selectedTags };
    selectedTags.tagsArray.push(selectedTime.toLocaleTimeString());
    setSelectedTags(tagsNew);
  };

  const [selectedDays, setSelectedDays] = useState(mapDaysToSelectBox);

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

  const updateMedication = () => {
    var myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      "Bearer af13005c6aeee31f7a405fc6bb1db2a6"
    );

    myHeaders.append("Content-Type", "application/json");

    fetch("http://192.168.1.4:3000/medications/" + item.id, {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify({
        name: medication.name,
      }),
    })
      .then((response) => {
        return response.text();
      })
      .then((result) => console.log("Result " + result))
      .catch((error) => console.log("Error " + error));
  };

  const updateReminders = () => {
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

    selectedTags.tagsArray.forEach((time) => {
      newTimes.push(time);
    });

    const requestBody = JSON.stringify({
      times: newTimes,
      days: newDays,
      start_date: reminders.startDate,
      end_date: reminders.endDate,
    });

    console.log("Req B " + requestBody);
    fetch("http://192.168.1.4:3000/medications/" + item.id + "/reminders", {
      method: "POST",
      headers: myHeaders,
      body: requestBody,
    })
      .then((response) => {
        navigation.pop();
        reSchedulePushNotification();
        return response.text();
      })
      .then((result) => console.log("Result " + result))
      .catch((error) => console.log("Error " + error));
  };

  const updateData = () => {
    if (medication.isMedicationChanged) {
      updateMedication();
    }
    updateReminders();
  };

  const deleteData = () => {
    var myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      "Bearer af13005c6aeee31f7a405fc6bb1db2a6"
    );

    myHeaders.append("Content-Type", "application/json");

    fetch("http://192.168.1.4:3000/medications/" + item.id, {
      method: "DELETE",
      headers: myHeaders,
    })
      .then((response) => {
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

      <TagInput
        disabled={true}
        updateState={updateTagState}
        tags={selectedTags}
      />

      <View style={styles.timePicker}>
        <Text>Times: </Text>
        <DateTimePicker
          mode="time"
          value={selectedTime}
          onChange={onChangeTimes}
        />

        <Ionicons
          name={"ios-add-circle"}
          size={25}
          color={"blue"}
          style={{ marginRight: 15 }}
          onPress={addTimeToTimes}
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
  timePicker: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
});

//make this component available to the app
export default Detail;
