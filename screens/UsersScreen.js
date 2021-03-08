import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import {
  Divider,
  Layout,
  Icon,
  Text,
  Button,
  Card,
} from "@ui-kitten/components";
import * as firebase from "firebase";
import "firebase/firestore";
import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import Loading from "../components/Loading";
import ProfileAvatar from "../components/Avatar";

const AddIcon = (props) => <Icon {...props} name="plus-circle" />;
const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;
export default function UsersScreen({ navigation }) {
  const { showAlert, ListLimit } = useContext(GlobalContext);
  const { user, username } = useContext(AuthContext);
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [
    onEndReachedCalledDuringMomentum,
    setonEndReachedCalledDuringMomentum,
  ] = useState(true);

  const LoadMoreGroups = () => {
    const lastVisible = Users[Users.length - 1];

    firebase
      .firestore()
      .collection("USERS")
      .orderBy("createdAt", "desc")
      .startAfter(lastVisible.createdAt)
      .limit(ListLimit)
      .get()
      .then((docRef) => {
        const users = docRef.docs.map((doc) => {
          const firebaseData = doc.data();
          return firebaseData;
        });

        //check the initial data is not yet in the array
        if (!users.every((val) => Users.includes(val))) {
          //add only if initial data not in group array
          setUsers(Users.concat(users));
        }
      });
  };
  const onEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      //Load More Groups
      LoadMoreGroups();
      setonEndReachedCalledDuringMomentum(true);
    }
  };

  useEffect(() => {
    const loadUsers = () => {
      firebase
        .firestore()
        .collection("USERS")
        .limit(ListLimit)
        .orderBy("createdAt", "desc")
        .get()
        .then((docRef) => {
          const users = docRef.docs.map((doc) => {
            const firebaseData = doc.data();
            return firebaseData;
          });

          setUsers(users);

          if (loading) {
            setLoading(false);
          }
        });
    };
    loadUsers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // ...rest of the component

  return (
    <FlatList
      data={Users}
      renderItem={({ item, index, key }) => (
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
                onPress={() => {
                  navigation.navigate("Chat", { userinfo: item });
                }}
              >
                <Layout
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <ProfileAvatar name={item.username} />
                  <Layout
                    style={{
                      flexDirection: "column",
                      marginLeft: 13,
                      backgroundColor: "transparent",
                      marginTop: 10,
                    }}
                  >
                    <Text category="s1">
                      {item.username.charAt(0).toUpperCase() +
                        item.username.slice(1)}
                    </Text>
                    <Text category="s2" style={{ fontSize: 15 }}>
                      0 Mutual Links
                    </Text>
                  </Layout>
                </Layout>
              </Card>
            </Layout>
          ) : null}
          <Divider />
        </Layout>
      )}
      //Setting the number of column
      numColumns={1}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={ListLimit}
      onEndReachedThreshold={0.1}
      onMomentumScrollBegin={() => {
        setonEndReachedCalledDuringMomentum(false);
      }}
      onEndReached={onEndReached.bind(this)}
    />
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
// const MainScreen = ({ navigation }) => {
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

// export default MainScreen;
