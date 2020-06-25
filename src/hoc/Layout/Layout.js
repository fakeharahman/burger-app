import React, { Component } from "react"
import Aux from "../Auxillary/Auxillary"
import classes from "./Layout.module.css"
import Toolbar from "../../components/Navigation/Toolbar/Toolbar"
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer"

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerShowHandler = () => {
        this.setState({ showSideDrawer: true })
    }

    sideDrawerHideHandler = () => {
        this.setState((prevState) => { return { showSideDrawer: !prevState.showSideDrawer } })
    }

    render() {
        return (
            <Aux>
                <Toolbar drawerOpen={this.sideDrawerShowHandler} />
                <SideDrawer closed={this.sideDrawerHideHandler} show={this.state.showSideDrawer} />
                <main className={classes.Content}>
                    {this.props.children}</main>
            </Aux>

        )
    }
}


export default Layout 