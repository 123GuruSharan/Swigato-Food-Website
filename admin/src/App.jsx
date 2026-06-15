import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";
import AdminRoute from "./components/AdminRoute/AdminRoute";

const App = () => {
  const url = "http://localhost:4000";
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Login url={url} />} />
          <Route
            path="/add"
            element={
              <AdminRoute>
                <Add url={url} />
              </AdminRoute>
            }
          />
          <Route
            path="/list"
            element={
              <AdminRoute>
                <List url={url} />
              </AdminRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <AdminRoute>
                <Orders url={url} />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
