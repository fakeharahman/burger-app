import React, { Component } from 'react'
import Order from '../../components/Order/Order'
import Axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Spinner from '../../components/UI/Spinner/spinner'

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        Axios.get('/orders.json')
            .then(response => {
                console.log(response.data)
                const orders = [];
                for (let key in response.data) {
                    orders.push({ ...response.data[key], id: key })
                }
                this.setState({ loading: false, orders: orders })
            })
            .catch(error => {
                this.setState({ loading: false })

            })
    }

    render() {
        let orders = this.state.orders.map(order => (<Order key={order.id}
            ingredients={order.ingredients}
            price={+order.price} />))
        if (this.state.loading) {
            orders = <Spinner />
        }
        return (
            <div>
                {orders}
            </div>
        )
    }
}
export default withErrorHandler(Orders, Axios)