# MemeBattle

![logo.png](./src/components/img/logo.png)

<br>

## Introduction

Create the best Meme and win the game!

We were motivated to create MemeBattle to build a community-centric, interactive, creative and entertaining online game. With MemeBattle you can create hilarious memes, share them with your friends and competitors, and engage in friendly competition. By voting for your favorite meme of the round, all the users determine the ultimate winner. Whether you are an advanced meme-maker or just looking to enjoy a good laugh, MemeBattle offers you a space to express your creativity, to connect with others, and to celebrate the joy of memes. 

## Technologies Used
For the MemeBattle Webapplication we used the following technologies:

- Frontend Development: HMTL, CSS, React, Imgflip API
- Backend Development: Java, Springboot, RESTful API, Imgflip API
- Deployment and Hosting: Google Cloud and Docker
- Testing: Mockito and JUnit Tests
- CI/CD: GitHub Actions


## High-level components
1. #### Lobby 
    ###### Role
    The Lobby component serves as the central hub where users can gather, interact, and play a game. It manages the overall flow of the user experience and allows the LobbyOwner to change the GameSettings. It also allows every User to change his profilepicture and create memes.
    ##### Correlation
    The Lobby links all other components together. It ensures seamless transition and interaction between them.
    ##### Reference
    The main file for the Lobby component can be found at 'src/main/java/ch.uzh.ifi.hase.soprafs24/entity/Lobby' 
2. #### User
    ##### Role
    The User components handles the creation of a UserProfile and all related aspects to it. This includes user authentication, so that there cannot be username duplicates. Additionally, it also handles profilepictures and saves them for later display in the ranking screen.
    ##### Correlation
    The User Component communicates with the Lobby to display User informations and with the Meme Component to save the votes a User has earned for their created meme.  
    ##### Reference
    The main class for the User component is located in 'src/main/java/ch.uzh.ifi.hase.soprafs24/entity/User'
    
3. #### Meme
    ##### Role
    The Meme component is responsible for the creation and displaying of memes within the application. It handles all the meme-related functionalities such as creating a meme.
    ##### Correlation
    The Meme component interacts directly with the Lobby and the User component. It provides memes that users can interact with in the Lobby. It also tracks the votes from each user through the User component.
    ##### Reference
    the main functions for the Meme component are defined in 'src/main/java/ch.uzh.ifi.hase.soprafs24/controller/MemeController'




## Launch & Deployment
For your local development environment, you will need Node.js.\
We urge you to install the exact version **v20.11.0** which comes with the npm package manager. You can download it [here](https://nodejs.org/download/release/v20.11.0/).\
If you are confused about which download to choose, feel free to use these direct links:

- **MacOS:** [node-v20.11.0.pkg](https://nodejs.org/download/release/v20.11.0/node-v20.11.0.pkg)
- **Windows 32-bit:** [node-v20.11.0-x86.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x86.msi)
- **Windows 64-bit:** [node-v20.11.0-x64.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x64.msi)
- **Linux:** [node-v20.11.0.tar.xz](https://nodejs.org/dist/v20.11.0/node-v20.11.0.tar.xz) (use this [installation guide](https://medium.com/@tgmarinho/how-to-install-node-js-via-binary-archive-on-linux-ab9bbe1dd0c2) if you are new to Linux)

After the installation, update the npm package manager to **10.4.0** by running ```npm install -g npm@10.4.0```\
You can ensure the correct version of node and npm by running ```node -v``` and ```npm --version```, which should give you **v20.11.0** and **10.4.0** respectively.\
Before you start your application for the first time, run this command to install all other dependencies, including React:

```npm install```

Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.\

## Illustrations
##### Home Screen:
the user start at the Home Screen where they can choose between creating or joining a lobby. 

![homescreen](./homescreen.png) \
when the user chose to create a lobby, they only have to enter a username. If they chose to join a lobby they have to enter an username and a Lobby Join Code.

After successfully entering a lobby all users can choose their profilepicture and read the rules of MemeBattle.
The lobbyowner has in addition to that the possibility to select a GameMode, the creation time and the amount of rounds for that round.

![Lobbyscreen](./lobbyscreen.png)

Once there are between 3 and 8 players in the lobby the lobbyowner can start the game. Once the lobbyowner starts the game 

All users get a template of a meme. They have to enter texts into the textfields. 

![Editing](./editing.png)

Once the player is content with his texts and he did not run out of time he can submit the meme early. After either all users have submitted their memes or the time has run out all the users are directed to the Voting Screen.

![votingscreen](./votingscreen.png)

After every player has submitted their vote for their favorite meme of the round, all players get directed to the ranking screen which is showing the current ranking. 

![ranking](./ranking.png)

If all rounds have been played all users get to the winning screen. This displays the best meme of the winner, i.e. the meme from the winner that has gotten the most votes.


After the winning screen the players are encouraged to get back to the lobby and then play another round.
![winningscreen](./winningscreen.png)

During every stage of the game is the user able to leave the lobby and the user can also always click on the rules button to read the rules.

## Roadmap
MemeBattle currently consists of two GameModes. There are many more possible GameModes to implement. This could, for example, be a  GameMode where users can choose pictures from their own gallery as the template, allowing a more personalized and diverse MemeBattle experience. Another exciting option could be a GameMode where users could write a Topic themselves, prompting others to create memes based on those topics, fostering creativity and also a more personalized experience.


## Authors and acknowledgment
##### Authors
Jana Muheim, Marc Huber, Marc Amsler, Christof Steiner, Gian Seifert

##### Acknowledgment
We want to thank the UZH and Prof. Fritz for offering the SoPra module. Without this module MemeBattle most likely would'nt exist. Furthermore, we want to say a big thanks to our tutor Miro Vannini. With his important and well-thought inputs MemeBattle wouldn't be what it is today. 

## License
This project is licensed with Apache-2.0 license.