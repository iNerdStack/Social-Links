import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Layout, Text } from "@ui-kitten/components";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "../components/Loading";
import { GlobalContext } from "../src/GlobalProvider";

export default function MainScreen({ navigation }) {
  const isFocused = useIsFocused();
  const { ListLimit } = useContext(GlobalContext);
  const [LastVisible, setLastVisible] = useState({});
  const [groups, setGroups] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [
    onEndReachedCalledDuringMomentum,
    setonEndReachedCalledDuringMomentum,
  ] = useState(true);

  const LoadMoreGroups = () => {
    firebase
      .firestore()
      .collection("GROUPS")
      .orderBy("createdAt", "desc")
      .startAfter(LastVisible.createdAt)
      .limit(ListLimit)
      .get()
      .then((docRef) => {
        if (docRef.docs.length >= 1) {
          setLastVisible(docRef.docs[docRef.docs.length - 1].data());

          const moregroups = docRef.docs.map((document) => {
            return {
              _id: document.id,
              name: "",
              ...document.data(),
            };
          });

          //Sort and check for duplicate data if re-rendering
          let groupMap = new Set(groups.map((d) => d._id));
          let updatedGroupList = [
            ...groups,
            ...moregroups.filter((d) => !groupMap.has(d._id)),
          ];

          setGroups(updatedGroupList);
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

  const loadGroup = () => {
    firebase
      .firestore()
      .collection("GROUPS")
      .orderBy("createdAt", "desc")
      .limit(ListLimit)
      .get()
      .then((docRef) => {
        if (docRef.docs.length >= 1) {
          setLastVisible(docRef.docs[docRef.docs.length - 1].data());
        }
        const groupsData = docRef.docs.map((document) => {
          return {
            _id: document.id,
            name: "",
            ...document.data(),
          };
        });

        //Sort and check for duplicate data if re-rendering
        let mapNewGroupData = new Set(groupsData.map((d) => d._id));
        let mergedData = [
          ...groupsData,
          ...groups.filter((d) => !mapNewGroupData.has(d._id)),
        ];
        setGroups(mergedData);

        if (loading) {
          setLoading(false);
        }
      });
  };
  useEffect(() => {
    return () => loadGroup();
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadGroup();
    }
  }, [isFocused]);

  if (loading) {
    return <Loading />;
  }

  // ...rest of the component

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={({ item, index, key }) => (
          <TouchableWithoutFeedback
            key={item._id}
            onPress={() => {
              navigation.navigate("Room", { group: item });
            }}
          >
            <Layout style={styles.GridViewContainer} level="1">
              <Image
                style={styles.imageThumbnail}
                source={require("../assets/img/group.png")}
              />
              <Text style={{ marginTop: 10, textAlign: "center" }}>
                {item.name}
              </Text>
            </Layout>
          </TouchableWithoutFeedback>
        )}
        //Setting the number of column
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={ListLimit}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={() => {
          setonEndReachedCalledDuringMomentum(false);
        }}
        onEndReached={onEndReached.bind(this)}
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
