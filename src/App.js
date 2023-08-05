import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import UserForm from './components/UserForm';
import LocalStoragePage from './components/LocalStoragePage';
import FirebasePage from './components/FirebasePage';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/local-storage">Local Storage</Link>
            </li>
            <li>
              <Link to="/firebase">Firebase</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          {/* Default redirect to UserForm */}
          <Route path="/" element={<Navigate to="/user-form" />} />

          {/* Routes for different components */}
          <Route path="/user-form" element={<UserForm />} />
          <Route path="/local-storage" element={<LocalStoragePage />} />
          <Route path="/firebase" element={<FirebasePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
