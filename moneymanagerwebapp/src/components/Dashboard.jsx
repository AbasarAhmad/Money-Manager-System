import React, { useContext } from "react";
import Menubar from "./Menubar";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/AppContext";

const Dashboard = ({ children, activeMenu }) => {
  const { user } = useContext(AppContext);

  return (
    <div>
      <Menubar activeMenu={activeMenu} />

      {user && (
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
      )}

    </div>
  );
};

export default Dashboard;
