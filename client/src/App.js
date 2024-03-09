import React from "react";
import "./App.css";
import LoginPage from "./LoginPage/LoginPage.jsx";
import FeedPage from "./FeedPage/FeedPage.jsx";
import UserPage from "./UserPage/UserPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./protected/Protected.jsx";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route index element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route index element={<FeedPage />} />
                    <Route
                        path="/feed"
                        element={
                            <Protected>
                                <FeedPage />
                            </Protected>
                        }
                    />
                    <Route path="/user/:userId" element={<UserPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
