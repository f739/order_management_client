import { useState, useEffect } from "react" 
import $ from 'axios';
import { URL } from "../services/service";

export const OrderManagement = () => {
    const [ifCreateProdact, setIfCreateProdact] = useState(false);
    const [ifCreateSupplier, setIfCreateSupplier] = useState(false);
    return(
        <>
            <h1>ניהול מלאי</h1>
            {!ifCreateProdact && <button onClick={() => setIfCreateProdact(old => !old)}>יצירת מוצר חדש</button>}
            {!ifCreateSupplier && <button onClick={() => setIfCreateSupplier(old => !old)}>יצירת ספק חדש</button>}
            {ifCreateProdact && <NewProduct /> }
            {ifCreateSupplier && <NewSupplier /> }
        </>
    )
}

const NewProduct = () => {
    const [newProduct, setNewProduct] = useState({nameProduct: '', supplier: ''});
    const [listSuppliers, setListSuppliers] = useState([]);
    useEffect( () => {
        const getSuppleirs = async () => {
            try {
                const res = await $.get(`${URL}/suppliers/getAllSuppliers`);
                console.log(res);
                setListSuppliers(res.data.allSuppleirs)
            } catch (err) {
                console.log(err);
            }
        }; getSuppleirs()
    },[])
    const handleFormNewProduct = ({target}) => {
        const { value, name } = target;
        setNewProduct( old => {
            return {
                ...old,
                [name]: value
            }
        })
    }
    const handleSaveNewProduct = async () => {
        try {
            console.log(newProduct);
            const res = await $.post(`${URL}/products/newProduct`, newProduct);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="new-product">
            <label>
                שם מוצר:
                <input type="text" name="nameProduct" onChange={handleFormNewProduct} />
            </label>
            <label>
                שם ספק:
                { listSuppliers && <select id="supplier-select" name="supplier" onChange={handleFormNewProduct}>
                    <option value="">--בחר אפשרות--</option>
                    { listSuppliers.map( supplier => (
                        <option value={supplier.nameSupplier} key={supplier._id}>{supplier.nameSupplier}</option>
                    )  )}
                </select>}
            </label>
                <button onClick={handleSaveNewProduct}>שמור מוצר חדש</button>
        </ div>
    )
}

const NewSupplier = () => {
    const [newsupplier, setNewsupplier] = useState({nameSupplier: '', tel: '', email: ''});

    const handleFormNewSupplier = ({target}) => {
        const { value, name } = target;
        console.log(name , value);
        setNewsupplier( old => {
            return {
                ...old,
                [name]: value
            }
        })
    }
    const handleSaveNewSupplier  = async () => {
        try {
            const res = await $.post(`${URL}/suppliers/newSupplier`, newsupplier);
            console.log(res);
        }catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="new-supplier">
            <label>
                שם ספק:
                <input type="text" name="nameSupplier" onChange={handleFormNewSupplier}/> 
            </label>
            <label>
                פלאפון ספק:
               <input type="tel" name="tel" onChange={handleFormNewSupplier}/> 
            </label>
            <label>
                אמייל ספק:
               <input type="email" name="email" onChange={handleFormNewSupplier}/> 
            </label>
            <button onClick={handleSaveNewSupplier}>שמור ספק חדש</button>
        </div>
    )
}