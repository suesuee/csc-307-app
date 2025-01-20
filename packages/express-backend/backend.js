//backend.js
import express from "express";

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

/* findUserByName(name) returns an array of user objects matching the name.
You wrap that array in an object with a key users_list because the API response 
format consistently uses users_list as the key for arrays of users. */
app.get("/users", (req, res) => {
  //   res.send(users);
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

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
  addUser(userToAdd);
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/*
GET all users: curl http://localhost:8000/users

curl -X POST http://localhost:8000/users \
-H "Content-Type: application/json" \
-d '{"id":"qwe123","name":"Cindy","job":"Zookeeper"}'
*/