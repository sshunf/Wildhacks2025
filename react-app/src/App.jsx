import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Auth from './pages/Auth';
import Task from './pages/Task';
import GetStarted from './pages/GetStarted'
import './App.css';
import Dashboard from './pages/Dashboard';

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/tasks" element={<Task />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;