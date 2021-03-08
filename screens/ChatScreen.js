import React, { useState, useContext, useEffect } from "react";
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from "react-native-gifted-chat";
import { Divider, Layout, Icon, Text, Button } from "@ui-kitten/components";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  Clipboard,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "../components/Loading";
import ProfileAvatar from "../components/Avatar";

const CallIcon = (props) => <Icon {...props} name="phone-outline" />;
const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

export default function ChatScreen({ route, navigation }) {
  const { userinfo } = route.params;
  const [loading, setLoading] = useState(true);
  const { user, username } = useContext(AuthContext);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isMessageLimitReached, setisMessageLimitReached] = useState(false);
  const [LoadedAllMessages, setLoadedAllMessages] = useState(false);
  const [LastVisible, setLastVisible] = useState({});
  const { storeLastChatMessages, ChatLimit, updateHelper } = useContext(
    GlobalContext
  );
  const updateChatMessages = updateHelper();
  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: "Start a conversation",
      createdAt: new Date().getTime(),
      system: true,
    },
  ]);

  let currentUser = "none";
  try {
    currentUser = user.toJSON();
  } catch (error) {}

  let messagedocid =
    currentUser.uid < userinfo.userid
      ? currentUser.uid + userinfo.userid
      : userinfo.userid + currentUser.uid;

  function onLoadEarlier() {
    setIsLoadingEarlier(true);

    firebase
      .firestore()
      .collection("CHATS")
      .doc(messagedocid)
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
        if (docRef.docs.length < ChatLimit) {
          setLoadedAllMessages(true);
          setisMessageLimitReached(true);
        }

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

        setMessages(messages.concat(oldermessages));
        setIsLoadingEarlier(false);
      });
  }

  useEffect(() => {
    const messagesListener = firebase
      .firestore()
      .collection("CHATS")
      .doc(messagedocid)
      .collection("MESSAGES")
      .orderBy("createdAt", "desc")
      .limit(ChatLimit)
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.docs.length >= 1) {
          setLastVisible(
            querySnapshot.docs[querySnapshot.docs.length - 1].data()
          );
        }

        if (querySnapshot.docs.length < ChatLimit) {
          setLoadedAllMessages(true);
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
              name: firebaseData.user.email,
            };
          }

          return data;
        });

        setMessages(loadmessages);

        if (loading) {
          setLoading(false);
        }
      });

    return () => messagesListener();
  }, []);

  useEffect(() => {
    async function updateLastMessage() {
      let lastMessage = {
        docid: messagedocid,
        id: messages[0]._id,
        text: messages[0].text,
        createdAt: messages[0].createdAt,
      };

      if (!messages[0].system) {
        await storeLastChatMessages(lastMessage);
      }
    }
    updateLastMessage();
  }, [messages]);

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  async function handleSend(messages) {
    const text = messages[0].text;

    let messagedocid = "";
    let messageid = currentUser.uid + new Date().getTime();

    messagedocid =
      currentUser.uid < userinfo.userid
        ? currentUser.uid + userinfo.userid
        : userinfo.userid + currentUser.uid;

    let participants =
      currentUser.uid < userinfo.userid
        ? [currentUser.uid, userinfo.userid]
        : [userinfo.userid, currentUser.uid];

    let latestMessageText = text;
    if (text.length > 35) {
      latestMessageText = text.slice(0, 35);
    }

    let batch = firebase.firestore().batch();
    let queryLastMessage = firebase
      .firestore()
      .collection("CHATS")
      .doc(messagedocid);

    batch.set(
      queryLastMessage,
      {
        participants: participants,
        latestMessage: {
          id: messageid,
          users: [username, userinfo.username],
          text: latestMessageText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );

    let queryMessage = firebase
      .firestore()
      .collection("CHATS")
      .doc(messagedocid)
      .collection("MESSAGES")
      .doc(messageid);

    batch.set(queryMessage, {
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      user: {
        _id: currentUser.uid,
        username,
      },
    });
    batch
      .commit()
      .then(() => {})
      .catch((error) => {});
  }

  async function deleteMessage(message) {
    let batch = firebase.firestore().batch();
    let queryupdatelastMessage = firebase
      .firestore()
      .collection("CHATS")
      .doc(messagedocid);

    batch.set(
      queryupdatelastMessage,
      {
        latestMessage: {
          id: "deleted_message",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );

    let queryDeleteMessage = firebase
      .firestore()
      .collection("CHATS")
      .doc(messagedocid)
      .collection("MESSAGES")
      .doc(message._id);

    batch.delete(queryDeleteMessage);

    batch
      .commit()
      .then(async () => {
        let m = messages;
        let MessageIndex = m.map((item) => item._id).indexOf(message._id);

        //update chat list when older messages are deleted
        if (MessageIndex > ChatLimit - 1) {
          m.splice(MessageIndex, 1);

          setMessages(m);
          updateChatMessages();
        } else if (MessageIndex === 0) {
          let lastMessage = {
            docid: messagedocid,
            id: "deleted_message",
            text: m[1].text,
            createdAt: m[1].createdAt,
          };
          let store = await storeLastChatMessages(lastMessage);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

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

  function renderscrollToBottomComponent(props) {
    return (
      <View style={styles.scrollToBottomContainer}>
        <TouchableOpacity {...props}>
          <Icon
            name="arrowhead-down-outline"
            style={{ width: 22, height: 22 }}
            fill="black"
          />
        </TouchableOpacity>
      </View>
    );
  }
  function onLongPress(context, message) {
    if (message.user._id === currentUser.uid) {
      const options = ["Copy Text", "Delete", "Cancel"];
      const cancelButtonIndex = options.length - 1;
      const destructiveButtonIndex = options.length - 2;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
            case 1:
              {
                deleteMessage(message);
              }
              break;
          }
        }
      );
    } else {
      const options = ["Copy Text", "Cancel"];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
          }
        }
      );
    }
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
        <Layout
          style={{
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Layout
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ProfileAvatar name={userinfo.username} />
          </Layout>
          <Text
            category="s1"
            style={{ paddingTop: 10, color: "grey", textAlign: "center" }}
          >
            {userinfo.username.charAt(0).toUpperCase() +
              userinfo.username.slice(1)}
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
        alignTop={true}
        renderAvatar={null}
        onSend={handleSend}
        user={{ _id: currentUser.uid }}
        renderBubble={renderBubble}
        placeholder="Send a message"
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={renderscrollToBottomComponent}
        renderSend={renderSend}
        renderSystemMessage={renderSystemMessage}
        renderLoading={renderLoading}
        loadEarlier={!LoadedAllMessages}
        onLoadEarlier={onLoadEarlier}
        onLongPress={onLongPress}
        isLoadingEarlier={isLoadingEarlier}
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
    marginTop: 25,
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
  scrollToBottomContainer: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
