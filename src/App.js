import React, { Component } from 'react';
import Layout from "./hoc/Layout/Layout"
import BurgerBuilder from "./Containers/BurgerBuilder/BurgerBuilder"
// import Checkout from './Containers/Checkout/Checkout';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
// import Orders from './Containers/Orders/Orders';
// import Auth from './Containers/Auth/Auth';
import Logout from './Containers/Auth/Logout/Logout';
import * as actions from './store/actions/index'
import { connect } from 'react-redux';
import asyncComponent from './hoc/AsyncComponent/AsyncComponent';

const asyncCheckout = asyncComponent(() => {
  return import('./Containers/Checkout/Checkout')
});
const asyncOrders = asyncComponent(() => {
  return import('./Containers/Orders/Orders')
});
const asyncAuth = asyncComponent(() => {
  return import('./Containers/Auth/Auth')
});
class App extends Component {
  componentDidMount() {
    this.props.toAutoSignin()
  }
  render() {
    let routes = (
      <Switch>
        <Route path='/auth' component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to='/' />
      </Switch>)
    if (this.props.isAuth) {
      routes = (<Switch>
        <Route path='/auth' component={asyncAuth} />
        <Route path="/checkout" component={asyncCheckout} />
        <Route path='/orders' component={asyncOrders} />
        <Route path='/logout' component={Logout} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to='/' />
      </Switch>)
    }

    return (
      <div >
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toAutoSignin: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
