import React, { useEffect, useMemo } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useGetCategoriesQuery } from "../../dl/api/categoriesApi";
import { useGetMeasuresQuery } from "../../dl/api/measuresApi";
import { useGetProductsQuery } from "../../dl/api/productsApi";
import { useGetSuppliersQuery } from '../../dl/api/suppliersApi';
import { factories } from '../../data/roles';

export const FilterWrapper = ({ filters, filterFields, updateFilter }) => {
    const { data: allMeasures, error: errorGetMeasures } = useGetMeasuresQuery();
    const { data: allCategories, error: errorGetCategories } = useGetCategoriesQuery();
    const { data: allProducts, error: errorGetProducts } = useGetProductsQuery();
    const { data: allSuppliers, error: errorGetSuppliers } = useGetSuppliersQuery();

    const filterOptions = {
        category: allCategories || [],
        product: allProducts || [],
        unitOfMeasure: allMeasures || [],
        factory: factories || [],
        supplier: allSuppliers || [],
    }

    const getOptionLabel = (filterType, option) => {
        switch (filterType) {
            case 'category':
                return option.nameCategory;
            case 'product':
                return option.nameProduct;
            case 'unitOfMeasure':
                return option.measureName;
            case 'factory':
                return option.name;
            case 'supplier': 
                return option.nameSupplier
            default:
                return '';
        }
    }

  return (
      <Box>
          <TextField
              fullWidth
              label="חיפוש חופשי"
              value={filters.searchText}
              onChange={(e) => updateFilter('searchText', e.target.value)}
              margin="normal"
          />
          {filterFields.map((filterType) => (
              <FormControl fullWidth key={filterType} margin="normal">
                  <InputLabel>{filterType}</InputLabel>
                  <Select
                      value={filters[filterType] || ''}
                      onChange={(e) => updateFilter(filterType, e.target.value)}
                      label={filterType}
                  >
                      <MenuItem value="">
                          <em>נקה</em>
                      </MenuItem>
                      {filterOptions[filterType].map((option) => (
                          <MenuItem key={option._id} value={getOptionLabel(filterType, option)}>
                              {getOptionLabel(filterType, option)}
                          </MenuItem>
                      ))}
                  </Select>
              </FormControl>
          ))}
      </Box>
  );
};