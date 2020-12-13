import React, { useState } from "react";
import Card from "react-bootstrap/Card";

const CartItem = ({ item, handleQuantity, handleDeleteitem }) => {
    const [state, setstate] = useState({
        quantity: item.quantity,
    });
    const maxQ = Array.apply(
        null,
        Array(parseInt(state.quantity) + 10).map((val, index) => index)
    );

    const updateQuantity = (event, item) => {
        console.log(event.target.value);
        setstate({
            quantity: event.target.value,
        });
        handleQuantity(item, event.target.value);
    };

    return (
        <div className="card mb-3">
            {/* <hr/> */}
            <div className="row g-0">
                <div className="card-body col-md-4">
                    <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "9rem" }}
                    />
                </div>
                <div className="card-body col-md-6">
                        <h2>{item.title}</h2>
                        <div>
                            <label>indiv: {item.price}</label>
                            <label>total: {item.price * state.quantity} </label>
                        </div>
                </div>
                <div className=" card-footer col-md-2">
                    <div>
                        <select
                            onChange={(e) => updateQuantity(e, item)}
                            value={state.quantity}
                            name="quantity"
                        >
                            {maxQ.map((el, i) => (
                                <option value={i + 1} key={i}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button onClick={() => handleDeleteitem(item)}>
                            Suppr
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
