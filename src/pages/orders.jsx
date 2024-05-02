import { useState, useEffect } from "react"; 
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from "../dl/slices/products";
import { getCategories } from "../dl/slices/categories";
import { sendAnInvitation } from "../dl/slices/orders";
import { ItemsBox } from "../components/ItemsBox";
import '../css/orders.css'

export const Orders = () => {
    const dispatch = useDispatch();
    const {allProducts, isLoading} = useSelector( state => state.products);
    const { user } = useSelector( state => state.users);
    const {allCategories} = useSelector( state => state.categories);
    const [productsOfLicense, setProductsOfLicense] = useState([]);
    const [itemsListFiltered, setItemsListFiltered] = useState([]);
    const [showSelect, setShowSelect] = useState(false);

    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(getProducts());
        }
    }, []);
    useEffect(() => {
        if (user.license === 'purchasingManager') {
            const sortedProducts = [...allProducts].sort((a, b) => a.category.localeCompare(b.category));
            setProductsOfLicense(sortedProducts);
            setItemsListFiltered(sortedProducts);
        }else {
            const sortedProducts = [...allProducts]
            .filter( product => product.factory === user.factory)
            .sort((a, b) => a.category.localeCompare(b.category))
            setProductsOfLicense(sortedProducts);
            setItemsListFiltered(sortedProducts);
        }
    }, [allProducts]);

    useEffect( () => {
        if (!allCategories || allCategories.length === 0) {
            dispatch( getCategories())
        }
    },[]);
    
    const filterProducts = e => {
        const { value } = e.target;
        if (value === 'allCategories') {
            setItemsListFiltered( productsOfLicense);
        }else {
            setItemsListFiltered( () => productsOfLicense.filter( product => product.category === value));
        }
    }
    const toggleSelectVisibility = () => {
        if(user.license === 'purchasingManager') {
            setShowSelect(old => !old);
        } else {
            SendAnInvitation();
        }
    };

    const SendAnInvitation = value => {
        const whichFactoryToSend = user.license !== 'purchasingManager' ? user.factory : value;
        dispatch( sendAnInvitation({user, whichFactoryToSend}));
    }

    if (isLoading) return <h1>🌀 Loading...</h1>;
    return(
        <div className="container-orders">
            { allCategories && allCategories.length === 0 && <select id="categories-select" name="category" onChange={filterProducts}>
                <option value="allCategories">כל הקטגוריות</option>
                { allCategories.map( category => (
                    <option value={category.nameCategory} key={category._id}>{category.nameCategory}</option>
                )  )}
            </select>}
            { itemsListFiltered && itemsListFiltered.map( item => (
                <div className="box-item"  key={item._id}>
                    <ItemsBox nameProduct={item.nameProduct} 
                    factory={item.factory}
                    temporaryQuantity={item.temporaryQuantity} 
                    unitOfMeasure={item.unitOfMeasure}
                    category={item.category}
                    note={item.note}
                    _id={item._id}/>
                </div>
            ))}
            
            <button onClick={toggleSelectVisibility} className="send-an-invitation">
                <div>שלח הזמנה</div>
                {user.license === 'purchasingManager' && 
                    <div className={`arrow-down ${showSelect ? 'arrow-up' : ''}`}></div>
                }
            </button>
            {showSelect && user.license === 'purchasingManager' && (
                <select className={`select-factory-corner ${showSelect ? 'show' : ''}`} 
                size="3" onChange={e => SendAnInvitation(e.target.value)}>
                    <option value="catering">קייטרינג</option>
                    <option value="hazor">קייטרינג חצור</option>
                    <option value="bakery">מאפיה</option>
                </select>
            )}
        </div>
    )
}