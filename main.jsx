import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if ((username === "admin" && password === "admin") || (users[username] && users[username].password === password)) {
      localStorage.setItem("currentUser", username);
      navigate(username === "admin" ? "/admin" : "/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded mb-2">
        Login
      </button>
      <button onClick={() => navigate("/register")} className="px-4 py-2 bg-gray-500 text-white rounded">
        Register
      </button>
    </div>
  );
}

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      alert("User already exists");
    } else {
      users[username] = { password, balance: Math.floor(Math.random() * 10000) };
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful");
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <button onClick={handleRegister} className="px-4 py-2 bg-green-500 text-white rounded">
        Register
      </button>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState({});

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    setUsers(storedUsers);
  }, []);

  const handleDeleteUser = (username) => {
    const updatedUsers = { ...users };
    delete updatedUsers[username];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Admin Dashboard</h2>
      <ul>
        {Object.keys(users).map((user) => (
          <li key={user} className="mb-2">
            {user} <button onClick={() => handleDeleteUser(user)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUsername(currentUser);
      const users = JSON.parse(localStorage.getItem("users")) || {};
      setBalance(users[currentUser]?.balance || 0);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <p>Welcome, {username}!</p>
      <p>Your current balance: ${balance}</p>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
