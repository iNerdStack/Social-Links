# Social Links

![Social Links](https://i.imgur.com/ovOFP33.jpg)
An Open Source Chat Application Built-In **React Native & Firebase** for Android & iOS. 


## UI/UX Design
-  Figma: [https://www.figma.com/file/3hPgGSTJN1rhsgz0oXYfeT/Social-Links](https://www.figma.com/file/3hPgGSTJN1rhsgz0oXYfeT/Social-Links)

## Technologies
- React Native (Expo)
- Google Firestore
-   [UI Kitten](https://akveo.github.io/react-native-ui-kitten/) (UI Framework)
- [React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat) (Chat Rendering)

## App Screens
- Welcome/SplashScreen
- Login Screen
- Sign Up Screen
- Recent Chats Screen
- Search Screen
- Chat Screen
- Create Group Screen
- Groups Screen
- Group Screen

# Installation
## Firestore Database
1. Create a new project in firebase 
2.  Create firestore database
3. Replace database security rules with content in file located at`Firestore Rules` > `social-links.rules`and publish
4.  Add a composite index with the values below
![Composite Index](https://i.imgur.com/HsMctQZ.jpg)

![Database Index](https://i.imgur.com/2r9y6Mn.jpg)


## App Setup
  
 - `git clone https://github.com/iNerdStack/Social-Links.git`
 
 -    `cd Social-Links`
 
 -   Rename `src` > `firebaseSvc.example.js` to `firebaseSvc.js`
 -  Open file and replace `firebaseConfig` information with your web app's Firebase configuration
 -  run `npm install`
 
 - `npm start`

> Please Note: Delete apk & firestore rules folders in project before building app

## App Customization
> ### APP NAME 
 - Change app name and package name from `app.json` in root folder
 - Replace icons in `assets` folder
 
 > ### APP COLOR SCHEME
 - Generate your theme color at [Eva Design System](https://colors.eva.design/) and export data as JSON
 - Rename the JSON downloaded from `custom-theme.json` to `theme.json`
 - Replace `theme` > `theme.json` with the JSON file you generated

 
 > ### APP FONT
- Copy new fonts into `assets`> `fonts`
- Locate the code block below in `App.js` and replace fonts file names with your new font names

```js
const getFonts = () =>

Font.loadAsync({

PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),

PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),

PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),

PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),

PoppinsSemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),

});
```

- Rename theme also in `theme` > `mapping.json`

## App Demo
>  A demo appication is available in `apk` folder,  download and install to try app demo

## License
- MIT

## Author

Feel free to reach out and also ask questions on Twitter  [@Nerd_Stack](https://www.twitter.com/Nerd_Stack)! 
