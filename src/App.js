//! Import essentiel venant des modules de bases
import React from "react";
import { useReducer, useCallback, useState, useEffect, useRef } from "react";
//! Import venant des outils créés
import config from "./API/configAPI";
import FetchApi from "./Hooks/fetchapi";
import Sidebar from "./Component/sidebar/sidebar";
import Shop from "./Component/shopBody/shop";
import Navbar from "./Component/navbar/navbar";
//! Autre import
import "./App.css";
import "./Bootstrap/css/bootstrap.css";

//Etat initiale
const init = () => ({
    searchValue: "",
    cart: [],
    filters: [],
    price: {
        max: 0,
        min: 0,
    },
    price_param: {
        max: 1000,
        min: 0,
    },
    showCart: false,
});

//Gestionnaire d'action selon le paramètre fourni
const reducer = (state, action) => {
    switch (action.type) {
        case "add_to_cart":
            return {
                ...state,
                cart: [...state.cart, action.payload],
            };
        case "update_in_cart":
            return {
                ...state,
                cart: [
                    ...state.cart.slice(0, action.payload.index),
                    action.payload.item,
                    ...state.cart.slice(action.payload.index + 1),
                ],
            };
        case "cleanCart":
            return {
                ...state,
                cart: [],
            };
        case "remove_one_from_cart":
            return {
                ...state,
                cart: state.cart.filter((el) => el.id !== action.payload),
            };
        case "search":
            return {
                ...state,
                searchValue: action.payload,
            };
        case "price":
            return {
                ...state,
                price: {
                    ...action.payload,
                },
            };
        case "add_one_filter":
            return {
                ...state,
                filters: [...state.filters, action.payload],
            };
        case "remove_one_filter":
            return {
                ...state,
                filters: state.filters.filter((cat) => cat !== action.payload),
            };

        default:
            console.log("ERROR IN REDUCER");
            console.log(action);
            return -1;
    }
};

//Corps du code pour le shop
const App = () => {
    const [state, dispatch] = useReducer(reducer, 0, init); //Gestion de l'état version hook
    const [shopItems, isLoading] = FetchApi(config.API.url); //Récupération des données de l'API
    const [categories, setcategories] = useState([]); //Création d'un state pour gérer les catégories du shop
    const [filteredItems, setfilteredItems] = useState([]); //Création d'un state pour gérer les produits à afficher dans le shop
    const [cartPrice, setCartPrice] = useState([]);
    //Déclaration de référence pour gérer le prix maximum et minimum présent dans la boutique
    const maxPrice = useRef();
    const minPrice = useRef();

    //Gestion de la fonctionnalité de recherche textuelle
    const handleSearch = useCallback((e) => {
        dispatch({ type: "search", payload: e.target.value.toLowerCase() });
    }, []);

    //Gestion de la fonctionnalité de filtre sur les prix
    const handlePrice = useCallback((e) => {
        dispatch({ type: "price", payload: e });
    }, []);

    //Gestion de la fonctionnalité de filtre sur les catégories
    const handleCatgories = useCallback((e) => {
        const checked = e.target.checked;
        const name = e.target.value;
        if (checked) {
            dispatch({ type: "add_one_filter", payload: name });
        } else {
            dispatch({ type: "remove_one_filter", payload: name });
        }
    }, []);

    //Gestion des catégories disponibles
    useEffect(() => {
        const cats = [];
        let _id = 0;
        shopItems.forEach((item) => {
            const index = cats.findIndex((el) => el.name === item.category);
            if (
                typeof maxPrice.current === "undefined" ||
                maxPrice.current < item.price
            )
                maxPrice.current = Math.round(parseInt(item.price));
            if (
                typeof minPrice.current === "undefined" ||
                minPrice.current > item.price
            )
                minPrice.current = Math.round(parseInt(item.price));
            if (state.price.max === 0 || state.price.min === 0) {
                dispatch({
                    type: "price",
                    payload: { max: maxPrice.current, min: minPrice.current },
                });
            }
            if (index >= 0) {
                cats[index].products.push(item);
            } else {
                const newCat = {
                    _id,
                    name: item.category,
                    products: [item],
                };
                cats.push(newCat);
                _id++;
            }
            setcategories(cats);
            setfilteredItems(shopItems);
        });
    }, [state.price, shopItems, maxPrice, minPrice]);

    //Mise en place de l'action permettant de récupérer tout les items répondant aux filtres mis en place
    //Plus initialisation des prix max et min lors du premier appel de la page
    useEffect(() => {
        const filtered_item = shopItems.filter((item) => {
            if (
                item.title.toLowerCase().includes(state.searchValue) &&
                (state.filters.includes(item.category) ||
                    state.filters.length === 0) &&
                parseInt(item.price) <= state.price.max &&
                parseInt(item.price) >= state.price.min
            ) {
                return true;
            }
            return false;
        });
        setfilteredItems(filtered_item);
    }, [shopItems, state.searchValue, state.filters, state.price]);

    useEffect(() => {
        const totalPrice = () => {
            let total = 0;
            const cartItems = state.cart;
            if (cartItems && cartItems.length > 0) {
                cartItems.forEach((element) => {
                    total = total + element.price * element.quantity;
                });
            }
            return Math.round((total + Number.EPSILON) * 100) / 100;
        };
        setCartPrice(totalPrice);
    }, [state.cart]);
    //Gestion du panier d'achat
    //Gestion de la fonctionnalité de remplissage du panier (Remplissage par item)
    const addToCart = useCallback(
        (item, quantity) => {
            const cartItem = {
                ...item,
                quantity,
            };
            const indexCartItem = state.cart.findIndex(
                (index) => index.id === item.id
            );
            if (indexCartItem !== -1) {
                cartItem.quantity =
                    parseInt(state.cart[indexCartItem].quantity) +
                    parseInt(quantity);
                dispatch({
                    type: "update_in_cart",
                    payload: { item: cartItem, index: indexCartItem },
                });
            } else {
                dispatch({ type: "add_to_cart", payload: cartItem });
            }
        },
        [state.cart]
    );

    //Gestion de la fonctionnalité de vidage du panier (Vidage complet)
    const cleanCart = useCallback(() => {
        dispatch({ type: "cleanCart" });
    }, []);

    //Gestion de la fonctionnalité de mise à jour d'un objet dans le panier
    const modifyQuantity = useCallback(
        (item, qte) => {
            const cartItem = {
                ...item,
                quantity: qte,
            };
            const cartItemIndex = state.cart.findIndex(
                (el) => el.id === cartItem.id
            );
            dispatch({
                type: "update_in_cart",
                payload: { item: cartItem, index: cartItemIndex },
            });
        },
        [state.cart]
    );

    //Gestion de la fonctionnalité de suppression d'un item dans le panier
    const removeOneFromCart = useCallback((item) => {
        dispatch({ type: "remove_one_from_cart", payload: item.id });
    }, []);

    return (
        <div className="body">
            <header className="header">
                <Navbar
                    appName="React Shop"
                    cartItems={state.cart}
                    handleDeleteitem={removeOneFromCart}
                    handleQuantity={modifyQuantity}
                    clearCart={cleanCart}
                    cartPrice={cartPrice}
                />
            </header>
            <div className="container" style={{marginTop:"10px"}}>
                <div className="row">
                    <Sidebar
                        listCategories={categories}
                        handleSearch={handleSearch}
                        handlePrice={handlePrice}
                        handleCategories={handleCatgories}
                        pricevalue={state.price}
                        priceparam={[maxPrice.current, minPrice.current]}
                    />
                    <Shop
                        isLoading={isLoading}
                        productList={filteredItems}
                        addProductToCart={addToCart}
                        searchWord={state.searchValue}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
