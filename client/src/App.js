import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import PrivateRoute from './components/routing/PrivateRoute';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
// Redux
import { Provider } from 'react-redux';
import store from './store';

import './Editing.css';
import MyPosts from './components/dashboard/MyPosts';
import Features from './components/layout/Features';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);
    return (
        <Provider store={store}>
            <Router>
                <Navbar />
                <Sidebar />
                <Routes>
                    <Route exact path="/" element={<Landing />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/profiles" element={<Profiles />} />
                    <Route exact path="/features" element={<Features />} />
                    <Route exact path="/profile/:id" element={<Profile />} />
                    <Route
                        exact
                        path="/dashboard"
                        element={<PrivateRoute component={Dashboard} />}
                    />
                    <Route
                        exact
                        path="/profile-form"
                        element={<PrivateRoute component={CreateProfile} />}
                    />
                    <Route
                        exact
                        path="/add-experience"
                        element={<PrivateRoute component={AddExperience} />}
                    />
                    <Route
                        exact
                        path="/add-education"
                        element={<PrivateRoute component={AddEducation} />}
                    />
                    <Route exact path="/my-posts" element={<PrivateRoute component={MyPosts} />} />
                    <Route exact path="/posts" element={<PrivateRoute component={Posts} />} />
                    <Route exact path="/posts/:id" element={<PrivateRoute component={Post} />} />
                </Routes>

                <Alert />
            </Router>
        </Provider>
    );
};

export default App;
