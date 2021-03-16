const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.APP_PORT;
const host = process.env.APP_HOST;

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const { InMemoryGameRoomStore } = require("./gameRoomStore");
const { GameRoomController } = require("./gameRoomController");
const gameRoomStore = new InMemoryGameRoomStore();


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // join the "user ID" room
  socket.join(socket.userID);

  socket.on("create_game_room", () => {
    console.log("room created");
    const gameRoomId = randomId();
    socket.join(gameRoomId);
    console.log(socket.userID);
    console.log(socket.rooms);
    gameRoomStore.createGameRoom(gameRoomId, {
      gameRoomId: gameRoomId,
      createdBy: socket.userID,
      gameroomController: new GameRoomController(),
    });

    gameRoomStore
      .findGameRoom(gameRoomId)
      .gameroomController.addPlayer(socket.userID);
    io.emit("game_room", gameRoomStore.findAllGameRoom());
  });

  socket.on("join_game_room", (gameRoomId) => {
    var playersInRoom = [];
    console.log("Game Room joined");
    gameRoomStore
      .findGameRoom(gameRoomId)
      .gameroomController.addPlayer(socket.userID);

    socket.join(gameRoomId);

    console.log(socket.userID);
    console.log(socket.rooms);

    var roster = io.sockets.adapter.rooms.get(gameRoomId);

    roster.forEach(function (clientID) {
      console.log("UserID: " + clientID);

      const clientSocket = io.sockets.sockets.get(clientID);
      console.log("Username: " + clientSocket.username);
      playersInRoom.push({
        clientID: clientSocket.userID,
        username: clientSocket.username,
      });
    });
    io.to(gameRoomId).emit("game_room_players", playersInRoom);
  });

  socket.on("distribute_cards", (gameRoomId) => {
    console.log("Distribute cards");
    var cardsToDistribute = gameRoomStore
      .findGameRoom(gameRoomId)
      .gameroomController.distributeCard();

    var roster = io.sockets.adapter.rooms.get(gameRoomId);
    console.log("Roster", roster);

    var i = 0;
    //roster is set
    for (let item of roster) {
      io.to(item).emit("cards_to_play", cardsToDistribute[i]);
      i++;
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

http.listen(port, () => {
  console.log(`listening on http://${host}:${port}`);
});
