import React, { useState } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/spinner'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index'
import { updateObject, checkValidity } from '../../../shared/utility'

const ContactData = props => {
    const [orderForm, setOrderForm] = useState(
        {

            name: {
                elementType: 'input',  // HTML name
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                    maxLength: 6
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [{ value: 'fastest', displayValue: 'Fastest' },
                    { value: 'cheapest', displayValue: 'Cheapest' },

                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        })
    const [formIsValid, setFormIsValid] = useState(false)



    const orderHandler = (e) => {
        e.preventDefault();
        // console.log(this.props.ingredients)

        const formData = {};
        for (let identifier in orderForm) {
            formData[identifier] = orderForm[identifier].value
        }
        const order = {
            ingredients: props.ings,
            price: props.price,
            orderData: formData,
            userId: props.userId
        }
        props.onOrderBurger(order, props.token)

    }


    const inputChangedHandler = (e, inputIdentifier) => {
        // console.log(e.target.value)


        const updatedFormElement = updateObject(orderForm[inputIdentifier], {
            value: e.target.value,
            touched: true,
            valid: checkValidity(e.target.value, orderForm[inputIdentifier].validation)
        })
        const updatedOrderForm = updateObject(orderForm, {
            [inputIdentifier]: updatedFormElement
        });
        let formValid = true;
        for (let input in updatedOrderForm) {
            formValid = updatedOrderForm[input].valid && formValid
        }
        setOrderForm(updatedOrderForm);
        setFormIsValid(formValid)
    }


    const formElementsArray = [];
    for (let key in orderForm) {
        formElementsArray.push({
            id: key,
            config: orderForm[key]
        })
    }

    let form = (<form onSubmit={orderHandler}>

        {formElementsArray.map(ele => (
            <Input key={ele.id} elementType={ele.config.elementType}
                elementConfig={ele.config.elementConfig}
                value={ele.config.value} changed={(e) => inputChangedHandler(e, ele.id)}
                invalid={!ele.config.valid} shouldValidate={ele.config.validation}
                touched={ele.config.touched} />
        ))}
        <Button btnType='Success' disabled={!formIsValid}>ORDER</Button>

    </form>);
    if (props.loading) {
        form = <Spinner />
    }

    return (<div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
    </div>)

}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (order, token) => dispatch(actions.purchaseBurger(order, token))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios))