import { useState, useEffect } from "react";
import { handleFormHook } from './HandleFormHook';
import { SelectSuppliersHook } from './SelectSuppliersHook'
import { EditItemHook } from './EditItemHook';
import { useGetProductsQuery, 
    useCreateNewProductMutation,
    useRemoveProductMutation,
    useEditProductMutation } from '../dl/api/productsApi';
import { useGetCategoriesQuery } from "../dl/api/categoriesApi";
import { useGetMeasuresQuery } from "../dl/api/measuresApi";
import { useGetSuppliersQuery } from "../dl/api/suppliersApi";
import edit from '../assetes/edit.svg'
import '../css/products.css';
import Select from 'react-select';

export const Products = () => {
    const [message, setMessage] = useState('')
    const [newProduct, setNewProduct] = useState({nameProduct: '', factories: [], category: '', unitOfMeasure: '', sku: '', price: []});
    const [newPrice, setNewPrice] = useState({_idSupplier: '', price: ''});

    const { data: allCategories, error: errorGetCategories, isLoading: isLoadingGetCategories } = useGetCategoriesQuery();
    const { data: allMeasures, error: errorGetMeasures, isLoading: isLoadingGetMeasures } = useGetMeasuresQuery();
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();

    const [createNewProduct, { error, isLoading: isLoadingCreateProdact }] = useCreateNewProductMutation();

    useEffect(() => {
        if (error || errorGetCategories || errorGetMeasures || errorGetsuppliers) {
            setMessage(error.data?.message || 'An error occurred');
        }
    }, [error, errorGetCategories, errorGetMeasures, errorGetsuppliers]);

    const handleSaveNewPrice = () => {
        if (newPrice._idSupplier === '' || newPrice.price === '' || !/^\d*\.?\d+$/.test(newPrice.price)) return;
        if (newProduct.price.some(prod => prod._idSupplier === newPrice._idSupplier)) return;
        setNewProduct(prev => {
            const supplierIndex = prev.price.findIndex(supplier => supplier._id === newPrice._idSupplier);
            let updatedPrice = [...prev.price];
            if (supplierIndex !== -1) {
                updatedPrice[supplierIndex] = {...updatedPrice[supplierIndex], price: newPrice.price};
            } else {
                updatedPrice = [...updatedPrice, newPrice];
            }
            return {
                ...prev,
                price: updatedPrice
            };
        });
        setNewPrice({_idSupplier: '', price: ''});
    }

    const handleSelectFactory = factoriesArr => {
        console.log(factoriesArr);
        setNewProduct(old => { return {...old, factories: factoriesArr }});
        console.log(newProduct);
    }

    const handleSaveNewProduct = () => {
        if (newProduct.nameProduct === '' || newProduct.category === '' || newProduct.price.length === 0 || 
        newProduct.unitOfMeasure === '' || newProduct.sku === '' || newProduct.factories.length === 0 ) {
        }else {
            try {
                newProduct.factories.forEach( async factory => {
                    await createNewProduct({...newProduct, factory: factory.value})
                })
                setNewProduct({nameProduct: '', factories: [], category: '', unitOfMeasure: '', sku: '', price: []});
            }catch (err) { console.log(err) }
        }
    }
    const getDetalesSupplier = _idSupplier => {
        return  allSuppliers?.find( supp => supp._id === _idSupplier);
    }
    if (isLoadingGetCategories || isLoadingGetMeasures || isLoadingGetsuppliers) return 'loading';
    
    return (
        <div>
            <div className="new-item">
                <label>שם מוצר:</label>
                <input type="text" name="nameProduct" value={newProduct.nameProduct} onChange={e => handleFormHook(e.target, setNewProduct)} />

                <label>מק"ט:</label>
                <input type="text" name="sku" value={newProduct.sku} onChange={e => handleFormHook(e.target, setNewProduct)} /> 
                
                <label>מחיר:</label>
                    <div className="price-input-container">
                        {newProduct.price && newProduct.price.map(price => (
                            <div key={price._idSupplier} className="price-span">{getDetalesSupplier(price._idSupplier)?.nameSupplier || ''} - {price.price}</div>
                        ))}
                        <div className="price-inputs">
                            <SelectSuppliersHook set={setNewPrice} form={newPrice} />
                            <input type="text" name="price" placeholder="מחיר" value={newPrice.price} onChange={e => handleFormHook(e.target, setNewPrice)} />
                        </div>
                        <button onClick={handleSaveNewPrice}>שמור מחיר</button>
                    </div>
                <label>מפעל:</label>
                <Select 
                    value={newProduct.factories}
                    options={[{ value: "catering", label: 'קייטרינג' },{ value: 'hazor', label: 'קייטרינג חצור' }, { value: 'bakery', label: 'מאפיה' }]}
                    isMulti
                    onChange={handleSelectFactory}
                    placeholder='בחר מפעלים'
                    className="basic-multi-select"
                    classNamePrefix="select"
                 />
                <label>
                    קטגוריה:
                    { <select id="categories-select" name="category" value={newProduct.category} onChange={e => handleFormHook(e.target, setNewProduct)}>
                        <option value="">--בחר אפשרות--</option>
                        { allCategories.length > 0 && allCategories.map( category => (
                            <option value={category.nameCategory} key={category._id}>{category.nameCategory}</option>
                        )  )}
                    </select>}
                </label>
                <label>
                    יחידות מידה:
                    { <select id="unit-of-measure-select" name="unitOfMeasure" value={newProduct.unitOfMeasure}
                    onChange={e => handleFormHook(e.target, setNewProduct)}>
                        <option value="">--בחר אפשרות--</option>
                        {allMeasures.length > 0 && allMeasures.map( measure => (
                            <option value={measure.measureName} key={measure._id}>{measure.measureName}</option>
                        )  )}
                    </select>}
                </label>
                    <button onClick={handleSaveNewProduct}>שמור מוצר חדש</button>
                    <span>{message}</span>
                {isLoadingCreateProdact && <span>🌀</span>}
            </ div>
            <ShowProducts />
        </div>
    )
}

const ShowProducts = () => {
    const { data: allProducts, error: errorGetProducts, isLoading: isLoadingGetProducts } = useGetProductsQuery();
    const [removeProduct, { error: errorRemoveProduct }] = useRemoveProductMutation();
    const [editProduct, { error: errorEditProduct }] = useEditProductMutation();

    const [showEditProduct, setShowEditProduct] = useState('');
    const fields = [
        {label: 'שם מוצר',type: 'input', typeInput: 'text', name: 'nameProduct'},
        {label: 'מק"ט',type: 'input', typeInput: 'text', name: 'sku'},
        { label: 'מחיר',type: 'price', name: 'price' },
        { label: 'מפעל', type: 'select', name: 'factory' },
        {label: 'קטגוריה', type: 'select', name: 'category'},
        {label: 'יחידות מידה', type: 'select', name: 'unitOfMeasure'}
      ];

    const deleteProduct = async _id => {
        try {
            await removeProduct(_id).unwrap();
            setShowEditProduct('');
        }catch (err) {
            console.log(err);
            console.log(errorRemoveProduct);
        }
    }
    const handleEditItem = async productUpdated => {
        await editProduct(productUpdated)
        setShowEditProduct('');
    }
    if (errorGetProducts) return <h3>ERROR: {errorGetProducts.error}</h3>
    if (isLoadingGetProducts) return <h1>🌀 Loading...</h1>;

    return (
        <div className="show-items">
        <h1 className="title">מוצרים קיימים:</h1>
        {allProducts ? allProducts.map( product => (
                <div className="show-item" key={product._id}>
                    <span className={`factory-${product.factory}`}>{product.factory && product.factory.charAt(0).toUpperCase()}</span>
                    <span>{product.nameProduct}</span>
                    <span>{product.unitOfMeasure}</span>
                    <span>{product.category}</span>
                    <button onClick={() => setShowEditProduct(product)}>
                        <img src={edit} alt="ערוך" className='icon'/>
                    </button>
                    { showEditProduct._id === product._id && 
                        <EditItemHook initialData={showEditProduct} 
                        onSubmit={handleEditItem}
                        fields={fields}
                        setShowEdit={setShowEditProduct}
                        deleteItem={deleteProduct}
                        />
                    }
                </div>
            )) :  (<div>אין מוצרים להצגה</div>)}
        </div>
    )
}