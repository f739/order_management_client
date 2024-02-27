import { useState, useEffect } from "react";
import { URL } from "../services/service";
import $ from 'axios';

export const NewProduct = () => {
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