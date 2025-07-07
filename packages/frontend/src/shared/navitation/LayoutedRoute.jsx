import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TopBar from '../components/TopBar';
import styles from '../styles/Bars.module.css'; // adaptá el path si hace falta

const LayoutedRoute = () => {
  
    return <div className="colducuApp">
        <div className="colducuContent">
            <Outlet />
        </div>
        <NavBar />
    </div>;
};

export default LayoutedRoute;
