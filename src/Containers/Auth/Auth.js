import React, { Component } from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/spinner';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility'


class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',  // HTML name
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',  // HTML name
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: true
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirect()
        }
    }



    inputChangedHandler = (e, controlName) => {
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: e.target.value,
                touched: true,
                valid: checkValidity(e.target.value, this.state.controls[controlName].validation)
            })
        })
        this.setState({ controls: updatedControls })
    }

    submitHandler = (e) => {
        e.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup)

    }

    switchAuthModeHandler = () => {
        this.setState(prevState => { return { isSignup: !prevState.isSignup } })
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }
        let form = formElementsArray.map(ele => (
            <Input key={ele.id}
                elementType={ele.config.elementType}
                elementConfig={ele.config.elementConfig}
                value={ele.config.value}
                changed={(e) => this.inputChangedHandler(e, ele.id)}
                invalid={!ele.config.valid}
                shouldValidate={ele.config.validation}
                touched={ele.config.touched} />
        ))
        if (this.props.loading) {
            form = <Spinner />
        }
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = <p>{this.props.error.message.split('_').join(' ')}</p>
        }
        let authRedirect = null;
        if (this.props.isAuth) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType='Success'>SUBMIT</Button>
                </form>
                <Button btnType='Danger'
                    clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, pass, isSignup) => dispatch(actions.auth(email, pass, isSignup)),
        onSetAuthRedirect: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)