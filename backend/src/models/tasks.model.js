import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
  title : {
    type : String,
    require : true,
    trim : true
  }, 
  status : {
    type : String,
    enum : ["active", "completed"],
    default : "active"
  },
  deleted : {
    type : Boolean,
    default : false
  },
  deletedAt : {
    type : Date,
    default : null
  },
  completedAt : {
    type : Date,
    default : null
  }
},{
  timestamps : true
})

const Task = mongoose.model("Task",tasksSchema);
export default Task;