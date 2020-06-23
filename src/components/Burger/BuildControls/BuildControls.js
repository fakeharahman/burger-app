import React from "react"
import classes from "./BuildControls.module.css"
import BuildControl from "./BuildControl/BuildControl"


const controls = [
    { label: "Salad", type: "salad" },
    { label: "Meat", type: "meat" },
    { label: "Bacon", type: "bacon" },
    { label: "Cheese", type: "cheese" },
]

const buildControls = props => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>Rs.{props.price.toFixed(2)}</strong></p>
        {
            controls.map(ctrl => <BuildControl label={ctrl.label}
                key={ctrl.label}
                added={() => props.addIngredient(ctrl.type)}
                deleted={() => props.deleteIngredient(ctrl.type)}
                disabled={props.disabled[ctrl.type]} />)
        }

        <button className={classes.OrderButton}
            disabled={!props.purchaseable}
            onClick={props.purchasing}>ORDER NOW!</button>

    </div>
)


export default buildControls