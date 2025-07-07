import React from 'react';
import topbarCSS from '../styles/Bars.module.css';

function TopBar() {
  return (
    <div className={topbarCSS.topbar}>
      <div className={topbarCSS.logo}>
        <img src="/ColdUCU.svg" alt="Cold UCU" className={topbarCSS.logo} />
      </div>
    </div>
  );
}

export default TopBar;
