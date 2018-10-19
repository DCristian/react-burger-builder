import React from 'react';

import classes from './Order.css';

const order = (props) => {
    const ingredients = [];
    for (let name in props.order.ingredients) {
        ingredients.push({
            name: name,
            amount: props.order.ingredients[name]
        })
    }

    const ingredientOutput = ingredients.map(ig => {
        return <span
            className={classes.Ingredient}
            key={ig.name}>{ig.name} ({ig.amount})</span>;
    });

    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>USD {props.order.price.toFixed(2)}</strong></p>
        </div>
    );
};

export default order;