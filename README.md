# React F1 Companion

## Overview
This React F1 Companion is my first attempt at building a React application. It aims to enhance the Formula 1 experience by providing additional details not typically available in race broadcasts. Users can view live sessions as well as past sessions from 2023 onwards. All race data is sourced from the [Openf1](https://openf1.org/) API.

![App Demo](./assets/app-demo-480.gif)

### Features

- **Race Map:** Visual representation of the race track with real-time positions of the cars.
- **Timing Board:** Live timing information including lap times, sector times, and overall race standings.
- **Race Control:** Updates on race incidents, penalties, and other race control messages.
- **Team Radio:** Access to team radio communications between drivers and their teams.
- **Settings:** Set the frequency in which each end point of the api is called during live sessions to reduce large amounts of unecessary api calls

## Installation

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) 

To get started with the React F1 Companion, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/andydean27/react-f1-companion.git
    cd react-f1-companion
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the development server:**
    ```bash
    npm start
    ```

4. **Open the app in your browser:**
    Navigate to `http://localhost:3000` to see the app in action.

## Contributing
If you would like to contribute to the project, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.