 const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

const filePath = path.resolve("./users.json");

// functions
function readUsers() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeUsers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Question 1 - Signup
app.post("/signup", (req, res,next) => {
  const { email, password, id } = req.body;
  const users = readUsers();

  const findUser = users.find(u => u.email === email);

  if (findUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  users.push({ email, password, id });
  writeUsers(users);

  res.json({ message: "User added successfully" });
});

// Question 2 - Update email
app.patch("/user/:id", (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const users = readUsers();

  const findUser = users.find(u => String(u.id) === String(id));

  if (!findUser) {
    return res.status(404).json({ message: "User not found" });
  }

  findUser.email = email;
  writeUsers(users);

  res.json({ message: "Email updated" });
});

// Question 3 - Delete
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const users = readUsers();

  const index = users.findIndex(u => String(u.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ message: "User not exist" });
  }

  users.splice(index, 1);
  writeUsers(users);

  res.json({ message: "User deleted" });
});

// Question 4 - Get by name
app.get("/getbyname", (req, res) => {
  const { name } = req.query;
  const users = readUsers();

  const user = users.find(u => u.name === name);

  if (!user) {
    return res.json({ message: "User not found" });
  }

  res.json(user);
});

// Question 5 - Get all
app.get("/getall", (req, res) => {
  res.json(readUsers());
});

// Question 6 - Filter by age
app.get("/filter", (req, res) => {
  const minage = Number(req.query.minage);
  const users = readUsers();

  const result = users.filter(u => u.age > minage);

  if (result.length === 0) {
    return res.json({ message: "No users found" });
  }

  res.json(result);
});

// Question 7 - Get user by id
app.get("/getuser/:id", (req, res) => {
  const { id } = req.params;
  const users = readUsers();

  const user = users.find(u => String(u.id) === String(id));

  if (!user) {
    return res.status(404).json({ message: "User not exist" });
  }

  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});