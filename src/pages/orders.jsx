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
    const allCategories = useSelector( state => state.categories.allCategories);
    const [itemsListFiltered, setItemsListFiltered] = useState([]);

    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(getProducts());
        }
    }, []);
    useEffect(() => {
        const sortedProducts = [...allProducts].sort((a, b) => a.category.localeCompare(b.category));
        setItemsListFiltered(sortedProducts);
    }, [allProducts]);

    useEffect( () => {
        if (allCategories.length === 0) {
            dispatch( getCategories())
        }
    },[allCategories]);
      
    const SendAnInvitation = async () => {
        dispatch( sendAnInvitation())   
    }
    
    const filterProducts = e => {
        const { value } = e.target;
        if (value === 'allCategories') {
            setItemsListFiltered( allProducts);
        }else {
            setItemsListFiltered( () => allProducts.filter( product => product.category === value));
        }
    }
    return(
        <>
        {isLoading ? <h1>loding...</h1> : <>
            <h1>דף הזמנת מוצרים</h1>
            <button onClick={SendAnInvitation}>שלח הזמנה</button>
            { allCategories && <select id="categories-select" name="category" onChange={filterProducts}>
                <option value="allCategories">כל הקטגוריות</option>
                { allCategories.map( category => (
                    <option value={category.nameCategory} key={category._id}>{category.nameCategory}</option>
                )  )}
            </select>}
            { itemsListFiltered && itemsListFiltered.map( item => (
                <div className="box-item"  key={item._id}>
                    <ItemsBox nameProduct={item.nameProduct} 
                    temporaryQuantity={item.temporaryQuantity} 
                    unitOfMeasure={item.unitOfMeasure}
                    category={item.category}
                    note={item.note}
                    _id={item._id}/>
                </div>
            ))}
        </>}
    </>
    )
}