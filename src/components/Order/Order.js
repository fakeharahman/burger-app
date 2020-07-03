import React from 'react'
import classes from './Order.module.css'
const Order = props => {

    const ingredients = [];
    for (let ingredient in props.ingredients) {
        ingredients.push({ name: ingredient, amt: props.ingredients[ingredient] })
    }

    const ingredientOutput = ingredients.map(ig =>
        (<span key={ig.name} style={{
            textTransform: "capitalize",
            display: 'inline-block',
            margin: '0 8px',
            border: "1px solid #ccc",
            padding: "5px"
        }}>{ig.name} ({ig.amt})  </span>))

    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>Rs. {props.price.toFixed(2)}</strong></p>
        </div>
    )
}

export default Order