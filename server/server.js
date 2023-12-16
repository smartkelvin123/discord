const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();

const socketServer = require("./socketServer");
const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
app.use(express.json());
app.use(cors());

// register the routes
app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);

const server = http.createServer(app);
socketServer.registerSocketServer(server);

mongoose
  .connect(process.env.MONGO_URI, {})
  .then((conn) => {
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );

    // Start the server after MongoDB connection is established
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`.cyan.underline.bold);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    // Terminate the server if the MongoDB connection fails
    process.exit(1);
  });

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     server.listen(PORT, () => {
//       console.log(`Server is listening on ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("database connection failed. Server not started");
//     console.error(err);
//   });
