import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import {
  Divider,
  Layout,
  Icon,
  Text,
  Button,
  Card,
  Avatar,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import * as firebase from "firebase";
import "firebase/firestore";
import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import Loading from "../components/Loading";

const AddIcon = (props) => <Icon {...props} name="plus-circle" />;
const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;
export default function UsersScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { getUsername } = useContext(GlobalContext);
  const [username, setUsername] = useState("");
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

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
      .collection("USERS")
      .onSnapshot((querySnapshot) => {
        const users = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: "",
            ...documentSnapshot.data(),
          };
        });

        setThreads(users);

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

  // ...rest of the component

  return (
    <ScrollView showsHorizontalScrollIndicator={false} decelerationRate="fast">
      {threads.map((item, key) => {
        return (
          <Layout
            style={{
              backgroundColor: "transparent",
            }}
          >
            {item.username !== username ? (
              <Layout
                style={{
                  backgroundColor: "transparent",
                }}
              >
                <Card
                  style={{
                    marginVertical: 5,
                    borderWidth: 0,
                    flexDirection: "row",
                  }}
                  onPress={() =>
                    navigation.navigate("Chat", { userinfo: item })
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
                        marginTop: 5,
                      }}
                    >
                      <Text category="s1">{item.username}</Text>
                      <Text category="s2" style={{ fontSize: 15 }}>
                        0 Mutual Friends
                      </Text>
                    </Layout>
                  </Layout>
                </Card>
              </Layout>
            ) : null}
            <Divider />
          </Layout>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#f9fafc",
    margin: 15,
    height: 40,
    justifyContent: "space-between",
    flexDirection: "row",
  },
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
  imageThumbnail: {
    resizeMode: "cover",
    height: 22,
    width: 22,
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
