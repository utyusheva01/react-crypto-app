import {createContext, useContext, useEffect, useState} from 'react';
import {fakeFetchCrypto, fetchAssets} from "../api.js";
import {percentDifference} from "../utils.js";

const CryptoContext = createContext({
    assets: [],
    crypto: [],
    loading: false,
})

export function CryptoContextProvider({children}) {
    const [loading, setLoading] = useState(false)
    const [crypto, setCrypto] = useState([])
    const [assets, setAssets] = useState([])

    function mapAssets(assets, result) {
        return assets.map((asset) => {
            const coin = result.find((c) => c.id === asset.id)
            console.log(coin)
            return {
                grow: asset.price < coin.price,//boolean
                growPercent: percentDifference(asset.price, coin.price),
                totalAmount: asset.amount * coin.price,
                totalProfit: asset.amount * coin.price - (asset.amount * asset.price),
                name: coin.name,
                ...asset,
            }
        })
    }

    useEffect(() => {
        async function preload() {
            setLoading(true)
            const {result} = await fakeFetchCrypto()
            const assets = await fetchAssets()

            setAssets(mapAssets(assets, result))
            setCrypto(result)
            setLoading(false)
        }

        preload()
    }, [])

    function addAsset(newAsset) {
        setAssets(prevAssets => {
            // Ищем индекс актива с таким же id
            const existingAssetIndex = prevAssets.findIndex(asset => asset.id === newAsset.id);

            if (existingAssetIndex !== -1) {
                // Если актив с таким id найден, обновляем его данные
                const updatedAssets = [...prevAssets];
                updatedAssets[existingAssetIndex] = {
                    ...updatedAssets[existingAssetIndex],
                    ...newAsset,
                    grow: updatedAssets[existingAssetIndex].price < newAsset.price,
                    growPercent: percentDifference(updatedAssets[existingAssetIndex].price, newAsset.price),
                    totalAmount: updatedAssets[existingAssetIndex].amount * newAsset.price,
                    totalProfit: updatedAssets[existingAssetIndex].amount * newAsset.price - (updatedAssets[existingAssetIndex].amount * updatedAssets[existingAssetIndex].price),
                };

                return updatedAssets;
            } else {
                // Если актива с таким id нет, добавляем новый
                return [...prevAssets, newAsset];
            }
        });
    }

    return (
        <CryptoContext.Provider value={{loading, crypto, assets, addAsset}}>
            {children}
        </CryptoContext.Provider>
    )

}

export default CryptoContext;

export function useCrypto() {
    return useContext(CryptoContext)
}