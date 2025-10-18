// const Header = () => {
//   const { logout } = useAuth();

//   const handleLogout = async () => {
//     await logout();
//   };

//   return (
//     <header className="flex justify-between items-center">
//       <h1>My Tasks</h1>
//       <button
//         onClick={handleLogout}
//         className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//       >
//         Đăng xuất
//       </button>
//     </header>
//   );
// };

import api from "@/lib/axios";
import React from "react";

const Logout = () => {
  const handleLogout = async () => {
    try {
      const res = await api.get("/users/logout", {
        withCredentials: true,
      });
      if(res.status === 200) {
        window.location.href ="/users/login"
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-end items-center" onClick={handleLogout}>
      <button className="px-4 py-2 bg-gradient-to-br from-rose-400 to-rose-500 text-white rounded hover:from-rose-500 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 trasision-all duration-200">
        Logout
      </button>
    </div>
  );
};

export default Logout;
