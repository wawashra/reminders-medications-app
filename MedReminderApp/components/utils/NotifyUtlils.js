import * as Notifications from "expo-notifications";

async function schedulePushNotification(reminder) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const time = new Date("1970-01-01T" + reminder.time);

  const weekday = days.indexOf(reminder.weekday) + 1;
  const hours = time.getHours();
  const minutes = time.getMinutes();

  console.log(reminder);
  console.log(weekday);
  console.log(hours);
  console.log(minutes);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "It's time To take your - " + reminder.medicationName,
      body:
        "Don't forget to take your " +
        reminder.medicationName +
        " medication dose",
    },
    trigger: { hour: hours, minute: minutes, repeats: true },
  });
}

async function reSchedulePushNotification() {
  try {
    var myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      "Bearer af13005c6aeee31f7a405fc6bb1db2a6"
    );
    myHeaders.append("Content-Type", "application/json");

    let response = await fetch("http://192.168.1.4:3000/reminders", {
      headers: myHeaders,
    });

    let json = await response.json();
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const reminder of json.content) {
      await schedulePushNotification(reminder);
    }
  } catch (error) {
    console.error(error);
  }
}
export default reSchedulePushNotification;
