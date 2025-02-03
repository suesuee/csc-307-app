//backend.js
import express from "express";
import cors from "cors";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const app = express();
const port = 8000;

app.use(cors()); // Enable CORS
app.use(express.json());

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) => {
  return users["users_list"].find((user) => user["id"] === id);
};

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const removeUserById = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index !== -1) {
    const removed = users["users_list"].splice(index, 1);
    console.log("Updated users_list:", users["users_list"]);
    return removed[0];
  }
  return null;
};

const findUserbyNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

function generateRandomId() {
  return Math.random().toString(36).slice(2, 8);
  // skip the first two characters (0.)
  // because they are not useful for the ID.
  // Math.random() - Generates a random number between 0 (inclusive) and 1 (exclusive).
  // Eg. a3v8k9jqe
}

/* findUserByName(name) returns an array of user objects matching the name.
You wrap that array in an object with a key users_list because the API response 
format consistently uses users_list as the key for arrays of users.
http://localhost:8000/users?name=Mac */
// app.get("/users", (req, res) => {
//   //   res.send(users);
//   const name = req.query.name;
//   if (name != undefined) {
//     let result = findUserByName(name);
//     result = { users_list: result };
//     res.send(result);
//   } else {
//     res.send(users); // when no query params, return all users
//   }
// });

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; // or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found");
  } else {
    // result = { users_list: result }; -> {"users_list":{"id":"zap555","name":"Dennis","job":"Bartender"}}
    res.send(result);
  }
});

// tested with curl
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateRandomId();
  addUser(userToAdd);
  res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const removedUser = removeUserById(id);
  if (removedUser === null) {
    res.status(404).send(`Resource not found to delete the user id: ${id}.`);
  } else {
    res.status(204).send();
  }
});

/* http://localhost:8000/users?name=Mac&job=Bouncer */
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  if (name && job) {
    const result = findUserbyNameAndJob(name, job);
    res.send({ users_list: result });
  } else if (name) {
    const result = findUserByName(name);
    res.send({ users_list: result });
  } else {
    res.send(users); // when no query params, return all users
  }
});

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
