import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import {databaseRef} from '../../../firebase';
import Spinner from '../../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};
const MIN_PRICE = 4;

class ContactData extends Component {
    state = {
        customer: {
            name: 'Cristian Dumitru',
            email: 'test@test.com',
            address: {
                street: 'Test street',
                postalCode: '123',
                country: 'Romania'
            },
        },
        deliveryMethod: 'fastest',
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();

        this.setState({
            loading: true
        });

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: this.state.customer,
            deliveryMethod: this.state.deliveryMethod
        };

        databaseRef.child('orders')
            .push()
            .set(order)
            .then((response) => {
                this.orderSaved();
            })
            .catch((error) => {
                this.setState({
                    loading: false
                });
                console.log(error);
            });
    };

    setTotalPrice = (ingredients) => {
        const sum = Object.keys(ingredients)
            .reduce((sum, key) => sum + INGREDIENT_PRICES[key] * ingredients[key], 0);
        const totalPrice = MIN_PRICE + sum;

        this.setState({
            totalPrice: totalPrice
        });
    };

    orderSaved = () => {
        databaseRef.child('ingredients')
            .update({
                salad: 0,
                cheese: 0,
                meat: 0,
                bacon: 0
            })
            .then(response => {
                this.props.history.replace('/');
            })
            .catch(error => {});
    };

    componentDidMount() {
        databaseRef.child('ingredients')
            .once('value')
            .then(response => {
                this.setState({
                    ingredients: response.val()
                });
                this.setTotalPrice(response.val())
            })
            .catch(error => {});
    }

    render () {
        let contactData = (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                <form>
                    <input className={classes.Input} type="text" name="name" placeholder="Your name"/>
                    <input className={classes.Input} type="email" name="email" placeholder="Your email"/>
                    <input className={classes.Input} type="text" name="street" placeholder="Street"/>
                    <input className={classes.Input} type="text" name="postal" placeholder="Postal Code"/>
                    <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
                </form>
            </div>
        );
        if (this.state.loading) {
            contactData = <Spinner/>;
        }

        return (
            <>
                {contactData}
            </>
        );
    }
}

export default ContactData;