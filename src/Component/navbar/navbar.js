import React, { useState } from "react";
import Cart from "../cart/cart";
import Badge from "react-bootstrap/Badge";

const Navbar = ({
    appName,
    cartItems,
    handleQuantity,
    handleDeleteitem,
    searchWord,
    clearCart,
    cartPrice,
}) => {
    const [state, setState] = useState({
        showModal: false,
    });

    const handleCart = () => {
        setState({
            showModal: !state.showModal,
        });
    };

    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <div className="grid-left" style={{ color: "white" }}>
                    <h3>{appName}</h3>
                </div>
                <div className="grid-right">
                    <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={handleCart}
                    >
                        Cart{" "}
                        <Badge pill variant="light">
                            {cartItems.length}
                        </Badge>
                    </button>
                    <Cart
                        show={state.showModal}
                        displayCart={handleCart}
                        cartItems={cartItems}
                        handleDeleteitem={handleDeleteitem}
                        handleQuantity={handleQuantity}
                        clearCart={clearCart}
                        cartPrice={cartPrice}
                        searchWord={searchWord}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
