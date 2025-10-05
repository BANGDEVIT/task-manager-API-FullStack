import Task from "../models/tasks.model.js";

//[GET] /tasks/
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
      break
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    // const tasks = await Task.find({deleted : false}).sort({createdAt : -1});
    // const activeTasks = await Task.countDocuments({status : "active", deleted : false});
    // const completedTask = await Task.countDocuments({status : "completed", deleted : false});
    const result = await Task.aggregate([
      { $match: query },
      {
        //chạy tất cả cùng 1 lúc
        $facet: {
          tasks: [{ $match: { deleted: false } }, { $sort: { createdAt: -1 } }],
          activeCount: [
            { $match: { status: "active", deleted: false } },
            { $count: "count" },
          ],
          completedCount: [
            { $match: { status: "completed", deleted: false } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completedCount = result[0].completedCount[0]?.count || 0;

    console.log(tasks)

    res.status(200).json({
      message: "Get Successfully",
      tasks: tasks,
      activeCount: activeCount,
      completedCount: completedCount,
    });
  } catch (error) {
    console.error("GetAllTasks is error", error);
    res.status(500).json({ message: "System is error" });
  }
};

//[POST] /tasks/
export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const newTask = await task.save();
    res.status(201).json({ message: "CreateTask Successfully", task: newTask });
  } catch (error) {
    console.error("CreateTask is error", error);
    res.status(500).json({ message: "System is error" });
  }
};

//[PATCH] /tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    // const newTask = await Task.updateOne(
    //   {
    //     _id: id,
    //   },
    //   req.body
    // );
    const updateTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Updated Successfully", task: updateTask });
  } catch (error) {
    console.error("UpdateTask is error", error);
    res.status(500).json({ message: "System is error" });
  }
};

//[Delete] /tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json({ message: "Deleted Successfully", task: deleteTask });
  } catch (error) {
    console.error("DeletedTask is error", error);
    res.status(500).json({ message: "System is error" });
  }
};
