import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Layout, Icon, Text, Card, Avatar } from "@ui-kitten/components";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "../components/Loading";
import { GlobalContext } from "../src/GlobalProvider";

export default function MenuScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const globalcontext = useContext(GlobalContext);

  useEffect(() => {
    let allthreads = [
      {
        _id: 1,
        name: "Create Group",
        group: true,
      },
    ];

    setThreads(allthreads);
    const unsubscribe = firebase
      .firestore()
      .collection("THREADS")
      // .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const threadsData = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: "",
            ...documentSnapshot.data(),
          };
        });

        allthreads = [];
        allthreads = [
          {
            _id: 1,
            name: "Create Group",
            group: true,
          },
        ];

        setThreads(allthreads);
        allthreads = allthreads.concat(threadsData);
        // var obj = {};

        // //clear duplicates data on page re-run
        // for (var i = 0, len = allthreads.length; i < len; i++) {
        //   obj[allthreads[i]["_id"]] = allthreads[i];
        // }

        // allthreads = new Array();
        // for (var key in obj) {
        //   allthreads.push(obj[key]);
        // }

        setThreads(allthreads);

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
    <View style={styles.container}>
      <FlatList
        data={threads}
        renderItem={({ item, index, key }) => (
          <TouchableWithoutFeedback
            key={item._id}
            onPress={() => {
              if (item.group) {
                navigation.navigate("CreateGroup");
              } else {
                navigation.navigate("Room", { thread: item });
              }
            }}
          >
            <Layout style={styles.GridViewContainer} level="1">
              <Image
                style={styles.imageThumbnail}
                source={
                  index === 0
                    ? require("../assets/img/create-group.jpg")
                    : require("../assets/img/group.png")
                }
              />
              <Text style={{ marginTop: 10 }}> {item.name}</Text>
            </Layout>
          </TouchableWithoutFeedback>
        )}
        //Setting the number of column
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#f9fafc",
    height: 40,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  container: {
    backgroundColor: "#f9fafc",
    flex: 1,
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    margin: 2,
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
    height: 80,
    width: 80,
    borderRadius: 40,
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
