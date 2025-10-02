import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import AddTask from "@/components/AddTask";
import StartAndFilter from "@/components/StartAndFilter";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  //buffer là 1 mảng thô và cần đươc xử lí
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState([]);
  const [completedTaskCount, setCompletedTaskCount] = useState([]);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  //logic
  const fetchTasks = async () => {
    try {
      // const res = await fetch("http://localhost:3333/tasks");
      // const data = res.json();
      // settaskBuffer(data.tasks);
      // console.log(data);

      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompletedTaskCount(res.data.completedCount);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  };

  //variable
  const filteredTasks =  (taskBuffer || []).filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });
  const handleTaskChange = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  //pagination
  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  if (visibleTasks.length === 0) {
    handlePrev();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);
  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)
      `,
        }}
      />
      {/* Your Content/Components */}
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/*Header*/}
          <Header />
          {/*AddTasks*/}
          <AddTask handleNewTaskAdd={handleTaskChange} />
          {/*StartAndFilter*/}
          <StartAndFilter
            filter={filter}
            setFilter={setFilter}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
          />
          {/*TaskList*/}
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChange={handleTaskChange}
          />
          {/*Pagination and DateTimeFilter*/}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
          {/*Footer*/}
          <Footer
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
