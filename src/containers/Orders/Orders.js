import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import { databaseRef } from '../../firebase';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    };

    componentDidMount() {
        databaseRef.child('orders')
            .once('value')
            .then(response => {
                let orders = [];
                const data = response.val();
                for (let key in data) {
                    orders.push({
                        ...data[key],
                        id: key
                    })
                }

                this.setState({
                    orders: orders,
                    loading: false
                });
            })
            .catch(error => {});
    }

    render () {
        let orders = this.state.orders.map(order => (
            <Order
                key={order.id}
                order={order}/>
        ));
        if (this.state.loading) {
            orders = <Spinner/>;
        }

        return (
            <div>
                {orders}
            </div>
        );
    }
}

export default Orders;