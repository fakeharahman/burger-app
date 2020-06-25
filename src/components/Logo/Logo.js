import React from 'react'
import burgerLogo from "../../assets/original.png"
import classes from './Logo.module.css'

const logo = props => (
    <div className={classes.Logo}>
        <img src={burgerLogo} alt="Logo" />
    </div>
)

export default logo;