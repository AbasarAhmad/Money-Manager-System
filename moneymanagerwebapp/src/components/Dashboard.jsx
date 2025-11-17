import React from "react";
import Menubar from "./Menubar";
import Sidebar from "../components/Sidebar";

const Dashboard = ({ children, activeMenu }) => {
  return (
    <div>
      <Menubar />

      <div className="flex">
        {/* Sidebar only on big screens */}
        <div className="max-[1080px]:hidden">
          <Sidebar activeMenu={activeMenu} />
        </div>

        {/* Page Content */}
        <div className="grow mx-5 mt-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
