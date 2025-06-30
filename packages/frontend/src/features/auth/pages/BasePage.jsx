import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BasePage = ({ children }) => {

    return (
        <>
            <ToastContainer />
            <div className="globalContainer">
                <div>
                    <img src="/banner.jpg" alt="banner" className="banner" />
                </div>
                <div className='globalPage'>
                    {children}
                </div>
            </div></>
    );
};

export default BasePage;
