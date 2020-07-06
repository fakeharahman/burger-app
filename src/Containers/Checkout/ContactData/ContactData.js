import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/spinner'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'

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
                    required: true
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
                value: '',
                validation: {},
                valid: true
            }
        },
        loading: false,
        formIsValid: false
    }

    orderHandler = (e) => {
        e.preventDefault();
        // console.log(this.props.ingredients)
        this.setState({ loading: true })
        const formData = {};
        for (let identifier in this.state.orderForm) {
            formData[identifier] = this.state.orderForm[identifier].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        axios.post("/orders.json", order)
            .then(response => {
                // console.log(response)
                this.setState({ loading: false })
                this.props.history.push("/")
            })
            .catch(error => {
                console.log(error)
                this.setState({ loading: false })

            })

    }

    checkValidity = (value, rules) => {
        let isValid = true;
        if (!rules) return true

        if (rules.required) {
            isValid = value.trim() !== '' && isValid; //smart solution
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputChangedHandler = (e, inputIdentifier) => {
        // console.log(e.target.value)
        const updatedOrderForm = { ...this.state.orderForm };

        const updatedFormElement = { ...updatedOrderForm[inputIdentifier] }
        updatedFormElement.value = e.target.value
        updatedFormElement.touched = true;
        // if (updatedFormElement.valid)
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        // console.log(updatedFormElement)
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
        if (this.state.loading) {
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
        ings: state.ingredients,
        price: state.totalPrice
    }
}
export default connect(mapStateToProps)(ContactData)