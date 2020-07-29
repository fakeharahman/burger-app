import React, { useState, useEffect, useCallback } from "react";
import Aux from "../../hoc/Auxillary/Auxillary"
import Burger from "../../components/Burger/Burger"
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal"
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary"
import Spinner from '../../components/UI/Spinner/spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import { useDispatch, useSelector } from "react-redux";
import axios from '../../axios-orders'
// import * as actions from '../../store/actions/index'

export const BurgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false)

    const dispatch = useDispatch()


    const ings = useSelector(state => state.burgerBuilder.ingredients)
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error)
    const isAuthenticated = useSelector(state => state.auth.token !== null)

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName))
    const onInitIngredient = useCallback(() => dispatch(actions.initIngredients()), [dispatch])
    const onInitPurchase = () => dispatch(actions.purchaseInit())
    const onSetRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));


    useEffect(() => {
        onInitIngredient();
    }, [onInitIngredient])



    const updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((sum, cur) => sum += cur, 0)
        return sum > 0


    }

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true)
        }
        else {
            onSetRedirectPath('/checkout')
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
        onInitPurchase()
        props.history.push("/checkout");

        // {
        // pathname: "/checkout",
        // search: "?" + queryStr
        // })
    }



    const disabledInfo = { ...ings };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }
    //salad: true, meat: false
    let orderSummary = null;




    let burger = (error) ? <p>Ingredients can't be loaded</p> : <Spinner />

    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls addIngredient={onIngredientAdded}
                    deleteIngredient={onIngredientRemoved}
                    disabled={disabledInfo}
                    price={price}
                    purchaseable={updatePurchaseState(ings)}
                    purchasing={purchaseHandler}
                    isAuth={isAuthenticated}
                />
            </Aux>
        )
        orderSummary = <OrderSummary ingredients={ings}
            cancel={purchaseCancelHandler}
            continue={purchaseContinueHandler}
            totalPrice={price} />
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

export default (withErrorHandler(BurgerBuilder, axios))