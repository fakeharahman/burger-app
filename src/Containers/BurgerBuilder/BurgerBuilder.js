import React, { Component } from "react";
import Aux from "../../hoc/Auxillary/Auxillary"
import Burger from "../../components/Burger/Burger"
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal"
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary"
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actionTypes from '../../store/actions'
import { connect } from "react-redux";



class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // axios.get("https://my-burger-805c2.firebaseio.com/ingredients.json")
        //     .then(response => {
        //         this.setState({ ingredients: response.data })
        //     })
        //     .catch(error => { this.setState({ error: true }) })
    }

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((sum, cur) => sum += cur, 0)
        return sum > 0


    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
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




        let burger = (this.state.error) ? <p>Ingredients can't be loaded</p> : <Spinner />

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls addIngredient={this.props.onIngredientAdded}
                        deleteIngredient={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        purchasing={this.purchaseHandler} />
                </Aux>
            )
            orderSummary = <OrderSummary ingredients={this.props.ings}
                cancel={this.purchaseCancelHandler}
                continue={this.purchaseContinueHandler}
                totalPrice={this.props.price} />
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
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
        ings: state.ingredients,
        price: state.totalPrice
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))