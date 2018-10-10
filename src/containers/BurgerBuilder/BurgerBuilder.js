import React, { Component } from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false
    };

    updatePurchaseState = (ingredients) => {
        const sum = Object.values(ingredients)
            .reduce((sum, el) => sum + el, 0);

        this.setState({
            purchasable: sum > 0
        });
    };

    addIngredientHandler = (type) => {
        const ingredients = {
            ...this.state.ingredients
        };
        ingredients[type] = this.state.ingredients[type] + 1;
        const totalPrice = this.state.totalPrice + INGREDIENT_PRICES[type];

        this.setState({
            totalPrice: totalPrice,
            ingredients: ingredients
        });
        this.updatePurchaseState(ingredients);
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
        const totalPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

        this.setState({
            totalPrice: totalPrice,
            ingredients: ingredients
        });
        this.updatePurchaseState(ingredients);
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
        alert('You continue!');
    };

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        return (
            <>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler} />
                </Modal>
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
    }
}

export default BurgerBuilder;