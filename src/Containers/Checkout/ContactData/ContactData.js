import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/spinner'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index'
import { updateObject, checkValidity } from '../../../shared/utility'

class ContactData extends Component {
    state = {
        orderForm: {

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
        },

        formIsValid: false
    }

    orderHandler = (e) => {
        e.preventDefault();
        // console.log(this.props.ingredients)

        const formData = {};
        for (let identifier in this.state.orderForm) {
            formData[identifier] = this.state.orderForm[identifier].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order, this.props.token)

    }


    inputChangedHandler = (e, inputIdentifier) => {
        // console.log(e.target.value)


        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: e.target.value,
            touched: true,
            valid: checkValidity(e.target.value, this.state.orderForm[inputIdentifier].validation)
        })
        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        });
        let formValid = true;
        for (let input in updatedOrderForm) {
            formValid = updatedOrderForm[input].valid && formValid
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid: formValid })
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (<form onSubmit={this.orderHandler}>

            {formElementsArray.map(ele => (
                <Input key={ele.id} elementType={ele.config.elementType}
                    elementConfig={ele.config.elementConfig}
                    value={ele.config.value} changed={(e) => this.inputChangedHandler(e, ele.id)}
                    invalid={!ele.config.valid} shouldValidate={ele.config.validation}
                    touched={ele.config.touched} />
            ))}
            <Button btnType='Success' disabled={!this.state.formIsValid}>ORDER</Button>

        </form>);
        if (this.props.loading) {
            form = <Spinner />
        }

        return (<div className={classes.ContactData}>
            <h4>Enter your contact data</h4>
            {form}
        </div>)
    }
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