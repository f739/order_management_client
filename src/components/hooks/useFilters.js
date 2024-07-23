// the use filters work in to types array: 
// 1. simple array - [{product or category...}, {}...];
// 2. nested array - [{..., listProducts: [{_idProduct: {product}}, {}...]}, {}...];
import { useState, useEffect, useCallback } from 'react';

export const useFilters = (filterFields) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    searchText: '',
    ...Object.fromEntries(filterFields.map(field => [field, ''])),
  });

  const filterData = useCallback((dataToFilter, currentFilters) => {
    const searchInObject = (obj, searchText) => {
      return Object.entries(obj).some(([key, val]) => {
        if (Array.isArray(val) && val !== null && key !== 'listProducts' ) {
          return val.some(item => searchInObject(item, searchText));
        } else if (typeof val === 'object' && val !== null && key !== 'listProducts') {
          return searchInObject(val, searchText);
        } else {
          return val.toString().toLowerCase().includes(searchText.toLowerCase());
        }
      });
    };
  
    const filterProduct = (item={}, product={}) => {
      let passes = true;
  
      filterFields.forEach(field => {
        if (currentFilters[field]) {
          if (product[field] !== undefined) {
            passes = passes && searchInObject(product, currentFilters[field]);
          } else if (item[field] !== undefined) {
            passes = passes && searchInObject(item, currentFilters[field]);
          }else {
            passes = false;
          }
        }
      });
      return passes;
    };
  
    return dataToFilter.reduce((acc, item) => {
      if (item.listProducts) {

        let orderSearchPassed = true;
        // search in the invition
        if (currentFilters.searchText) {
          orderSearchPassed = searchInObject(item, currentFilters.searchText);
        }
        // filter in products
        // if has into invition - all products, if do not into invition - test products by to types filters
        const filteredProducts = item.listProducts.filter(product => 
           (orderSearchPassed || searchInObject(product.product, currentFilters.searchText)) &&
            filterProduct(item, product.product)
        
        );
        
        if (filteredProducts.length > 0) {
          acc.push({
            ...item,
            listProducts: filteredProducts
          });
        }
      } else {
        if (
          (!currentFilters.searchText || searchInObject(item, currentFilters.searchText)) &&
          filterProduct(item)
        ) {
          acc.push(item);
        }
      }
      return acc;
    }, []);
  }, [filterFields]);
  
  useEffect(() => {
    const newFilteredData = filterData(data, filters);
    setFilteredData(newFilteredData);
  }, [data, filters]);

  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return { filteredData, filters, updateFilter, setData };
};