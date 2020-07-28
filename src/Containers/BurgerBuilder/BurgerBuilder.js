import React, { useState, useEffect } from "react";
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

export const BurgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false)
    useEffect(() => {
        props.onInitIngredient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((sum, cur) => sum += cur, 0)
        return sum > 0


    }

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true)
        }
        else {
            props.onSetRedirectPath('/checkout')
            props.history.push("/auth");
        }

    }

    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        // }
        // queryParams.push("price=" + this.state.totalPrice)
        // const queryStr = queryParams.join('&')
        props.onInitPurchase()
        props.history.push("/checkout");

        // {
        // pathname: "/checkout",
        // search: "?" + queryStr
        // })
    }



    const disabledInfo = { ...props.ings };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }
    //salad: true, meat: false
    let orderSummary = null;




    let burger = (props.error) ? <p>Ingredients can't be loaded</p> : <Spinner />

    if (props.ings) {
        burger = (
            <Aux>
                <Burger ingredients={props.ings} />
                <BuildControls addIngredient={props.onIngredientAdded}
                    deleteIngredient={props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={props.price}
                    purchaseable={updatePurchaseState(props.ings)}
                    purchasing={purchaseHandler}
                    isAuth={props.isAuthenticated}
                />
            </Aux>
        )
        orderSummary = <OrderSummary ingredients={props.ings}
            cancel={purchaseCancelHandler}
            continue={purchaseContinueHandler}
            totalPrice={props.price} />
    }



    return (
        <Aux>
            <Modal show={purchasing}
                closeModal={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    )

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