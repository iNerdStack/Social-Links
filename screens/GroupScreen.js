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
import * as firebase from "firebase";
import { GlobalContext } from "../src/GlobalProvider";
import "firebase/firestore";
import Loading from "../components/Loading";

const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;
const CallIcon = (props) => <Icon {...props} name="phone-outline" />;

const { isSameUser, isSameDay } = utils;

export default function GroupScreen({ route, navigation }) {
  const { group } = route.params;
  const [loading, setLoading] = useState(true);
  const { user, username } = useContext(AuthContext);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isMessageLimitReached, setisMessageLimitReached] = useState(false);
  const [LoadedAllMessages, setLoadedAllMessages] = useState(false);
  const [LastVisible, setLastVisible] = useState({});
  const [createdgroupMessage, setcreatedgroupMessage] = useState(null);
  const { ChatLimit } = useContext(GlobalContext);
  const currentUser = user.toJSON();

  function onLoadEarlier() {
    setIsLoadingEarlier(true);

    firebase
      .firestore()
      .collection("GROUPS")
      .doc(group._id)
      .collection("MESSAGES")
      .orderBy("createdAt", "desc")
      .startAfter(LastVisible.createdAt)
      .limit(ChatLimit)
      .get()
      .then((docRef) => {
        //update last messages with older document
        if (docRef.docs.length >= 1) {
          setLastVisible(docRef.docs[docRef.docs.length - 1].data());
        }
        //hide load more messages if all messages loaded

        const oldermessages = docRef.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            ...firebaseData,
          };

          if (!firebaseData.system) {
            try {
              data.createdAt = firebaseData.createdAt.toDate().getTime();
            } catch (ex) {
              // console.log(ex);
            }

            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
            };
          }

          return data;
        });

        if (docRef.docs.length < ChatLimit) {
          setLoadedAllMessages(true);
          setisMessageLimitReached(true);

          if (!createdgroupMessage) {
            firebase
              .firestore()
              .collection("GROUPS")
              .doc(group._id)
              .get()
              .then((docRef) => {
                //Display system message showing who created the group

                let groupMessage = {
                  _id: 0,
                  text: `${docRef.data().createdBy} created the group ${
                    docRef.data().name
                  }`,
                  createdAt: docRef.data().createdAt.toDate().getTime(),
                  system: true,
                  user: {
                    _id: "12345678",
                    email: "admin@admin.com",
                    name: "Admin",
                    username: "Admin",
                  },
                };
                setcreatedgroupMessage(groupMessage);
                oldermessages.push(groupMessage);
                setMessages(messages.concat(oldermessages));
              })
              .catch((error) => {});
          } else {
            oldermessages.push(createdgroupMessage);
            setMessages(messages.concat(oldermessages));
          }
        } else {
          setMessages(messages.concat(oldermessages));
        }

        setIsLoadingEarlier(false);
      });
  }

  useEffect(() => {
    const messagesListener = firebase
      .firestore()
      .collection("GROUPS")
      .doc(group._id)
      .collection("MESSAGES")
      .orderBy("createdAt", "desc")
      .limit(ChatLimit)
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.docs.length >= 1) {
          setLastVisible(
            querySnapshot.docs[querySnapshot.docs.length - 1].data()
          );
        }

        if (querySnapshot.docs.length === ChatLimit && !isMessageLimitReached) {
          setLoadedAllMessages(false);
        }

        const loadmessages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            ...firebaseData,
          };

          if (!firebaseData.system) {
            try {
              data.createdAt = firebaseData.createdAt.toDate().getTime();
            } catch (ex) {
              // console.log(ex);
            }

            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.username,
              email: firebaseData.user.email,
            };
          }

          return data;
        });

        //show created group details only when the recent messages are new
        if (querySnapshot.docs.length < ChatLimit) {
          setLoadedAllMessages(true);

          if (!createdgroupMessage) {
            firebase
              .firestore()
              .collection("GROUPS")
              .doc(group._id)
              .get()
              .then((docRef) => {
                //Display system message showing who created the group

                let groupMessage = {
                  _id: 0,
                  text: `${docRef.data().createdBy} created the group ${
                    docRef.data().name
                  }`,
                  createdAt: docRef.data().createdAt.toDate().getTime(),
                  system: true,
                  user: {
                    _id: "12345678",
                    email: "admin@admin.com",
                    name: "Admin",
                    username: "Admin",
                  },
                };
                setcreatedgroupMessage(groupMessage);
                loadmessages.push(groupMessage);
                setMessages(loadmessages);
              })
              .catch((error) => {});
          } else {
            loadmessages.push(createdgroupMessage);
            setMessages(loadmessages);
          }
        } else {
          setMessages(loadmessages);
        }

        if (loading) {
          setLoading(false);
        }
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

    let messageid = currentUser.uid + new Date().getTime();

    let latestMessageText = text;
    if (text.length > 35) {
      latestMessageText = text.slice(0, 35);
    }

    let batch = firebase.firestore().batch();
    let queryLastMessage = firebase
      .firestore()
      .collection("GROUPS")
      .doc(group._id);

    batch.set(
      queryLastMessage,
      {
        latestMessage: {
          id: messageid,
          text: latestMessageText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          username,
        },
      },
      { merge: true }
    );

    let queryMessage = firebase
      .firestore()
      .collection("GROUPS")
      .doc(group._id)
      .collection("MESSAGES")
      .doc(messageid);

    batch.set(queryMessage, {
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      user: {
        _id: currentUser.uid,
        username,
        email: currentUser.email,
      },
    });

    batch
      .commit()
      .then(() => {
        // console.log("Success");
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: "Loading Chats..",
      createdAt: new Date().getTime(),
      system: true,
    },
  ]);

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

  if (loading) {
    return <Loading />;
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
          {group.name}
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
        loadEarlier={!LoadedAllMessages}
        onLoadEarlier={onLoadEarlier}
        isLoadingEarlier={isLoadingEarlier}
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
