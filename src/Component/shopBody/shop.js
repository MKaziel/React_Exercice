import React, { memo } from 'react'
import Product from "./product"

import CardDeck from 'react-bootstrap/CardDeck'

const Shop = ({ isLoading, productList, addProductToCart, searchWord}) => (
    <div className="col-sm row row-cols-1 row-cols-md-2 g-0">
        {isLoading && <p>The shop is loading ...</p>}
        { !isLoading && productList.length>0 ? productList.map(
            (product, key) => {
                return (
                    <Product key={key} id={product._id} product={product} addProductToCart={addProductToCart} searchWord={searchWord} />
                )
            }
        ) : <p> No products available</p>}
    </div>
)

export default memo(Shop)