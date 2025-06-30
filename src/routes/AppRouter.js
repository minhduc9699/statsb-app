import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import MatchStudio from "../pages/MatchStudio";
import MainLayout from "../layouts/MainLayout";
import CreateNewPlayer from "../pages/CreateNewPlayer";
import CreateNewTeam from "../pages/CreateNewTeam";

const AppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/match-studio" element={<MatchStudio />} />
        <Route path="/match-studio/:matchId" element={<MatchStudio />} />
        <Route path="/player" element={<CreateNewPlayer />} />
        <Route path="/player/:playerId" element={<CreateNewPlayer />} />
        <Route path="/team" element={<CreateNewTeam />} />
        <Route path="/team/:teamId" element={<CreateNewTeam />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRouter;
