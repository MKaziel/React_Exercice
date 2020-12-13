import React from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Badge from "react-bootstrap/Badge";

const Sidebar = ({
    //Fonction de gestion d'évènements
    handleSearch,
    handlePrice,
    handleCategories,
    //Listes d'items
    listCategories,
    //Valeurs par défaut des sliders
    pricevalue,
    priceparam,
}) => (
    <div className="col-sm-4">
        <div id="searchzone" name="searchzone" >
            <label className="form-label">
                Search :
                <input
                    type="text"
                    id="search"
                    name="search"
                    onChange={handleSearch}
                    style = {{ width: "auto", marginLeft : "10px"}}
                />
            </label>
        </div>
        <hr />
        <div id="categorieszone" name="categorieszone">
            {listCategories ? (
                listCategories.map((el) => {
                    return (
                        <label
                            key={el._id}
                            className="col-md-6 form-check-label"
                        >
                            <Badge
                                pill
                                variant="primary"
                                style={{
                                    background: "#0d6efd",
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                }}
                            >
                                {el.products.length}
                            </Badge>
                            {el.name} :
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name={el.id}
                                id={el.id}
                                onChange={handleCategories}
                                value={el.name}
                                style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                }}
                            />
                        </label>
                    );
                })
            ) : (
                <span>No categories found</span>
            )}
        </div>
        <hr />
        <div id="pricezone" name="pricezone" style={{ margin: "10px", padding: "5px" }}>
            <label style={{ paddingBottom: "30px" }}>
                Select a range for price:{" "}
            </label>
            <InputRange
                name="price"
                draggableTrack
                minValue={priceparam[1]}
                maxValue={priceparam[0]}
                value={pricevalue}
                onChange={handlePrice}
            />
        </div>
        <hr />
    </div>
);

export default Sidebar;
