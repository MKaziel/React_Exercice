//! Import essentiel venant des modules de bases
import React from "react";
import { useReducer, useCallback, useState, useEffect, useRef } from "react";
//! Import venant des outils créés
import config from "./API/configAPI";
import FetchApi from "./Hooks/fetchapi";
import Sidebar from "./Component/sidebar/sidebar";
import Shop from "./Component/shopBody/shop";
//! Autre import
import "./App.css";

const init = () => ({
    searchValue: "",
    cart: [],
    filters: [],
    price: {
        max: 0,
        min: 0,
    },
    price_param:{
      max: 1000,
      min: 0
    }
});

const reducer = (state, action) => {
    switch (action.type) {
        case "search":
            return {
                ...state,
                searchValue: action.payload,
            };
        case "price":
            return {
                ...state,
                price: {
                    ...action.payload
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
            break;
    }
};

const App = () => {
    const [state, dispatch] = useReducer(reducer, 0, init);
    const [shopItems, isLoading] = FetchApi(config.API.url);
    const [categories, setcategories] = useState([]);
    const [filteredItems, setfilteredItems] = useState([]);
    const maxPrice  = useRef()
    const minPrice = useRef()

    const handleSearch = useCallback((e) => {
        dispatch({ type: "search", payload: e.target.value.toLowerCase() });
    }, []);

    const handlePrice = useCallback((e) => {
        dispatch({type:"price", payload: e})
        console.log(e);
    }, []);

    const handleCatgories = useCallback(
        (e) => {
            const checked = e.target.checked;
            const name = e.target.value;
            if (checked) {
                dispatch({ type: "add_one_filter", payload: name });
            } else {
                dispatch({ type: "remove_one_filter", payload: name });
            }
        },
        []
    );

    //Gestion des catégories disponibles
    useEffect(() => {
        const cats = [];
        let _id = 0;
        shopItems.forEach((item) => {
            const index = cats.findIndex((el) => el.name === item.category);
            if(typeof maxPrice.current === "undefined" || maxPrice.current<item.price) maxPrice.current = Math.round(parseInt(item.price)) + 1
            if(typeof minPrice.current === "undefined" || minPrice.current>item.price) minPrice.current = Math.round(parseInt(item.price)) - 1
            if(state.price.max === 0 || state.price.min === 0){
              dispatch({type:"price", payload: {"max": maxPrice.current, "min": minPrice.current}})
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
        console.log(maxPrice);
        console.log(minPrice);
    }, [state.price, shopItems, maxPrice, minPrice]);

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

    return (
        <div>
            <div>
                <Sidebar
                    listCategories={categories}
                    handleSearch={handleSearch}
                    handlePrice={handlePrice}
                    handleCategories={handleCatgories}
                    pricevalue={state.price}
                    priceparam={[maxPrice.current,minPrice.current]}
                />
            </div>
            <div>
                <Shop isLoading={isLoading} productList={filteredItems} />
            </div>
        </div>
    );
};

export default App;
