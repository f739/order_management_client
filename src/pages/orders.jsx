import { useState, useEffect } from "react"; 
import { ItemsBox } from "../components/ItemsBox";
import { URL } from '../services/service';
import $, { all } from "axios";
import '../css/orders.css'

export const Orders = () => {
    const [itemsList, setItmesList] = useState([]);
    const [itemsListFiltered, setItemsListFiltered] = useState(itemsList);
    const [newQuantity, setNewQuantity] = useState(null);
    const [allcategories, setAllCategories] = useState(null);
    useEffect( () => {
        const getAllProducts = async () => {
            try {
                const res = await $.get(`${URL}/products/getAllProducts`);
                const { allProducts } = res.data;
                allProducts.sort((a, b) => a.category.localeCompare(b.category));
                setItmesList(allProducts);
            }catch (err) {
                console.log(err);
            }
        }; getAllProducts();
    },[newQuantity]);
    useEffect( () => {
        const getCategories = async () => {
            try {
                const res = await $.get(`${URL}/categories/getAllcategories`);
                console.log(res.data.allcategories);
                setAllCategories(res.data.allcategories);
            }catch (err) {
                console.log(err);
            }
        }; getCategories();
    },[])
    useEffect(() => {
        setItemsListFiltered(itemsList);
    }, [itemsList]);
      
    const SendAnInvitation = async () => {
        try {
            const res = await $.post(`${URL}/orders/sendAnInvitation`,{});
            console.log(res.data);
        }catch (err) {
            console.log(err.response.data.error);
        }    
    }
    const filterProducts = e => {
        const { value } = e.target;
        if (value === 'allCategories') {
            setItemsListFiltered( itemsList);
        }else {
            setItemsListFiltered( () => itemsList.filter( product => product.category === value));
        }
    }
    return(
        <>
            <h1>דף הזמנת מוצרים</h1>
            <button onClick={SendAnInvitation}>שלח הזמנה</button>
            { allcategories && <select id="categories-select" name="category" onChange={filterProducts}>
                <option value="allCategories">כל הקטגוריות</option>
                { allcategories.map( category => (
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
                    setNewQuantity={setNewQuantity} 
                    id={item._id}/>
                </div>
            ))}
        </>
    )
}