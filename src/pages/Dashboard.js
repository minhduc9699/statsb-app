import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Games from "../components/dashboard/Games";
import Teams from "../components/dashboard/Teams";
import Players from "../components/dashboard/Players";
import Leagues from "../components/dashboard/Leagues";
import Analytics from "../components/dashboard/Analytics";

const TABS = ["matches", "teams", "players"];

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "matches";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "matches":
        return <Games />;
      case "teams":
        return <Teams />;
      case "players":
        return <Players />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="page-container bg-dark text-center">
      <div className="dashboard-content h-full">
        <div className="grid grid-cols-12 gap-[6px] px-[24px] py-[18px] border-b border-tgray">
          <div className="col-span-3"></div>
          <div className="col-span-9 dashboard-navbar">
            <div className="w-full flex items-center justify-evenly">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full px-8 text-[20px] rounded group relative inline-block overflow-hidden transition ${
                    activeTab === tab ? "text-orange font-bold" : "text-white"
                  }`}
                >
                  {tab}
                  <span
                    className={`absolute left-0 bottom-0 h-[1px] w-0 bg-orange transition-all duration-500 group-hover:w-full ${
                      activeTab === tab ? "w-full" : ""
                    }`}
                  ></span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-full">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
