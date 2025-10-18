import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
import { useAuth } from "@/hooks/useAuth";
import Logout from "@/components/Logout";

const HomePage = () => {
  const { isAuthenticated, user, loading } = useAuth(); // Thêm loading
  const navigate = useNavigate();
  
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState([]);
  const [completedTaskCount, setCompletedTaskCount] = useState([]);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  // Redirect nếu chưa đăng nhập (sau khi loading xong)
  useEffect(() => {
    if (!loading && isAuthenticated === false) {
      navigate('/users/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [dateQuery, isAuthenticated]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`, {
        withCredentials: true
      });
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompletedTaskCount(res.data.completedCount);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Session expired");
        navigate('/users/login');
        return;
      }
      console.error("Lỗi fetch tasks:", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Không render nếu chưa đăng nhập (sẽ redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Phần còn lại của component...
  const filteredTasks = (taskBuffer || []).filter((task) => {
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

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  if (visibleTasks.length === 0 && page > 1) {
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
      <div className="container pt-8 mx-auto relative z-10">
        <Logout/>
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          <Header />
          <AddTask handleNewTaskAdd={handleTaskChange} />
          <StartAndFilter
            filter={filter}
            setFilter={setFilter}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
          />
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChange={handleTaskChange}
          />
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