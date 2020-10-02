<h3 align="center"><a href="https://1km.co.il">One Kilometer</a></h3>
<p align="center">
Fighting for democracy during lockdown.<br>
<a href="https://discord.gg/P8uSsrR">join our discord server</a>
</p>

<hr/>

## Welcome to 1km

The times.. they are a-changin'.  
Something bad is happening in Israel, and we can't allow ourselves to stand still.  We've got to react.

## Introduction

- A solid knowledge of (and a desire to) React is recommended before dwelling into the code.
- [Firebase](https://firebase.google.com/) is here to keep our the data and host our assets.  
- We color our protest signs with [`styled-components`](https://styled-components.com/).  
- Map is generated with Leaflet using [`react-leaflet`](https://react-leaflet.js.org/).

## Installation

- Fork the repository.
- Install dependencies using `yarn install`

### Create a Firebase project

- Go to the [firebase console](https://console.firebase.google.com) and create a new project. Call it whatever you want.
- Add a new web app from the dashboard, by clicking the </> icon.
- Give it whatever name you want. No need for hosting.
- Set up the enviorment to work with your project:  
  Inside the project directory, `cp .env .env.local` and fill the `REACT_APP_FIREBASE_*` variables with the firebase configuration being shown.
- Go back to firebase dashboard and select **Cloud Firestore** from the sidebar. Click **Create Database**, start in test mode, and press enable.

### Google Maps API key

We are using Google's Places Autocomplete & Geolocation APIs on the `PlacesAutocomplete` component. You need to [get a Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) for them to work.

After getting one, add it to `REACT_APP_GOOGLE_MAPS_API_KEY` inside `.env.local` file.

> Note: Please help us [find an alternative API provider](https://github.com/guytepper/1km.co.il/issues/6) for those services.

## Add protests

Adding protests for development is be a bit cumbersome currently. We'll improve the flow as we go.

- First, remove all things related to Recaptcha. It's in the [API file](https://github.com/guytepper/1km.co.il/blob/master/src/api/index.js#L30-L32) and in the `ProtestForm` component (in the form component search for all references to `recaptcha` and make sure they don't get along in the flow).
- Change `pending_protests` collection to `protests` [in the createProtest function](https://github.com/guytepper/1km.co.il/blob/master/src/api/index.js#L34).
- Add a protest from `/add-admin` 🤗

<hr/>

Got an installation issue, want to bring up your ideas or just up for a chat? Join our [discord channel](https://discord.gg/P8uSsrR).
