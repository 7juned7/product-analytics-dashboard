// src/components/Header.js

import React, { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext'; // Import Auth context
import './Styles/Header.css'
const Header = () => {
    const { user, login, logout } = useContext(AuthContext); // Access user and auth methods
    const [showLoginForm, setShowLoginForm] = useState(false); // State to show/hide login form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        login(email, password); // Call the login function from context

        setShowLoginForm(false); // Hide the form after login
    };

    return (
        <header className='header' >
            <div className="header-container">


                Dashboard
                {user ? (
                    <div>
                        <span>Welcome, {user.name}!</span>
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <>
                        {!showLoginForm && (<div>
                            <button className='btn' onClick={() => setShowLoginForm(true)}>Login</button>
                        </div>)}
                    </>
                )}
                {showLoginForm && (
                    <form id='form' className='form' onSubmit={handleLogin}>
                        <h2>Login</h2>
                        <label >
                            Email:
                            <input
                                id='email'
                                name='email'
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                id='password'
                                name='password'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </label>
                        <div className="btn-container">
                            <button type="submit" className='btn' >Submit</button>
                            <button type="button" className='btn' onClick={() => setShowLoginForm(false)}>Cancel</button>

                        </div>
                    </form>
                )}
            </div>
        </header>
    );
};

// Styles for the header


export default Header;
