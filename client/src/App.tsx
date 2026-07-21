import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/LandingNavbar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Landing from "./pages/Landing";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-100">
          <Navbar />
          <main className="mx-auto max-w-4xl px-4">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
