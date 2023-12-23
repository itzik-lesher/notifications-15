import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    console.log("Receiving Notification");
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      console.log("status getPermissionsAsync = " + status);
      let finalStatus = status;

      /*
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log("status requestPermissionsAsync = " + status);
        finalStatus = status;
      }
      */

      finalStatus = "granted";

      console.log("finalStatus requestPermissionsAsync = " + finalStatus);
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notifications need the appropriate permissions."
        );
        return;
      }

      //const pushTokenData = await Notifications.getExpoPushTokenAsync();
      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "3cc65162-d7c5-43ea-90c0-a1be67c9dcb3",
      });
      console.log(JSON.stringify(pushTokenData), null, 2);

      if (Platform.OS === "android") {
        const setChannelResult =
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        console.log("SET CHANNEL RESULT", setChannelResult);
      }
    }

    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("NOTIFICATION RECEIVED");
        console.log(notification);
        const userName = notification.request.content.data.userName;
        console.log(userName);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("NOTIFICATION RESPONSE RECEIVED");
        console.log(response);
        const userName = response.notification.request.content.data.userName;
        console.log(userName);
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notification.",
        data: { userName: "Max" },
      },
      trigger: {
        seconds: 5,
      },
    });
  }
  /*
  function setPushNotificationHandler() {
    console.log("sending");
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // convrt a JS object in to json string
      body: JSON.stringify({
        to: "ExponentPushToken[W6UDhlPj10c4RoRxvg_lUo]",
        title: "Test from devid",
        body: " Body test",
      }),
    });
  }
*/
  // send to myself: ExponentPushToken[q4Sn7cPImxwAnEDwStEnFG]
  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[W6UDhlPj10c4RoRxvg_lUo]",
        title: "Test - sent from a device!",
        body: "This is a test!",
      }),
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
