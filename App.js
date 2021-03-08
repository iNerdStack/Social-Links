import React, { useState, createContext, useContext } from "react";
import * as eva from "@eva-design/eva";
import * as Font from "expo-font";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { AppLoading } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./Navigators/WelcomeStack";
import { default as theme } from "./theme/theme.json";
import { default as customMapping } from "./theme/mapping.json";
import { mapping, light, dark } from "@eva-design/eva";
import { AuthProvider } from "./src/AuthProvider";
import { GlobalProvider } from "./src/GlobalProvider";
import { firebaseSvc } from "./src/firebaseSvc.js";

const themes = { light, dark };

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
