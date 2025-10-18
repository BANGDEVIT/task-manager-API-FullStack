import Task from "../models/tasks.model.js";
import mongoose from "mongoose";

//[GET] /tasks/
// export const getAllTasks = async (req, res) => {
//   const { filter = "today" } = req.query;
//   const now = new Date();
//   let startDate;

//   switch (filter) {
//     case "today": {
//       startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       break;
//     }
//     case "week": {
//       const mondayDate =
//         now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
//       startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
//       break;
//     }
//     case "month": {
//       startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//       break;
//     }
//     case "all":
//       startDate = null;
//       break;
//     default: {
//       startDate = null;
//     }
//   }

//   try {
//     const userId = req.user.id;

//     // QUAN TRỌNG: Convert sang ObjectId
//     const userTasksDoc = await Task.findOne({
//       user_id: new mongoose.Types.ObjectId(userId)
//     });

//     console.log("Found document:", userTasksDoc);

//     if (!userTasksDoc) {
//       // Nếu chưa có document, tạo mới - cũng dùng ObjectId
//       const newUserTasks = new Task({
//         user_id: new mongoose.Types.ObjectId(userId),
//         tasks: [],
//       });
//       await newUserTasks.save();

//       return res.status(200).json({
//         message: "Get Successfully",
//         tasks: [],
//         activeCount: 0,
//         completedCount: 0,
//       });
//     }

//     // Phần còn lại của logic...
//     let tasks = userTasksDoc.tasks.filter(task => !task.deleted);

//     // Áp dụng date filter
//     if (startDate) {
//       tasks = tasks.filter(task =>
//         task.createdAt && new Date(task.createdAt) >= startDate
//       );
//     }

//     // Sắp xếp theo createdAt giảm dần
//     tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     // Đếm active và completed tasks
//     const activeCount = tasks.filter(task => task.status === "active").length;
//     const completedCount = tasks.filter(task => task.status === "completed").length;

//     console.log(`Found ${tasks.length} tasks for user ${userId}`);

//     res.status(200).json({
//       message: "Get Successfully",
//       tasks: tasks,
//       activeCount: activeCount,
//       completedCount: completedCount,
//     });
//   } catch (error) {
//     console.error("GetAllTasks is error", error);
//     res.status(500).json({ message: "System is error" });
//   }
// };

//[POST] /tasks/
// export const createTask = async (req, res) => {
//   try {
//     const task = new Task(req.body);
//     const newTask = await task.save();
//     res.status(201).json({ message: "CreateTask Successfully", task: newTask });
//   } catch (error) {
//     console.error("CreateTask is error", error);
//     res.status(500).json({ message: "System is error" });
//   }
// };

//[PATCH] /tasks/:id
// export const updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // const newTask = await Task.updateOne(
//     //   {
//     //     _id: id,
//     //   },
//     //   req.body
//     // );
//     const updateTask = await Task.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json({ message: "Updated Successfully", task: updateTask });
//   } catch (error) {
//     console.error("UpdateTask is error", error);
//     res.status(500).json({ message: "System is error" });
//   }
// };

//[Delete] /tasks/:id
// export const deleteTask = async (req, res) => {
//   try {
//     const deleteTask = await Task.findByIdAndDelete(req.params.id);

//     if (!deleteTask) {
//       return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
//     }
//     res.status(200).json({ message: "Deleted Successfully", task: deleteTask });
//   } catch (error) {
//     console.error("DeletedTask is error", error);
//     res.status(500).json({ message: "System is error" });
//   }
// };

//[GET] /tasks
export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;

  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
      startDate = null;
      break;
    default: {
      startDate = null;
    }
  }

  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); //  Convert ngay từ đầu

    const userTasksDoc = await Task.findOne({
      user_id: userId,
    });

    if (!userTasksDoc) {
      const newUserTasks = new Task({
        user_id: userId,
        tasks: [],
      });
      await newUserTasks.save();
      return res.status(200).json({
        message: "Get Successfully",
        tasks: [],
        activeCount: 0,
        completedCount: 0,
      });
    }

    // Sử dụng Aggregation Pipeline
    const pipeline = [
      // 1. Match user_id
      { $match: { user_id: userId } },

      // 2. Unwind tasks array
      {
        $unwind: {
          path: "$tasks",
          preserveNullAndEmptyArrays: false,
        },
      },

      // 3. Filter deleted tasks
      {
        $match: {
          "tasks.deleted": false,
        },
      },
    ];

    // 4. Thêm date filter nếu có
    if (startDate) {
      pipeline.push({
        $match: {
          "tasks.createdAt": { $gte: startDate },
        },
      });
    }

    // 5. Sort theo createdAt giảm dần
    pipeline.push({
      $sort: { "tasks.createdAt": -1 },
    });

    // 6. Group lại và tính count
    pipeline.push({
      $group: {
        _id: "$user_id",
        tasks: { $push: "$tasks" },
        activeCount: {
          $sum: {
            //$cond : [điều kiện, giá trị nếu ĐK đúng, ĐK sai]
            $cond: [{ $eq: ["$tasks.status", "active"] }, 1, 0],
          },
        },
        completedCount: {
          $sum: {
            $cond: [{ $eq: ["$tasks.status", "completed"] }, 1, 0],
          },
        },
      },
    });

    // 7. Project để format output
    pipeline.push({
      // 0 là ko xuất ra, 1 là có
      $project: {
        _id: 0,
        tasks: 1,
        activeCount: 1,
        completedCount: 1,
      },
    });

    // 1. Sau $unwind
    // { user_id: "123", tasks: { status: "active" } }
    // { user_id: "123", tasks: { status: "completed" } }
    // { user_id: "123", tasks: { status: "active" } }

    // 2. Sau $group
    // {
    //   _id: "123",
    //   tasks: [
    //     { status: "active" },
    //     { status: "completed" },
    //     { status: "active" }
    //   ],
    //   activeCount: 2,      // 1 + 0 + 1
    //   completedCount: 1    // 0 + 1 + 0
    // }

    // 3. Sau $project
    // {
    //   tasks: [...],
    //   activeCount: 2,
    //   completedCount: 1
    // }

    const result = await Task.aggregate(pipeline);
    const data =
      result.length > 0
        ? result[0]
        : { tasks: [], activeCount: 0, completedCount: 0 };

    res.status(200).json({
      message: "Get Successfully",
      ...data,
    });
  } catch (error) {
    console.error("GetAllTasks error:", error);
    res.status(500).json({ message: "System error" });
  }
};

// [POST] /tasks/
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    // Tìm document của user hoặc tạo mới
    let userTasksDoc = await Task.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
    });

    // Tạo task mới
    const newTask = {
      title: title.trim(),
      status: "active",
      deleted: false,
      deletedAt: null,
      completedAt: null,
      createdAt: new Date(),
    };

    // Thêm task vào array
    userTasksDoc.tasks.push(newTask);
    await userTasksDoc.save();

    // Lấy task vừa tạo (có _id tự động)
    const createdTask = userTasksDoc.tasks[userTasksDoc.tasks.length - 1];

    res.status(201).json({
      message: "Task created successfully",
      task: createdTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "System error" });
  }
};

// [PATCH] /tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const userId = req.user.id;

    console.log(id, title, status);

    // Tìm document của user
    const userTasksDoc = await Task.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
    });

    if (!userTasksDoc) {
      return res.status(404).json({ message: "User tasks not found" });
    }

    // Tìm task trong array
    const taskIndex = userTasksDoc.tasks.findIndex(
      (task) => task._id.toString() === id && !task.deleted
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task
    if (title !== undefined && title.trim() !== "") {
      userTasksDoc.tasks[taskIndex].title = title.trim();
    }

    if (status && ["active", "completed"].includes(status)) {
      userTasksDoc.tasks[taskIndex].status = status;

      // Set completedAt nếu chuyển sang completed
      if (
        status === "completed" &&
        !userTasksDoc.tasks[taskIndex].completedAt
      ) {
        userTasksDoc.tasks[taskIndex].completedAt = new Date();
      }

      // Reset completedAt nếu chuyển về active
      if (status === "active" && userTasksDoc.tasks[taskIndex].completedAt) {
        userTasksDoc.tasks[taskIndex].completedAt = null;
      }
    }

    // Update updatedAt timestamp
    userTasksDoc.markModified("tasks");
    await userTasksDoc.save();

    res.status(200).json({
      message: "Task updated successfully",
      task: userTasksDoc.tasks[taskIndex],
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "System error" });
  }
};

// [DELETE] /tasks/:id xóa mềm
// export const deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     // Tìm document của user
//     const userTasksDoc = await Task.findOne({
//       user_id: new mongoose.Types.ObjectId(userId),
//     });

//     if (!userTasksDoc) {
//       return res.status(404).json({ message: "User tasks not found" });
//     }

//     // Tìm task trong array
//     const taskIndex = userTasksDoc.tasks.findIndex(
//       (task) => task._id.toString() === id && !task.deleted
//     );

//     if (taskIndex === -1) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     // Soft delete task
//     userTasksDoc.tasks[taskIndex].deleted = true;
//     userTasksDoc.tasks[taskIndex].deletedAt = new Date();

//     // Update updatedAt timestamp
//     userTasksDoc.markModified("tasks");
//     await userTasksDoc.save();

//     res.status(200).json({
//       message: "Task deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete task error:", error);
//     res.status(500).json({ message: "System error" });
//   }
// };

// [DELETE] /tasks/:id xóa cứng
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await Task.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(userId),
        "tasks._id": new mongoose.Types.ObjectId(id),
      },
      {
        $pull: {
          tasks: { _id: new mongoose.Types.ObjectId(id) },
        },
      },
      {
        new: true, // Trả về document sau khi update
      }
    );

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task permanently deleted",
      remainingTasks: result.tasks.length, // Số task còn lại
    });
  } catch (error) {
    console.error("Hard delete task error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    res.status(500).json({ message: "System error" });
  }
};
