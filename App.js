import React, { useState, createContext, useContext } from "react";
import * as eva from "@eva-design/eva";
import * as Font from "expo-font";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { AppLoading } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./screens/NavigationContainer";
import { default as theme } from "./theme/theme.json";
import { default as customMapping } from "./theme/mapping.json";
import { mapping, light, dark } from "@eva-design/eva";
import { AuthProvider } from "./src/AuthProvider";
import { GlobalProvider } from "./src/GlobalProvider";
import { firebaseSvc } from "./src/firebaseSvc.js";

const themes = { light, dark };

// const strictTheme = {
//   "text-font-family": "PoppinsRegular",

//   "text-heading-1-font-size": 36,
//   "text-heading-1-font-weight": "800",
//   "text-heading-1-font-family": "PoppinsBold",

//   // Same for `h2...h6`

//   "text-subtitle-1-font-size": 15,
//   "text-subtitle-1-font-weight": "600",
//   "text-subtitle-1-font-family": "PoppinsSemiBold",
//   // Same for `s2`

//   "text-paragraph-1-font-size": 15,
//   "text-paragraph-1-font-weight": "400",
//   "text-paragraph-1-font-family": "PoppinsRegular",
//   // Same for `p2`

//   "text-caption-1-font-size": 12,
//   "text-caption-1-font-weight": "400",
//   "text-caption-1-font-family": "PoppinsRegular",
//   // Same for `c2`

//   "text-label-font-size": 12,
//   "text-label-font-weight": "800",
//   "text-label-font-family": "PoppinsBold",
// };

// const customMapping = { strict: strictTheme };

const getFonts = () =>
  Font.loadAsync({
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
    PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
    PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

//const [theme, setThemes] = React.useState("light");

export default function App() {
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const [FontsLoaded, SetFontsLoaded] = useState(false);
  if (FontsLoaded) {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <SafeAreaProvider>
          <ApplicationProvider
            {...eva}
            mapping={mapping}
            customMapping={customMapping}
            theme={{ ...eva.light, ...theme }}
          >
            <GlobalProvider>
              <AuthProvider>
                <Navigation toggleTheme={toggleTheme} />
              </AuthProvider>
            </GlobalProvider>
          </ApplicationProvider>
        </SafeAreaProvider>
      </>
    );
  } else {
    return (
      <AppLoading startAsync={getFonts} onFinish={() => SetFontsLoaded(true)} />
    );
  }
}

// import React from "react";
// import * as eva from "@eva-design/eva";
// import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";

// const HomeScreen = () => (
//   <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//     <Text category="h1">HOMs</Text>
//   </Layout>
// );

// export default () => (
//   <ApplicationProvider {...eva} theme={eva.light}>
//     <HomeScreen />
//   </ApplicationProvider>
// );

// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
