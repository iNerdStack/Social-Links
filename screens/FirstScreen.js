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
import Loading from "../components/Loading";
import * as firebase from "firebase";
import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";

export default function FirstScreen({ navigation }) {
  const { logout, user } = useContext(AuthContext);
  const { showToast } = useContext(GlobalContext);
  const { getUsername } = useContext(GlobalContext);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [Users, setUsers] = useState([]);
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
    const unsubscribe = firebase
      .firestore()
      .collection("CHATS")
      .orderBy("latestMessage.createdAt", "desc")
      // .where("latestMessage.sender", "==", username)
      // .where("latestMessage.receiver", "==", username)
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          return firebaseData;
        });
        setUsers(Users);
        setMessages(messages);

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);

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
            <ScrollView
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
                    <View style={styles.topImg}>
                      <Avatar
                        size="large"
                        source={require("../assets/img/default.png")}
                        style={{ marginRight: 17, marginLeft: 12 }}
                      />
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
            </ScrollView>
          </Layout>
        </Layout>
        <Layout style={styles.MainContainer} level="4">
          {messages.map((item, key) => {
            let lastMessage = item.latestMessage;
            let userinfo = {};
            if (lastMessage.sender === username) {
              userinfo = {
                userid: lastMessage.id,
                username: lastMessage.receiver,
                recent: true,
              };
            } else {
              userinfo = {
                userid: lastMessage.id,
                username: lastMessage.sender,
                recent: true,
              };
            }

            //check chat last message to one user
            let chatLastMessage = null;
            if (
              lastMessage.sender === username ||
              lastMessage.receiver === username
            ) {
              if (lastMessage.sender === username) {
                chatLastMessage = lastMessage.receiver;
              } else {
                chatLastMessage = lastMessage.sender;
              }
            }

            return (
              <Layout>
                {chatLastMessage ? (
                  <Layout key={item.id}>
                    <Card
                      style={{
                        marginVertical: 5,
                        borderWidth: 0,
                        flexDirection: "row",
                      }}
                      onPress={() =>
                        navigation.navigate("Chat", { userinfo: userinfo })
                      }
                    >
                      <Layout
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Avatar
                          size="large"
                          source={require("../assets/img/default.png")}
                        />
                        <Layout
                          style={{
                            flexDirection: "column",
                            marginLeft: 13,
                            backgroundColor: "transparent",
                          }}
                        >
                          <Text category="s1">{chatLastMessage} </Text>

                          <Text category="s2" style={{ fontSize: 15 }}>
                            {lastMessage.text}
                          </Text>
                        </Layout>
                      </Layout>
                    </Card>
                    <Divider />
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
  tab: {
    // backgroundColor: "white",
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

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { Layout, Text, Icon, Button } from "@ui-kitten/components";
// const MenuScreen = ({ navigation }) => {
//   return (
//     <Layout style={styles.container}>
//       {/* <Title>All chat rooms will be listed here</Title> */}
//       <Button>Get Started</Button>
//       {/* <Button modeValue="contained" title="Logout" /> */}
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#f5f5f5",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default MenuScreen;
