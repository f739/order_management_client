import React from "react";
import { useGetSuppliersQuery } from "../dl/api/suppliersApi";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { handleFormHook } from "./HandleFormHook";

export const SelectSuppliersHook = ({ set, form, ifFunc = false, allName = true }) => {
    const { data: allSuppliers, error: errorGetsuppliers, isLoading: isLoadingGetsuppliers } = useGetSuppliersQuery();

    if (errorGetsuppliers) return <h3>ERROR: {errorGetsuppliers.error}</h3>
    if (isLoadingGetsuppliers) return 'loading...';
    return (
        <>
         <FormControl variant="standard" >
        <InputLabel id="demo-simple-select-helper-label">בחר ספק</InputLabel>
        <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            label='בחר ספק'
            value={form._idSupplier}
            name="_idSupplier"
            onChange={(e) => handleFormHook(e.target, set, ifFunc)}
            sx={{
                '& .MuiSelect-select': {
                  padding: '10px, 0px', 
                },
                minWidth: '130px'
              }}
        >
            {allName && <MenuItem value="" >--בחר ספק--</MenuItem>}
            {allSuppliers && allSuppliers.map(supplier => (
                <MenuItem value={supplier._id} key={supplier._id}  >
                    {supplier.nameSupplier} {allName && `(${supplier.email})`}
                </MenuItem>
            ))}
        </Select>
        </FormControl>
        </>
    )
}

