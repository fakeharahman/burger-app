import React, { Component } from "react";
import Aux from "../../hoc/Auxillary/Auxillary"
import Burger from "../../components/Burger/Burger"
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal"
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary"
import Spinner from '../../components/UI/Spinner/spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import { connect } from "react-redux";
import axios from '../../axios-orders'
// import * as actions from '../../store/actions/index'

export class BurgerBuilder extends Component {
    state = {
        purchasing: false,

    }

    componentDidMount() {
        this.props.onInitIngredient();
    }

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((sum, cur) => sum += cur, 0)
        return sum > 0


    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({ purchasing: true })
        }
        else {
            this.props.onSetRedirectPath('/checkout')
            this.props.history.push("/auth");
        }

    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        // }
        // queryParams.push("price=" + this.state.totalPrice)
        // const queryStr = queryParams.join('&')
        this.props.onInitPurchase()
        this.props.history.push("/checkout");

        // {
        // pathname: "/checkout",
        // search: "?" + queryStr
        // })
    }

    render() {

        const disabledInfo = { ...this.props.ings };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        //salad: true, meat: false
        let orderSummary = null;




        let burger = (this.props.error) ? <p>Ingredients can't be loaded</p> : <Spinner />

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls addIngredient={this.props.onIngredientAdded}
                        deleteIngredient={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        purchasing={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            )
            orderSummary = <OrderSummary ingredients={this.props.ings}
                cancel={this.purchaseCancelHandler}
                continue={this.purchaseContinueHandler}
                totalPrice={this.props.price} />
        }



        return (
            <Aux>
                <Modal show={this.state.purchasing}
                    closeModal={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        err: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredient: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))