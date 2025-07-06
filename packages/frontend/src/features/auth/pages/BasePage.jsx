import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BasePage = ({ children }) => {

    return (
        <>
            <ToastContainer />
            <div className="globalContainer">
                <div>
                    <img src="public\diseno-voto-elecciones-dibujos-animados_24877-14734.avif" alt="banner" className="banner" />
                </div>
                <div className='globalPage'>
                    {children}
                </div>
            </div></>
    );
};

export default BasePage;
