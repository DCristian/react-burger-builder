import React, {Component} from 'react';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import {databaseRef} from '../../firebase';

class Checkout extends Component {
    state = {
        ingredients: null
    };

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    };

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    };

    componentDidMount () {
        databaseRef.child('ingredients')
            .once('value')
            .then(response => {
                this.setState({
                    ingredients: response.val()
                });
            })
            .catch(error => {});
    }

    render () {
        let summary = <Spinner/>;

        if (this.state.ingredients) {
            summary = <CheckoutSummary
                ingredients={this.state.ingredients}
                checkoutCancelled={this.checkoutCancelledHandler}
                checkoutContinue={this.checkoutContinueHandler}/>;
        }

        return (
            <div>
                {summary}
            </div>
        );
    }
}

export default Checkout;