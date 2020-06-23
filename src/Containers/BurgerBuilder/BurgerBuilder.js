import React, { Component } from "react";
import Aux from "../../hoc/Auxillary"
import Burger from "../../components/Burger/Burger"
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal"

const INGREDIENT_PRICES = {
    meat: 30,
    cheese: 15,
    bacon: 25,
    salad: 20
}

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 40,
        purchaseable: false

    }

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((sum, cur) => sum += cur, 0)
        this.setState({
            purchaseable: sum >= 0
        })
        console.log(sum, ingredients)
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

    render() {

        const disabledInfo = { ...this.state.ingredients };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        //sald: true, meat: false

        return (
            <Aux>
                <Modal></Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls addIngredient={this.addIngredientHandler}
                    deleteIngredient={this.deleteIngredientHandler}
                    disabled={disabledInfo} price={this.state.totalPrice}
                    purchaseable={this.state.purchaseable} />
            </Aux>
        )
    }
}

export default BurgerBuilder