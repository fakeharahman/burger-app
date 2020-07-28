import React from "react"
import Aux from "../../../hoc/Auxillary/Auxillary"
import Button from "../../UI/Button/Button"

const OrderSummary = props => {



    const ingredientItems = Object.keys(props.ingredients);
    const ingredients = ingredientItems
        .map(key => <li key={key}><span
            style={{ textTransform: "capitalize" }}>{key}</span>: {props.ingredients[key]}</li>)



    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following:</p>
            <ul>
                {ingredients}
            </ul>
            <hr />
            <p><strong>Total Price: Rs.{props.totalPrice.toFixed(2)}</strong> </p>
            <p>Continue to checkout?</p>
            <Button btnType="Danger" clicked={props.cancel}>CANCEL</Button>
            <Button btnType="Success" clicked={props.continue}>CONTINUE</Button>
        </Aux>
    )
}

export default OrderSummary;