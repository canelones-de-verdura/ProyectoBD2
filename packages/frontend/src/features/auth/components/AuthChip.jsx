import React from 'react'
import authCSS from '../styles/Auth.module.css'

function AuthChip({title, action, redirect}) {
    return (
        <div className={`formWrapper ${authCSS.miniForm}`}>
            <p>{title}</p>
            <a href={redirect}>
                {action}
            </a>
        </div>
    )
}

export default AuthChip;