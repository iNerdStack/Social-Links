import React, { createContext, useState } from "react";
import { ToastAndroid, Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  const ListLimit = 10;
  const ChatLimit = 10;
  const [chatLastMessages, setLastMessages] = useState([]);

  async function storeLastChatMessages(lastMessage) {
    let recentChat = [];

    let chatstoreId = lastMessage.docid.toString();

    let getsavedLastMessage = await AsyncStorage.getItem(chatstoreId);

    if (getsavedLastMessage != null) {
      recentChat = JSON.parse(getsavedLastMessage);
      recentChat[0] = lastMessage;
      if (lastMessage.text.length > 35) {
        recentChat[0].text = lastMessage.text.slice(0, 35);
      }

      let value = JSON.stringify(recentChat);
      await AsyncStorage.setItem(chatstoreId, value);
      return "saved";
    } else {
      recentChat = [lastMessage];
      setLastMessages(recentChat);
      let value = JSON.stringify(recentChat);
      await AsyncStorage.setItem(chatstoreId, value);
      return "saved";
    }
  }

  async function checkLastChatMessageStatus(lastMessage) {
    if (!lastMessage.docid) {
      return;
    }
    let computedMessage = lastMessage;
    let recentChat = [];

    let chatstoreId = lastMessage.docid.toString();

    let getsavedLastMessage = await AsyncStorage.getItem(chatstoreId);

    if (getsavedLastMessage != null) {
      recentChat = JSON.parse(getsavedLastMessage);
      if (
        (recentChat[0].id === lastMessage.latestMessage.id &&
          recentChat[0].text === lastMessage.latestMessage.text) ||
        lastMessage.latestMessage.id === "deleted_message"
      ) {
        computedMessage.isNew = false;
      } else {
        computedMessage.isNew = true;
      }

      return computedMessage;
    } else {
      computedMessage.isNew = true;
      return computedMessage;
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        ListLimit,
        ChatLimit,
        chatLastMessages,
        setLastMessages,
        updateHelper: () => {
          const [value, setValue] = useState(0);
          return () => setValue((value) => value + 1);
        },
        showAlert: (message) => {
          if (Platform.OS === "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT);
          } else {
            Alert.alert("Message", message, { cancelable: true });
          }
        },
        storeLastChatMessages,
        checkLastChatMessageStatus,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
