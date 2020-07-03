import React, { Component } from "react";
import Aux from "../../hoc/Auxillary/Auxillary"
import Burger from "../../components/Burger/Burger"
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal"
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary"
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    meat: 30,
    cheese: 15,
    bacon: 25,
    salad: 20
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 40,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false

    }

    componentDidMount() {
        axios.get("https://my-burger-805c2.firebaseio.com/ingredients.json")
            .then(response => {
                this.setState({ ingredients: response.data })
            })
            .catch(error => { this.setState({ error: true }) })
    }

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((sum, cur) => sum += cur, 0)
        this.setState({
            purchaseable: sum > 0
        })

    }




    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const newCount = oldCount + 1;
        const updatedIngredients = { ...this.state.ingredients }
        updatedIngredients[type] = newCount;
        const priceAddition = INGREDIENT_PRICES[type]
        const newPrice = this.state.totalPrice + priceAddition;
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice

        })
        this.updatePurchaseState(updatedIngredients); //or it uses the old state
    }

    deleteIngredientHandler = (type) => {
        const newIngredients = { ...this.state.ingredients };
        if (this.state.ingredients[type] <= 0) return;
        newIngredients[type] = this.state.ingredients[type] - 1;
        const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({
            ingredients: newIngredients,
            totalPrice: newPrice
        })
        this.updatePurchaseState(newIngredients);

    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        // alert("Burger will be bought!")

        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push("price=" + this.state.totalPrice)
        const queryStr = queryParams.join('&')
        this.props.history.push({
            pathname: "/checkout",
            search: "?" + queryStr
        })
    }

    render() {

        const disabledInfo = { ...this.state.ingredients };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        //salad: true, meat: false
        let orderSummary = null;




        let burger = (this.state.error) ? <p>Ingredients can't be loaded</p> : <Spinner />

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls addIngredient={this.addIngredientHandler}
                        deleteIngredient={this.deleteIngredientHandler}
                        disabled={disabledInfo} price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        purchasing={this.purchaseHandler} />
                </Aux>
            )
            orderSummary = <OrderSummary ingredients={this.state.ingredients}
                cancel={this.purchaseCancelHandler}
                continue={this.purchaseContinueHandler}
                totalPrice={this.state.totalPrice} />
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

export default withErrorHandler(BurgerBuilder, axios)