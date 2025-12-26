import './App.css'
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Header from "./components/Header";
import TicketsList from "./components/TicketsList";
import GuardRouter from "./guards/GuardRouter";
import TicketDetails from './components/TicketDetails';
import AddUser from './components/addUser';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import UsersList from './components/UsersList';

function App() {
  return (
    <AuthProvider> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <GuardRouter>
              <>
                <Header />
                <Routes>
                  <Route path="/tickets" element={<TicketsList />} />
                  <Route path="/ticket/:id" element={<TicketDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-user" element={<AddUser />} />
                  <Route path="/users" element={<UsersList />} />
                  <Route path="*" element={<Navigate to="/tickets" />} />
                </Routes>
                <Footer />
              </>
            </GuardRouter>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;