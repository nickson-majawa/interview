import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import CreateFacilities from "./components/createFacilities";
import Facilities from "./components/facilities";
import ViewFacility from "./components/viewFacility";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

function App() {
  return (
    <>
      <main className="container">
        <Routes>
          <Route path="/" element={<Facilities />} />
          <Route path="/create" element={<CreateFacilities />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/view/:id" element={<ViewFacility />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
