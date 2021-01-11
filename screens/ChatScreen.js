import React, { useState, useContext, useEffect } from "react";
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  InputToolbar,
} from "react-native-gifted-chat";
import {
  ListItem,
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

const CallIcon = (props) => <Icon {...props} name="phone-outline" />;
const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

export default function ChatScreen({ route, navigation }) {
  const { userinfo } = route.params;
  const { user } = useContext(AuthContext);
  const { getUsername } = useContext(GlobalContext);
  const [username, setUsername] = useState("");
  let currentUser = "none";
  try {
    currentUser = user.toJSON();
  } catch (error) {}

  useEffect(() => {
    async function userName() {
      const getuser = await getUsername();
      setUsername(getuser.toString());
    }
    userName();
    return () => userName();
  }, []);

  useEffect(() => {
    let messageid = "";
    if (!userinfo.recent) {
      messageid =
        currentUser.uid < userinfo.userid
          ? currentUser.uid + "_" + userinfo.userid
          : userinfo.userid + "_" + currentUser.uid;
    } else {
      messageid = userinfo.userid;
    }

    const messagesListener = firebase
      .firestore()
      .collection("CHATS")
      .doc(messageid)
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
              name: firebaseData.user.email,
            };
          }

          return data;
        });

        setMessages(messages);
      });

    return () => messagesListener();
  }, []);

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  async function handleSend(messages) {
    const text = messages[0].text;
    //Logic
    //var chatID = 'chat_'+(user1<user2 ? user1+'_'+user2 : user2+'_'+user1);

    let messageid = "";
    if (!userinfo.recent) {
      messageid =
        currentUser.uid < userinfo.userid
          ? currentUser.uid + "_" + userinfo.userid
          : userinfo.userid + "_" + currentUser.uid;
    } else {
      messageid = userinfo.userid;
    }

    await firebase
      .firestore()
      .collection("CHATS")
      .doc(messageid)
      .collection("MESSAGES")
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      });

    await firebase
      .firestore()
      .collection("CHATS")
      .doc(messageid)
      .set(
        {
          latestMessage: {
            id: messageid,
            sender: username,
            receiver: userinfo.username,
            text,
            createdAt: new Date().getTime(),
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
      text: "Start a conversation with" + userinfo,
      createdAt: new Date().getTime(),
      system: true,
    },
    // // example of chat message
    // {
    //   _id: 1,
    //   text: "Hello!",
    //   createdAt: new Date().getTime(),
    //   user: {
    //     _id: 2,
    //     name: "Test User",
    //   },
    // },
  ]);

  // helper method that is sends a message
  //   function handleSend(newMessage = []) {
  //     setMessages(GiftedChat.append(messages, newMessage));
  //   }

  function renderBubble(props) {
    return (
      // Step 3: return the component
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

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#E8E8E8",
          borderTopWidth: 1,
          padding: 8,
        }}
      />
    );
  };

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
        <Layout style={{ justifyContent: "center", flexDirection: "column" }}>
          <Layout
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              size="large"
              source={require("../assets/img/default.png")}
            />
          </Layout>
          <Text category="s1" style={{ paddingTop: 10 }}>
            {userinfo.username}
          </Text>
        </Layout>

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
        alignTop="true"
        onSend={handleSend}
        user={{ _id: currentUser.uid }}
        renderBubble={renderBubble}
        placeholder="Send a message"
        alwaysShowSend
        scrollToBottom
        renderSend={renderSend}
        renderSystemMessage={renderSystemMessage}
        renderLoading={renderLoading}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // rest remains same
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
    height: 65,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
  imageThumbnail: {
    resizeMode: "cover",
    height: 22,
    width: 22,
  },
});
