import React, { memo } from 'react'
import Product from "./product"

const Shop = ({ isLoading, productList, addProductToCart}) => (
    <div className="grid">
        {isLoading && <p>The shop is loading ...</p>}
        { !isLoading && productList.length>0 ? productList.map(
            (product) => {
                return (
                    <Product key={product._id} product={product} addProductToCart={addProductToCart} />
                )
            }
        ) : <p> No products available</p>}
    </div>
)

export default memo(Shop)