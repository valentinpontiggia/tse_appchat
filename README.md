<a name="readme-top"></a>

<div align="center">
    <img src="https://cdn-icons-png.flaticon.com/512/1786/1786548.png" alt="Logo" width="170" height="170">
    <h3 align="center">ChatApp</h3>
    <p align="center">An easy way to chat with your friends !</p>
    <br />
</div>

<details>
    <summary>Table of Contents</summary>
    <ol>
        <li>
            <a href="#about-the-project">About The Project</a>
            <ul>
                <li><a href="#the-goal">The goal</a></li>
                <li><a href="#prerequisites">Prerequisites</a></li>
            </ul>
        </li>
        <li>
            <a href="#how-to-run-the-code">How to run the code</a>
        </li>
        <li>
            <a href="#features">Features</a>
        </li>
        <li>
            <a href="#authors">Authors</a>
        </li>
    </ol>
</details>

## About The Project

### The goal

The goal of this project is to create a chat application that allows chatting in your browser.

### Prerequisites

The user should have `nodejs` installed and some librairies that you can install with the following commands:
```
npm install express
```
```
npm install socket.io
```
```
npm install moment
```

## How to run the code ?

In order to run the app, you need to use the nodejs commmand prompt and be in the `tp3` folder, and run the command `node server.js`. Then go in your browser at the following address : http://localhost:3000/.

## Features

The user can chat in the predefined rooms, but cannot add more rooms. The user can start a private conversation with someone by clicking on the name of another user (note that you must click a bit below the name, else the click won't be detected [we don't know why]). The private messaging area is still full of bugs and problems (no avatar and no "is typing option"), but it is functionnal.
If you encounter a problem when using the chat, you can try restarting the local server and login again.

## Authors

Valentin Pontiggia
Matthieu d'Hoop

<p align="right">(<a href="#readme-top">back to top</a>)</p>
