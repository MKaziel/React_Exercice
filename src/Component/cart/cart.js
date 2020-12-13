import React, { memo, PureComponent } from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button'
import CartItem from "./cartItem";
import CardDeck from 'react-bootstrap/CardDeck'

class Cart extends PureComponent {
    render() {
        const {
            show,
            displayCart,
            cartItems,
            handleDeleteitem,
            handleQuantity,
            clearCart,
            cartPrice,
        } = this.props;

        if (!show) {
            return null;
        }

        return (
            <div className="modal" id="modal">
                <Modal show={show} onHide={displayCart} size="lg">
                    <Modal.Header>
                        <Modal.Title>
                        Cart: {cartItems.length}{" "}
                        {cartItems.length > 1 ? (
                            <span>item(s)</span>
                        ) : (
                            <span>item</span>
                        )}
                        </Modal.Title>
                        <Button variant="secondary" onClick={clearCart}>Clear Cart</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <CardDeck>
                        {cartItems && cartItems.length > 0 ? (
                            cartItems.map((cartItem, index) => (
                                <CartItem
                                    key={index}
                                    item={cartItem}
                                    handleDeleteitem={handleDeleteitem}
                                    handleQuantity={handleQuantity}
                                />
                            ))
                        ) : (
                            <div>Empty Cart</div>
                        )}
                        </CardDeck>
                    </Modal.Body>
                    <Modal.Footer>
                        <label>Total Cart : {cartPrice}</label>
                        <Button variant="primary" onClick={displayCart}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default memo(Cart);