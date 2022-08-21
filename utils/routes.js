const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Todo = require("../models/Todo");

function routes(app) {
  // SIGN UP routes
  app.post("/signup", (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    newUser.save((err) => {
      if (err) {
        return res.status(400).json({
          title: "Error",
          error: "Email already in use",
        });
      }
      return res.status(200).json({
        title: "User registered successfully",
      });
    });
  });

  //LOGIN routes
  app.post(`/login`, (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err)
        return res.status(500).json({
          title: "Server error",
        });
      if (!user) {
        return res.status(400).json({
          title: "User Not Found",
          error: "Invalid username or password",
        });
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          title: "Login failed",
          error: "Invalid username or password",
        });
      }

      // authentication is done provide a token
      let token = jwt.sign({ userId: user._id }, "secretkey");
      return res.status(200).json({
        title: "Login Successful",
        user: user,
        token: token,
      });
    });
  });

  // ADD TODOS routes
  app.post("/addTodo", (req, res) => {
    const newTodo = new Todo({
      todo: req.body.todo,
      completed: false,
      created_at: req.body.created_at,
      user_id: req.body.user_id,
    });
    newTodo.save((err, todo) => {
      if (err) {
        return res.status(400).json({
          title: "Error",
          error: "Todo not created",
        });
      }
      return res.status(200).json({
        title: "Todo added successfully",
        todo: todo,
      });
    });
  });

  // TO GET TODOSLIST OF A PARTICULAR USER
  app.get("/getTodos", (req, res) => {
    let userId = req.query.user_id;
    Todo.find({ user_id: userId }, (err, todos) => {
      if (err) {
        return res.status(400).json({
          title: "Error",
          error: "User not found",
        });
      }
      res.status(200).json({
        title: "Successfull",
        todos: todos.reverse(),
      });
    });
  });

  // TO EDIT A TODO OF PARTICULAR USER that is to mark done
  app.post(`/markDone`, (req, res) => {
    let todoId = req.body.todo_id;
    Todo.findByIdAndUpdate(todoId, { completed: true }, (err, todo) => {
      if (err) {
        return res.status(400).json({
          title: "Error",
          error: "Some error occurred",
        });
      }
      res.status(200).json({
        title: "Successfully Marked Done",
        todo: todo,
      });
    });
  });

  // TO EDIT A TODO OF PARTICULAR USER that is marked done to undone
  app.post(`/undoTodo`, (req, res) => {
    let todoId = req.body.todo_id;
    Todo.findByIdAndUpdate(todoId, { completed: false }, (err, todo) => {
      if (err) {
        return res.status(400).json({
          title: "Error",
          error: "Some error occurred",
        });
      }
      res.status(200).json({
        title: "Successfully Undone",
        todo: todo,
      });
    });
  });

  // TO EDIT A TODO OF PARTICULAR USER
  app.post(`/editTodo`, (req, res) => {
    let todoId = req.body.todo_id;
    Todo.findByIdAndUpdate(
      todoId,
      { todo: req.body.todo, created_at: req.body.created_at },
      (err, todo) => {
        if (err) {
          return res.status(400).json({
            title: "Error",
            error: "Some error occurred",
          });
        }
        res.status(200).json({
          title: "Successfully Edited",
          todo: todo,
        });
      }
    );
  });

  //TO DELETE A TODO
  app.post(`/deleteTodo`, (req, res) => {
    let todoId = req.body.todo_id;
    Todo.findOneAndDelete({ _id: todoId }, (err) => {
      if (err) {
        res.status(500).json({
          title: "Some internal error",
        });
      }
      res.status(200).json({
        title: "Todo deleted successfully",
      });
    });
  });
}

module.exports = routes;
