//backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-service.js";

// Load env vars from .env file
dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env; // Read connection string from .env
console.log("Connecting to MongoDB with:", MONGO_CONNECTION_STRING); // Debugging step
// Set up mongoose connection
mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

const app = express();
const port = 8000;

app.use(cors()); // Enable CORS
app.use(express.json());

/* findUserByName(name) returns an array of user objects matching the name.
You wrap that array in an object with a key users_list because the API response 
format consistently uses users_list as the key for arrays of users.
http://localhost:8000/users?name=Mac */
// GET /users (Fetch users with optional query parameters)
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  userService
    .getUsers(name, job)
    .then((users) => res.json({ users_list: users }))
    .catch((error) => res.status(500).send("Error fetching users: " + error));
});

// GET /users/:id (Fetch user by ID)
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; // or req.params.id

  userService
    .findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Resource not found.");
      } else {
        res.json(user);
      }
    })
    .catch((error) => res.status(500).send("Error fetching user: " + error));
});

// POST /users (Add a new user)
app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((user) => res.status(201).json(user))
    .catch((error) => res.status(400).send("Error adding user: " + error));
});

// DELETE /users/:id (Remove user by ID)
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .deleteUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send(`Resource not found to delete user id: ${id}`);
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => res.status(500).send("Error deleting user: " + error));
});

// /* http://localhost:8000/users?name=Mac&job=Bouncer */
// app.get("/users", (req, res) => {
//   const { name, job } = req.query;

//   if (name && job) {
//     const result = findUserbyNameAndJob(name, job);
//     res.send({ users_list: result });
//   } else if (name) {
//     const result = findUserByName(name);
//     res.send({ users_list: result });
//   } else {
//     res.send(users); // when no query params, return all users
//   }
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/*
GET all users: curl http://localhost:8000/users

DELETE a user by id: curl -X DELETE http://localhost:8000/users/abc123

curl -X POST http://localhost:8000/users \
-H "Content-Type: application/json" \
-d '{"id":"qwe123","name":"Cindy","job":"Zookeeper"}'
*/
