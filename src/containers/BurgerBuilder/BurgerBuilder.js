import React, { Component } from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner'
import { databaseRef } from '../../firebase';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};
const MIN_PRICE = 4;

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: MIN_PRICE,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    ingredientsUpdatedHandler = (ingredients) => {
        const sum = Object.keys(ingredients)
            .reduce((sum, key) => sum + INGREDIENT_PRICES[key] * ingredients[key], 0);
        const totalPrice = MIN_PRICE + sum;
        const purchasable = totalPrice > MIN_PRICE;

        this.setState({
            totalPrice: totalPrice,
            purchasable:  purchasable
        });
    };

    addIngredientHandler = (type) => {
        const ingredients = {
            ...this.state.ingredients
        };
        ingredients[type] = this.state.ingredients[type] + 1;

        databaseRef.child('ingredients')
            .update(ingredients)
            .then(response => {})
            .catch(error => {});
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }

        const ingredients = {
            ...this.state.ingredients
        };
        ingredients[type] = oldCount - 1;

        databaseRef.child('ingredients')
            .update(ingredients)
            .then(response => {})
            .catch(error => {});
    };

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
    };

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    };

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    };

    loadIngredients = () => {
        databaseRef.child('ingredients')
            .on('value', snapshot => {
                this.setState({
                    ingredients: snapshot.val()
                });
                this.ingredientsUpdatedHandler(snapshot.val());
            });
    };

    componentDidMount() {
        this.loadIngredients();
    }

    componentWillUnmount() {
        databaseRef.child('ingredients').off();
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger = this.state.error ? <p>Couldn't load the Ingredients</p> : <Spinner/>;
        let orderSummary = null;

        if (this.state.ingredients) {
            burger = (
                <>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
                </>
            );
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }

        return (
            <>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </>
        );
    }
}

export default BurgerBuilder;