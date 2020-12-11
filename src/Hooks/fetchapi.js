import { useState, useEffect } from "react";

const FetchApi = (baseURL) => {
    //Déclaration principal
    const [state, setstate] = useState({
        items: [], //Liste d'items appartement à l'API
        isLoading: true, //to say if the hook is loading or not
    });

    //Corps de la fonction
    useEffect(() => {
        (async () => {
            const response = await fetch(baseURL);
            const json_data = await response.json();
            if (response.ok) {
                //l'API a renvoyé une réponse correcte
                setstate({
                    items: json_data,
                    isLoading: false,
                });
            } else {
                //la réponse fournie par l'API n'est pas bonne
                console.log(
                    `An error as occured during the fetch of datas' API`
                );
                console.log(JSON.stringify(json_data));
                setstate({
                    items: "error",
                    isLoading: false,
                });
            }
        })();
    }, [baseURL]);

    return [state.items, state.isLoading];
};

export default FetchApi;
