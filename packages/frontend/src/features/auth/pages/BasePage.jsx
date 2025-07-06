import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BasePage = ({ children }) => {

    return (
        <>
            <ToastContainer />
            <div className="globalContainer">
                <div className='globalPage'>
                    {children}
                </div>
            </div></>
    );
};

export default BasePage;
