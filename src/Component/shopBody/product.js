import React, { memo } from "react";
import Button from "react-bootstrap/Button";
import Highlighter from "react-highlight-words";

const Product = ({ product, searchWord, addProductToCart }) => {
    const { title, description, category, image, price } = product;
    const [state, setState] = React.useState({
        quantity: 1,
    });

    const handleQuantityChange = (e) => {
        const name = e.target.name; //On fixe le nom de l'objet récupérer avant de l'utiliser
        setState({
            ...state, //Pour évitier de supprimer de potentielles données le met par défaut
            [name]: e.target.value,
        });
    };

    return (
        <div className="card g-1">
            <div className="card-header">
                <label>
                    <h3>Title:</h3> 
                    <Highlighter textToHighlight={title} searchWords={[searchWord]} />
                </label>
            </div>
            <div className="card-body text-center">
                <img
                    src={image}
                    alt={title}
                    className="card-img-top"
                    style={{ maxWidth: "150px" }}
                />
            </div>
            <div className="card-body">
                <div>
                    <label>
                        <h4>Description :</h4>
                        <Highlighter textToHighlight={description} searchWords={[searchWord]} />
                    </label>
                </div>
                <br/>
                <div>
                    <h6>Categories :</h6>
                    <ul>
                        <li>{category}</li>
                    </ul>
                </div>
            </div>
            <div className="card-footer row">
                <div className="col-md-4">
                    <h5>{price * state.quantity}$</h5>
                </div>
                <div className="col-md-5 text-end">
                    <select
                        id="quantity"
                        name="quantity"
                        onChange={handleQuantityChange}
                        className="form-select-sm"
                    >
                        <option value={1} key="1">
                            1
                        </option>
                        <option value={2} key="2">
                            2
                        </option>
                        <option value={3} key="3">
                            3
                        </option>
                        <option value={4} key="4">
                            4
                        </option>
                        <option value={5} key="5">
                            5
                        </option>
                    </select>
                </div>
                <div className="col-md-3">
                    <Button
                        variant="primary"
                        onClick={() =>
                            addProductToCart(product, state.quantity)
                        }
                    >
                        {" "}
                        Add to cart{" "}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default memo(Product);
