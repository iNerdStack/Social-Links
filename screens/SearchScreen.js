import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  Input,
  Icon,
  Layout,
  Spinner,
  Card,
  useTheme,
  Avatar,
  Divider,
  Select,
  SelectItem,
  IndexPath,
} from "@ui-kitten/components";
import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "../components/Loading";
import ProfileAvatar from "../components/Avatar";

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

function containsObject(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].word === obj.word && list[i].type === obj.type) {
      return true;
    }
  }

  return false;
}

export default function SearchScreen({ navigation }) {
  const theme = useTheme();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [showSearchHistory, setshowSearchHistory] = useState(true);
  const [searchHistory, setsearchHistory] = useState(null);
  const [EmptyResults, setEmptyResults] = useState(false);
  const [searchTypeIndex, setSearchTypeIndex] = useState(new IndexPath(0));
  const [searchType, setSearchType] = useState("Users");
  const { showAlert, ListLimit, updateHelper } = useContext(GlobalContext);
  const [isloading, setIsloading] = useState(false);
  const { username } = useContext(AuthContext);
  const updatePage = updateHelper();
  const [
    onEndReachedCalledDuringMomentum,
    setonEndReachedCalledDuringMomentum,
  ] = useState(true);

  const onEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      //Load More Groups
      //LoadMoreGroups();
      setonEndReachedCalledDuringMomentum(true);
    }
  };

  useEffect(() => {
    const getSearches = async () => {
      try {
        const getValue = await AsyncStorage.getItem("@searches");
        if (getValue != null) {
          setsearchHistory(JSON.parse(getValue));
          initSearchHistory = searchHistory;
        } else {
          let empty = [];
          setsearchHistory(empty);
        }
      } catch (e) {
        // error reading value
      }
    };
    getSearches();
  }, []);

  const clearAllSearches = async () => {
    try {
      await AsyncStorage.removeItem("@searches");
      setsearchHistory([]);
    } catch (e) {
      // saving error
    }
  };

  const deleteSearch = async (index) => {
    let searchState = searchHistory;
    if (searchHistory.length <= 1) {
      clearAllSearches();
      return;
    } else {
      searchState.splice(index, 1);
      let value = JSON.stringify(searchState);
      try {
        await AsyncStorage.setItem("@searches", value);
        setsearchHistory(searchState);
        //reload the list
        updatePage();
      } catch (e) {
        // console.log(e);
        //error removing search from list
      }
    }
  };
  const storeSearch = async (word, type) => {
    if (searchHistory === null) {
      let empty = [];
      setsearchHistory(empty);
    }

    let searchState = searchHistory;

    let data = { word, type };

    if (!containsObject(data, searchState)) {
      searchState.unshift(data);

      //add unique id to list
      for (let i = 0; i < searchState.length; i++) {
        searchState[i].id = i;
      }
      //allow only 5 search history
      if (searchState.length > 5) {
        searchState.length = 5;
      }

      let value = JSON.stringify(searchState);

      try {
        await AsyncStorage.setItem("@searches", value);
        setsearchHistory(searchState);
      } catch (e) {
        // saving error
      }
    }
  };

  const SearchKeyword = () => {
    if (keyword != "") {
      setshowSearchHistory(false);
      setEmptyResults(false);
      setIsloading(true);

      if (searchType === "Users") {
        setSearchTypeIndex(new IndexPath(0));
        storeSearch(keyword, "Users");
        firebase
          .firestore()
          .collection("USERS")
          .where("username", ">=", keyword.toLowerCase().replace(" ", ""))
          .where(
            "username",
            "<=",
            keyword.toLowerCase().replace(" ", "") + "\uf8ff"
          )
          .limit(ListLimit)
          .get()
          .then((docRef) => {
            const users = docRef.docs.map((document) => {
              return {
                _id: document.id,
                ...document.data(),
              };
            });

            if (users.length === 0) {
              setEmptyResults(true);
            }
            setResults(users);

            setIsloading(false);
          })
          .catch((error) => {
            setIsloading(false);
          });
      } else if (searchType === "Groups") {
        setSearchTypeIndex(new IndexPath(1));
        storeSearch(keyword, "Groups");

        firebase
          .firestore()
          .collection("GROUPS")
          .where("name", ">=", keyword)
          .where("name", "<=", keyword + "\uf8ff")
          .limit(ListLimit)
          .get()
          .then((docRef) => {
            const groups = docRef.docs.map((document) => {
              return {
                _id: document.id,
                // give defaults
                ...document.data(),
              };
            });

            if (groups.length === 0) {
              setEmptyResults(true);
            }

            setResults(groups);
            setIsloading(false);
          })
          .catch((error) => {
            setIsloading(false);
          });
      }
    } else {
      setEmptyResults(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Layout
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        <Layout style={{ margin: 35 }}>
          <Text category="h2" style={{ color: theme["color-info-600"] }}>
            Search
          </Text>
          <Layout
            style={{
              flexDirection: "row",
              marginTop: 20,
              borderBottomColor: "blue",
              borderBottomWidth: 1,
            }}
          >
            <Input
              accessoryLeft={SearchIcon}
              style={{ flex: 1 }}
              value={keyword}
              placeholder="Search..."
              onChangeText={(text) => {
                setKeyword(text);
              }}
              onBlur={() => {
                SearchKeyword();
              }}
            />
            <Select
              style={{
                width: 130,
              }}
              selectedIndex={searchTypeIndex}
              value={searchType}
              onSelect={(index) => {
                setSearchTypeIndex(index);
                if (index.row === 0) {
                  setResults([]);
                  setSearchType("Users");
                } else if (index.row === 1) {
                  setResults([]);
                  setSearchType("Groups");
                }
              }}
            >
              <SelectItem title="Users" />
              <SelectItem title="Groups" />
            </Select>
          </Layout>
          {showSearchHistory ? (
            <Layout style={{ marginHorizontal: 4, marginTop: 20 }}>
              <Layout
                style={{
                  height: 40,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text category="label" style={{ fontSize: 17 }}>
                  Recent search
                </Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    clearAllSearches();
                  }}
                >
                  <Text style={{ color: theme["color-info-600"] }}>
                    Clear All
                  </Text>
                </TouchableWithoutFeedback>
              </Layout>
              <Layout>
                {searchHistory != null ? (
                  <FlatList
                    data={searchHistory}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index, key }) => (
                      <Layout>
                        <Layout
                          style={{
                            marginBottom: 22,
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <TouchableWithoutFeedback
                            onPress={() => {
                              setKeyword(item.word);
                              setSearchType(item.type);
                              SearchKeyword();
                            }}
                          >
                            <Layout style={{ flexDirection: "row" }}>
                              {item.type === "Users" ? (
                                <Icon
                                  fill="grey"
                                  name="person-outline"
                                  style={{
                                    width: 18,
                                    height: 18,
                                    marginRight: 4,
                                  }}
                                />
                              ) : (
                                <Icon
                                  fill="grey"
                                  name="people-outline"
                                  style={{
                                    width: 18,
                                    height: 18,
                                    marginRight: 4,
                                  }}
                                />
                              )}

                              <Text>{item.word}</Text>
                            </Layout>
                          </TouchableWithoutFeedback>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              deleteSearch(index);
                            }}
                          >
                            <Icon
                              fill="grey"
                              name="close-outline"
                              style={{ width: 20, height: 20 }}
                            />
                          </TouchableWithoutFeedback>
                        </Layout>
                      </Layout>
                    )}
                  />
                ) : null}
              </Layout>
            </Layout>
          ) : null}

          <Layout style={{ height: "100%", marginTop: 30 }}>
            {!isloading && EmptyResults ? (
              <Layout
                style={{
                  minHeight: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  fill="grey"
                  name="alert-triangle"
                  style={{ width: 70, height: 80 }}
                />
                <Text category="c1" style={{ color: "grey", fontSize: 16 }}>
                  Opps, No Result Found
                </Text>
              </Layout>
            ) : null}
            {!isloading && !EmptyResults && searchType === "Users" ? (
              <FlatList
                data={results}
                // key={item.id}
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
                              marginHorizontal: -22,
                              flexDirection: "row",
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
            ) : null}

            {!isloading && !EmptyResults && searchType === "Groups" ? (
              <FlatList
                data={results}
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
            ) : null}

            {isloading ? (
              <Layout
                style={{
                  minHeight: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loading />
              </Layout>
            ) : null}
          </Layout>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    justifyContent: "center",
    zIndex: 1,
  },
  input: {
    fontSize: 18,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
    height: 40,
    borderWidth: 1,
    borderColor: "white",
    borderBottomColor: "#C0C0C0",
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    paddingVertical: 0,
    paddingLeft: 0,
    padding: 0,
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 90,
    height: 90,
    zIndex: 999,
  },
  submitButton: {
    borderRadius: 0,
    padding: 10,
    alignItems: "center",
    height: 60,
  },
  submitButtonText: {
    color: "white",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    margin: 2,
  },
  imageThumbnail: {
    resizeMode: "cover",
    height: 80,
    width: 80,
    borderRadius: 40,
  },
});
