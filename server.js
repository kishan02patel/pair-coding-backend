const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const app = express();
const { PORT } = require("./config/config");
const { userRouter } = require("./controllers/users");
const passport = require("passport");
const CodeSession = require("./models/codeSession");
const path = require("path");

// Keep all the active socket namespace and their database object id in an object.
const activeSockets = {};

// After how many keystrokes the data should be saved to database.
const keystrokes = 5;

// Connect to Database
require("./config/db-config");

app.use(cors());
app.use(express.json());

//Passport middleware
app.use(passport.initialize());
//Passport config
require("./helpers/authentication/passport")(passport);

// User routes
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to pair-coding");
});

/*
	This function will genearte a random string and send that string to the client. The function will create a new socket namespace with the randomly generated string as its name.
*/
app.get(
  "/getSessionURL",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Generate a random string which will be used for socket namespace.
    const url = Math.random()
      .toString(36)
      .substring(2);
    console.log("New socket URL is", url);

    // Create a new socket namespace
    var newSocket = io.of(url);
    newSocket.on("connection", socket => {
      console.log("Someone connected with socket id", socket.id);

      // Add the user details to database.
      createDatabaseEntry(socket);

      // Event listener to listen to the data send by the client.
      socket.on("SEND_MESSAGE", data => {
        // Send the data to other clients except the sender
        socket.broadcast.emit("RECEIVE_MESSAGE", data);

        // Increase the char count after every request.
        activeSockets[socket.nsp.name].charCount++;

        // Update the code stored in the activeSockets object.
        activeSockets[socket.nsp.name].code = data;

        // If the number of changed characters for that particular socket namespace is 5 then save it to database.
        if (activeSockets[socket.nsp.name].charCount % keystrokes === 0) {
          const newData = {
            language: activeSockets[socket.nsp.name].language,
            code: data
          };
          CodeSession.findByIdAndUpdate(
            activeSockets[socket.nsp.name].DB_ID,
            { $push: { data: newData } },
            { new: true }
          )
            .then(() => {})
            .catch(err => console.log("Error in saving", err));
        }
      });

      // Event listener to listen to client if they changed the language settings.
      socket.on("CHANGED_LANGUAGE", data => {
        // Send this change to other clients except the sender.
        socket.broadcast.emit("RECEIVE_NEW_LANGUAGE", data);

        // Change the language set for that socket namespace which will be used while saving data to database.
        activeSockets[socket.nsp.name].language = data;
      });

      // Event listener to listen to request when the user is going to leave the session.
      socket.on("LEAVE_SESSION", () => {
        // Count number of clients connected to a particular socket namespace.
        newSocket.clients((error, clients) => {
          // If the there is only one user connected then delete the socket namespace because that user has sent the leave session message and after this message he/she will close the connection.
          if (clients.length <= 1) {
            deleteSocketNamespace(newSocket);
          }
        });
      });
    });
    // Wait till the socket is created and then only send the response else the client will try to connect to a socket that dont exist yet.
    res.send({ url });
  }
);

// Check whether the socket namespace user wants to connect exists or not.
app.get(
  "/checkSocketExists",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get all the socket namespaces that are currently active.
    const socketsArray = Object.keys(io.nsps);
    if (socketsArray.includes("/" + req.query.url))
      res.send({ isSocketPresent: true });
    else res.send({ isSocketPresent: false });
  }
);

function deleteSocketNamespace(socket) {
  console.log(`Deleting ${socket.name} socket namespace`);
  // Get Object with Connected SocketIds(clients who are connected) as properties
  const connectedNameSpaceSockets = Object.keys(socket.connected);

  // It will run just once as there is only one user connected. Manually disconnecting the client.
  connectedNameSpaceSockets.forEach(socketId => {
    // Disconnect Each socket(client)
    socket.connected[socketId].disconnect();
  });

  // Remove all Listeners for the event emitter
  socket.removeAllListeners();

  // Remove the socket namespace from activeSockets object.
  delete activeSockets[socket.name];
  console.log(activeSockets);

  // Remove from the server namespaces
  delete io.nsps[socket.name];
}

/*
	This function will create a new entry in database for each session.
	If a user joins the current session then the database entry will update to include that user.
*/
function createDatabaseEntry(socket) {
  // If there is only one person in the socket then create a new entry in database for that session.
  if (Object.keys(socket.nsp.connected).length === 1) {
    const object = {
      users: [
        {
          // get the user details sent from client during socket connection.
          userId: socket.handshake.query.userId,
          name: socket.handshake.query.name
        }
      ],
      // Set data initially to empty
      data: [],
      // Set the session id to the namespace of the socket.
      sessionId: socket.nsp.name
    };
    // console.log(object)
    const newCodeSession = new CodeSession(object);
    newCodeSession
      .save()
      .then(response => {
        // Add the socket namespace and set its value to the database object id so that later it can be modified.
        activeSockets[socket.nsp.name] = {
          DB_ID: response._id,
          charCount: 0,
          language: "javascript",
          code: ""
        };
        // console.log(activeSockets)
      })
      .catch(err => console.log(err));
  }
  // If the database entry is already created and a new user joins in.
  else {
    CodeSession.findOneAndUpdate(
      { _id: activeSockets[socket.nsp.name]["DB_ID"] },
      {
        // Add the new user to the session object in database.
        $push: {
          users: {
            userId: socket.handshake.query.userId,
            name: socket.handshake.query.name
          }
        }
      },
      { new: true }
    )
      .then(session => {
        if (session) {
          // Once the user joins the session send that user the recent code data and language to keep that user updated.
          socket.emit("RECEIVE_MESSAGE", activeSockets[socket.nsp.name].code);
          socket.emit(
            "RECEIVE_NEW_LANGUAGE",
            activeSockets[socket.nsp.name].language
          );
        } else {
          console.log("No such code session exists");
        }
      })
      .catch(err => console.log(err));
  }
}

server = app.listen(PORT, () => {
  console.log("Server started on port:", PORT);
  io = socket(server);
});
