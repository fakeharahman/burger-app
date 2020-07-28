import React, { useEffect, Suspense } from 'react';
import Layout from "./hoc/Layout/Layout"
import BurgerBuilder from "./Containers/BurgerBuilder/BurgerBuilder"
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import Logout from './Containers/Auth/Logout/Logout';
import * as actions from './store/actions/index'
import { connect } from 'react-redux';

const Checkout = React.lazy(() => {
  return import('./Containers/Checkout/Checkout')
});
const Orders = React.lazy(() => {
  return import('./Containers/Orders/Orders')
});
const Auth = React.lazy(() => {
  return import('./Containers/Auth/Auth')
});


const App = (props) => {
  useEffect(() => {
    props.toAutoSignin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let routes = (
    <Switch>
      <Route path='/auth' render={(props) => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>)
  if (props.isAuth) {
    routes = (<Switch>
      <Route path='/auth' render={(props) => <Auth {...props} />} />
      <Route path="/checkout" render={(props) => <Checkout {...props} />} />
      <Route path='/orders' render={(props) => <Orders {...props} />} />
      <Route path='/logout' component={Logout} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>)
  }

  return (
    <div >
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
      </Layout>
    </div>
  );
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
