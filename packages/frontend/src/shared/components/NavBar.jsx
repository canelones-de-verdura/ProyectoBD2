import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiSearch, FiMap } from "react-icons/fi";
import navbarCSS from '../styles/Bars.module.css';

function NavBar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const isSelected = (path) => location.pathname === path ? navbarCSS.selected : '';

  return (
    <div className={navbarCSS.navbar}>
      <nav className={navbarCSS.navigation}>
        <ul>
          <li>
            <Link to="/votantes" className={`${navbarCSS.navItem} ${isSelected('/votantes')}`}>
              <FiSearch size={22} />
              <span>Buscar Votantes</span>
            </Link>
          </li>
          <li>
            <Link to="/circuito" className={`${navbarCSS.navItem} ${isSelected('/circuito')}`}>
              <FiMap size={22} />
              <span>Cerrar circuito</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className={navbarCSS.extras}>
        <button className={navbarCSS.navItem} onClick={logout}>
          <FiLogOut size={22} />
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
}

export default NavBar;
