import React from "react"
import Aux from "../../hoc/Auxillary"

const orderSummary = props => {

    const ingredientItems = Object.keys(props.ingredients);
    const ingredients = ingredientItems
        .map(key => <li key={key}><span style={{ textTransform: "capitalize" }}>{key}</span>: {props.ingredients[key]}</li>)


    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following:</p>
            <ul>
                {ingredients}
            </ul>
            <p>Continue to checkout?</p>
        </Aux>)
}

export default orderSummary;