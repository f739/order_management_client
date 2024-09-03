import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useGetCategoriesQuery } from "../../dl/api/categoriesApi";
import { useGetMeasuresQuery } from "../../dl/api/measuresApi";
import { useGetProductsQuery } from "../../dl/api/productsApi";
import { useGetSuppliersQuery } from '../../dl/api/suppliersApi';
import { useGetBranchesQuery } from '../../dl/api/branchesApi';

export const FilterWrapper = ({ filters, filterFields, updateFilter }) => {
    const { data: allMeasures, error: errorGetMeasures } = useGetMeasuresQuery();
    const { data: allCategories, error: errorGetCategories } = useGetCategoriesQuery();
    const { data: allProducts, error: errorGetProducts } = useGetProductsQuery();
    const { data: allSuppliers, error: errorGetSuppliers } = useGetSuppliersQuery();
    const { data: allBranches, error: errorGetBranches } = useGetBranchesQuery();

    const filterOptions = {
        category: allCategories || [],
        product: allProducts || [],
        unitOfMeasure: allMeasures || [],
        branch: allBranches || [],
        supplier: allSuppliers || [],
        active: [{_id: 0, label: 'true'}, {_id: 1, label: 'false'}]
    }
    const getTitleLabel = (filterType) => {
        switch (filterType) {
            case 'category':
                return 'קטגוריות'
            case 'product':
                return 'מוצרים'
            case 'unitOfMeasure':
                return 'יחידות מידה'
            case 'branch': 
                return 'סניפים'
            case 'supplier':
                return 'ספקים'
            case 'active': 
                return 'פעיל'
            default:
                return ''
        }
    }
    const getOptionLabel = (filterType, option) => {
        switch (filterType) {
            case 'category':
                return option.nameCategory;
            case 'product':
                return option.nameProduct;
            case 'unitOfMeasure':
                return option.measureName;
            case 'branch':
                return option.nameBranch;
            case 'supplier':
                return option.nameSupplier
            case 'active':
                return option.label
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
                    <InputLabel>{getTitleLabel(filterType)}</InputLabel>
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