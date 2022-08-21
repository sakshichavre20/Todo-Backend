const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  todo: String,
  completed: Boolean,
  created_at: String,
  user_id: String,
});

const Todo = mongoose.model("Todo", TodoSchema);
module.exports = Todo;
