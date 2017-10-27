#Boardgame Finder 

Allows users to search for boardgames from a database using a variety of filters.
After creating a profile and logging in, users can add games to profile.
Users can track personal gameplay experiences, edit and delete gameplay details or entire game from profile.
Users can share via social media.

## Admin API Documentation

#### https://calm-ridge-47266.herokuapp.com/api/boardgames
GET Request to this route will return a list of all the boardgames in the database with details. 
After authentication, POST Request to this route will allow admin to POST new boardgame to database. 

#### https://calm-ridge-47266.herokuapp.com/api/boardgames:boardgameid
GET Request to this route will return a single boardgame with details.
After authentication, PUT Request to this route will allow admin to EDIT details of a boardgameid. 
After authentication DELETE Request to this route will allow admin to DELETE a boardgameid. 

## User API Documentation

#### https://calm-ridge-47266.herokuapp.com/api/boardgames
GET Request to this route will return a list of all the boardgames in the database with details. 
POST Request to this route will allow users to create a user profile. 

#### https://calm-ridge-47266.herokuapp.com/api/boardgames:boardgameid
GET Request to this route will return a single boardgame with details.

#### https://calm-ridge-47266.herokuapp.com/api/boardgameid/selectedgames
<!-- POST Request to this route will allow users to  -->

#### https://calm-ridge-47266.herokuapp.com/api/boardgameid/usergames
POST Request to this route will allow users to add selected game to profile.

#### https://calm-ridge-47266.herokuapp.com/api/userid/game/gameid
After authentication, PUT Request to this route will allow users to edit personal gameplay details


##Summary
This API returns data of boardgames to users. Users can filter boardgames, create profile and track personal gameplay details such as number of players, time spent playing, personal rating of game. After authentication, users can edit and delete recorded details in profile.

##Technology
This app uses Javascript, Node.js, Express, Passport Authentication, bCrypt, Mongo and Mongoose nonrelational database.
<!-- to add react/redux front end --># boardgameFinder
