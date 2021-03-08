import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Layout,
  Text,
  Icon,
  Card,
  Divider,
  Button,
  Avatar,
} from "@ui-kitten/components";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../components/Loading";
import * as firebase from "firebase";
import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import ProfileAvatar from "../components/Avatar";

export default function RecentScreen({ navigation }) {
  const isFocused = useIsFocused();
  const { logout, user, username } = useContext(AuthContext);
  const { ListLimit, checkLastChatMessageStatus, updateHelper } = useContext(
    GlobalContext
  );
  const updatePage = updateHelper();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [snapShotMessages, setsnapShotMessages] = useState([]);

  let currentUser = "none";
  try {
    currentUser = user.toJSON();
  } catch (error) {}

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("CHATS")
      .where("participants", "array-contains", currentUser.uid)
      .orderBy("latestMessage.createdAt", "desc")
      .limit(ListLimit)
      .onSnapshot((querySnapshot) => {
        const getmessages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            docid: doc.id,
            ...firebaseData,
          };

          return data;
        });

        setsnapShotMessages(getmessages);
        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, []);

  async function updateMessagesStatus() {
    if (snapShotMessages.length > 0) {
      let messageStatus = snapShotMessages;
      for (let i = 0; i < messageStatus.length; i++) {
        messageStatus[i] = await checkLastChatMessageStatus(messageStatus[i]);
      }
      setMessages(messageStatus);
      updatePage();
    }
  }

  useEffect(() => {
    if (isFocused) {
      updateMessagesStatus();
    }
  }, [isFocused]);

  useEffect(() => {
    updateMessagesStatus();
  }, [snapShotMessages]);

  if (loading) {
    return <Loading />;
  }

  const DATA = [
    {
      id: "1",
      title: "Johnson",
    },
    {
      id: "2",
      title: "Stephen",
    },
    {
      id: "3",
      title: "Joseph",
    },
    {
      id: "4",
      title: "Isreal",
    },
    {
      id: "5",
      title: "Paul",
    },
  ];

  return (
    <ScrollView showsHorizontalScrollIndicator={false} decelerationRate="fast">
      <Layout style={{ flex: 1, backgroundColor: "white" }}>
        <Layout style={{ backgroundColor: "transparent" }}>
          <Layout style={styles.card}>
            {/* <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              style={styles.compcase}
            >
              <View
                style={{
                  marginHorizontal: 5,
                  marginBottom: 10,
                  marginLeft: 15,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#efefef",
                      width: 50,
                      height: 50,
                      borderRadius: 30,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      style={{
                        width: 30,
                        height: 30,
                      }}
                      fill="#8F9BB3"
                      name="plus"
                    />
                  </View>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      category="s1"
                      style={{
                        paddingTop: 12,
                        fontSize: 13,
                      }}
                    >
                      Add Story
                    </Text>
                  </View>
                </View>
              </View>

              {DATA.map((item, key) => {
                return (
                  <View style={styles.prodCaseView} key={item.id}>
                    <View>
                      <ProfileAvatar name={item.title} />
                    </View>
                    <View>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          category="s1"
                          style={{
                            ...styles.productTitle,
                            paddingTop: 12,
                            fontSize: 13,
                          }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.productTitle}
                        >
                          {item.title}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView> */}
          </Layout>
        </Layout>
        <Layout style={styles.MainContainer} level="4">
          {messages.map((item, key, index) => {
            let lastMessage = item.latestMessage;
            let lastMessageTime = "";
            let isNewMessage = item.isNew;
            try {
              lastMessageTime = moment(
                lastMessage.createdAt.toDate().getTime()
              ).fromNow();
            } catch (ex) {
              // console.log(ex);
            }

            let userinfo = {};
            //set user id for the other user
            let userid = "";
            if (item.participants[0] === currentUser.uid) {
              userid = item.participants[1];
            } else {
              userid = item.participants[0];
            }

            if (lastMessage.users[0] === username) {
              userinfo = {
                userid: userid,
                username: lastMessage.users[1],
              };
            } else {
              userinfo = {
                userid: userid,
                username: lastMessage.users[0],
              };
            }

            //check chat last message to one user
            let userName = null;
            if (
              lastMessage.users[0] === username ||
              lastMessage.users[1] === username
            ) {
              if (lastMessage.users[0] === username) {
                userName = lastMessage.users[1];
              } else {
                userName = lastMessage.users[0];
              }
            }

            return (
              <Layout>
                {userName ? (
                  <Layout key={item.id}>
                    <Card
                      style={{
                        marginVertical: 1,
                        borderWidth: 0,
                        backgroundColor: "transparent",
                      }}
                      onPress={() => {
                        navigation.navigate("Chat", { userinfo: userinfo });
                      }}
                    >
                      <Layout
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Layout
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                            backgroundColor: "transparent",
                          }}
                        >
                          <ProfileAvatar name={userName} />
                          <Layout
                            style={{
                              flex: 1,
                              marginLeft: 13,
                              marginTop: 8,
                              alignContent: "space-between",
                              backgroundColor: "transparent",
                            }}
                          >
                            <Text category="s1" style={{ fontSize: 16 }}>
                              {userName.charAt(0).toUpperCase() +
                                userName.slice(1)}
                            </Text>

                            <Text
                              category={isNewMessage ? "s1" : "s2"}
                              style={{
                                fontSize: 14,
                                marginTop: 4,
                                flex: 1,
                              }}
                              numberOfLines={1}
                            >
                              {lastMessage.id === "deleted_message"
                                ? "A  message was deleted"
                                : lastMessage.text}
                            </Text>
                          </Layout>
                        </Layout>
                        <Layout
                          style={{
                            backgroundColor: "transparent",
                            flexDirection: "column",
                            marginTop: 8,
                          }}
                        >
                          <Layout>
                            <Text category="s2" style={{ color: "grey" }}>
                              {lastMessageTime}
                            </Text>
                          </Layout>
                          <Layout
                            style={{
                              marginTop: 6,
                              flexDirection: "row-reverse",
                            }}
                          >
                            {isNewMessage ? (
                              <Layout
                                style={{
                                  backgroundColor: "green",
                                  padding: 5,
                                  borderRadius: 5,
                                  marginRight: 5,
                                  marginTop: 3,
                                }}
                              ></Layout>
                            ) : null}
                          </Layout>
                        </Layout>
                      </Layout>
                    </Card>
                  </Layout>
                ) : null}
              </Layout>
            );
          })}
        </Layout>
      </Layout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafc",
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
  MainContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    margin: 2,
  },
  GridViewTextLayout: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    padding: 10,
  },
  imageThumbnail: {
    resizeMode: "cover",
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  case: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  itemStyle: {
    width: 60,
    height: 60,
    margin: 10,
    marginTop: 30,
  },
  //small box
  card: {
    backgroundColor: "transparent",
    paddingTop: 20,
    borderRadius: 0,
  },
  categoryTitle: {
    height: "100%",
    paddingHorizontal: 16,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTextcase: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    paddingBottom: 10,
    paddingTop: 10,
  },
  categoryText: {
    fontSize: 14,
  },
  prodCaseView: {
    borderWidth: 0,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  imageStyles: {
    height: 100,
    width: 100,
    borderRadius: 25,
  },
  icon: {
    width: 25,
    height: 25,
  },
  productTitle: {
    paddingTop: 14,
    paddingHorizontal: 5,
    fontSize: 13,
    textTransform: "capitalize",
    paddingBottom: 6,
    justifyContent: "center",
  },
  productPrice: {
    fontSize: 12,
    textTransform: "uppercase",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontWeight: "bold",
  },
  imagBgcase: {
    height: 120,
    width: 250,
    borderRadius: 10,
  },
  imagBg: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  dscrview: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
    borderRadius: 10,
  },
  iconBgcase: {
    height: 35,
    width: 35,
    marginLeft: 10,
  },
  iconBg: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
});
