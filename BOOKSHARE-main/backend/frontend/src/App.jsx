import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ResendVerification from './pages/ResendVerification.jsx';
import BookList from './pages/BookList.jsx';
import BookDetail from './pages/BookDetail.jsx';
import CreateBook from './pages/CreateBook.jsx';
import MyBooks from './pages/MyBooks.jsx';
import Exchanges from './pages/Exchanges.jsx';
import Profile from './pages/Profile.jsx';
import Chat from './pages/Chat.jsx';
import Users from './pages/Users.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              
              <Route path="/books" element={<PrivateRoute><BookList /></PrivateRoute>} />
              <Route path="/books/:id" element={<PrivateRoute><BookDetail /></PrivateRoute>} />
              <Route path="/create-book" element={<PrivateRoute><CreateBook /></PrivateRoute>} />
              <Route path="/my-books" element={<PrivateRoute><MyBooks /></PrivateRoute>} />
              <Route path="/exchanges" element={<PrivateRoute><Exchanges /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
              <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
              <Route path="/chat/:userId" element={<PrivateRoute><Chat /></PrivateRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
