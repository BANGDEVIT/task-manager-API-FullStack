import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "User" // Thêm reference để populate nếu cần
    },
    tasks: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxLength: 255 // Thêm limit để bảo vệ database
        },
        status: {
          type: String,
          enum: ["active", "completed"],
          default: "active",
        },
        deleted: {
          type: Boolean,
          default: false,
        },
        deletedAt: {
          type: Date,
          default: null,
        },
        completedAt: {
          type: Date,
          default: null,
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Thêm index cho tasks array để query nhanh hơn
// tasksSchema.index({ "tasks.deleted": 1, "tasks.status": 1 });
// tasksSchema.index({ "tasks.createdAt": -1 });

const Task = mongoose.model("Task", tasksSchema);
export default Task;