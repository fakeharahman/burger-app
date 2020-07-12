import React, { Component } from "react"
import Aux from "../../../hoc/Auxillary/Auxillary"
import Button from "../../UI/Button/Button"

class OrderSummary extends Component {

    render() {

        const ingredientItems = Object.keys(this.props.ingredients);
        const ingredients = ingredientItems
            .map(key => <li key={key}><span
                style={{ textTransform: "capitalize" }}>{key}</span>: {this.props.ingredients[key]}</li>)



        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A delicious burger with the following:</p>
                <ul>
                    {ingredients}
                </ul>
                <hr />
                <p><strong>Total Price: Rs.{this.props.totalPrice.toFixed(2)}</strong> </p>
                <p>Continue to checkout?</p>
                <Button btnType="Danger" clicked={this.props.cancel}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.continue}>CONTINUE</Button>
            </Aux>
        )
    }
}
export default OrderSummary;