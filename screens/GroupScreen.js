import React, { useState, useContext, useEffect } from "react";
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Day,
  utils,
} from "react-native-gifted-chat";
import {
  Divider,
  Layout,
  Icon,
  Text,
  Button,
  Card,
  Avatar,
} from "@ui-kitten/components";
import { ActivityIndicator, View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import * as firebase from "firebase";
import "firebase/firestore";

const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;
const CallIcon = (props) => <Icon {...props} name="phone-outline" />;

const { isSameUser, isSameDay } = utils;

export default function GroupScreen({ route, navigation }) {
  const { thread } = route.params;
  const { user } = useContext(AuthContext);
  const { getUsername } = useContext(GlobalContext);
  const currentUser = user.toJSON();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const messagesListener = firebase
      .firestore()
      .collection("THREADS")
      .doc(thread._id)
      .collection("MESSAGES")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: "",
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.username,
              email: firebaseData.user.email,
            };
          }

          return data;
        });

        setMessages(messages);
      });

    return () => messagesListener();
  }, []);

  function renderLoading() {
    userName();
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  const userName = async () => {
    const getuser = await getUsername();
    setUsername(getuser);
  };

  async function handleSend(messages) {
    const text = messages[0].text;

    await firebase
      .firestore()
      .collection("THREADS")
      .doc(thread._id)
      .collection("MESSAGES")
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          username: username,
          email: currentUser.email,
        },
      });

    await firebase
      .firestore()
      .collection("THREADS")
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
            user: username,
          },
        },
        { merge: true }
      );
  }

  const [messages, setMessages] = useState([
    /**
     * Mock message data
     */
    // example of system message
    {
      _id: 0,
      text: "New room created.",
      createdAt: new Date().getTime(),
      system: true,
    },
  ]);

  // helper method that is sends a message
  //   function handleSend(newMessage = []) {
  //     setMessages(GiftedChat.append(messages, newMessage));
  //   }

  function renderBubble(props) {
    if (
      isSameUser(props.currentMessage, props.previousMessage) &&
      isSameDay(props.currentMessage, props.previousMessage)
    ) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              // Here is the color change
              backgroundColor: "#6646ee",
            },
          }}
          textStyle={{
            right: {
              color: "#fff",
            },
          }}
        />
      );
    }
    return (
      <Layout>
        <Layout
          style={[
            props.currentMessage.user.name === username
              ? styles.userMessage
              : styles.othersMessage,
          ]}
        >
          <Text category="s2" style={{ color: "grey", fontWeight: "bold" }}>
            {props.currentMessage.user.name}
          </Text>
        </Layout>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              // Here is the color change
              backgroundColor: "#6646ee",
            },
          }}
          textStyle={{
            right: {
              color: "#fff",
            },
          }}
        />
      </Layout>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <Image
            source={require("../assets/icons/send.png")}
            style={{ width: 25, height: 25, margin: 10 }}
            size={50}
            resizeMethod="resize"
          />
        </View>
      </Send>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Layout style={styles.headerContainer}>
        <Button
          accessoryLeft={BackIcon}
          appearance="ghost"
          status="info"
          style={{ height: 28, width: 28 }}
          onPress={() => navigation.goBack()}
        />
        <Text category="h5" style={{ marginTop: 4 }}>
          {thread.name}
        </Text>
        <Button
          accessoryLeft={CallIcon}
          appearance="ghost"
          status="info"
          style={{ height: 28, width: 28 }}
        />
      </Layout>
      <Divider />
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: currentUser.uid }}
        placeholder="Send a message"
        renderBubble={renderBubble}
        alwaysShowSend
        scrollToBottom
        alignTop={true}
        renderSend={renderSend}
        renderSystemMessage={renderSystemMessage}
        renderLoading={renderLoading}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  systemMessageText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  headerContainer: {
    margin: 15,
    height: 40,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  systemMessageText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
  },
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  userMessage: {
    flexDirection: "row-reverse",
    paddingLeft: 6,
    marginBottom: 4,
  },
  othersMessage: {
    flexDirection: "row",
    paddingLeft: 6,
    marginBottom: 4,
  },
});
