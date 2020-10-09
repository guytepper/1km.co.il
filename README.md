<h3 align="center"><a href="https://1km.co.il">One Kilometer</a></h3>
<p align="center">
Fighting for democracy during lockdown.<br>
</p>

<p align="center" >
<b>  We're looking for maintainers to help lead the project, <br/>see <a href="https://github.com/guytepper/1km.co.il/issues/22">#22</a> for details.</b>
</p>

<hr/>

## Welcome to 1km

Something bad is happening in Israel, and we cannot afford to stand still. We've got to React.

## Introduction

- A solid knowledge of (and a desire to) React is recommended before dwelling into the code.
- [Firebase](https://firebase.google.com/) is here to keep our the data and host our assets.
- We color our protest signs with [`styled-components`](https://styled-components.com/).
- Map is generated with Leaflet using [`react-leaflet`](https://react-leaflet.js.org/).

## Installation

- Fork the repository.
- Install dependencies using `yarn install`
- Start coding!

## Advanced Installation

If you want to tinker with the database, view the UI & set up security rules, you need to get your own firebase project.

- Go to the [firebase console](https://console.firebase.google.com) and create a new project. Call it whatever you want.
- Add a new web app from the dashboard, by clicking the </> icon.
- Give it whatever name you want. No need for hosting.
- Set up the enviorment to work with your project:  
  Inside the project directory, `cp .env .env.local` and fill the `REACT_APP_FIREBASE_*` variables with the firebase configuration being shown.
- Go back to firebase dashboard and select **Cloud Firestore** from the sidebar. Click **Create Database**, start in test mode, and press enable.

<hr/>

Got an installation issue, want to bring up your ideas or just up for a chat? Join our [discord channel](https://discord.gg/VuzxwKN).
