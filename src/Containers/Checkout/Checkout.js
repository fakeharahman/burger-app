import React, { Component } from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import { Route } from 'react-router-dom'
import ContactData from './ContactData/ContactData'
import { connect } from 'react-redux'

class Checkout extends Component {



    // componentWillMount() {
    //     const query = new URLSearchParams(this.props.location.search)
    //     let ingredients = {}
    //     let price = 0;
    //     for (let params of query.entries()) {
    //         //['salad', '1']
    //         if (params[0] === "price") {
    //             price = +params[1]
    //         } else {
    //             ingredients[params[0]] = +params[1];
    //         }

    //     }
    //     this.setState({ ingredients: ingredients, totalPrice: price })
    // }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace("/checkout/contact-data")
    }

    render() {
        return (<div>
            <CheckoutSummary
                ingredients={this.props.ings}
                checkoutCancelled={this.checkoutCancelledHandler}
                checkoutContinued={this.checkoutContinuedHandler} />
            <Route path={this.props.match.path + "/contact-data"}
                component={ContactData} />
        </div>)
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,

    }
}

export default connect(mapStateToProps)(Checkout)