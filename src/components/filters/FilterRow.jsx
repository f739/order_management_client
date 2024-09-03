import { useEffect, useState, useRef } from "react";
import { FilterDrawer } from "./FilterDrawer";
import { FilterWrapper } from "./FilterWrapper";
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Chip, useMediaQuery } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ScaleIcon from '@mui/icons-material/Scale';
import DomainIcon from '@mui/icons-material/Domain';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';

export const FilterRow = props => {
    const {filters, updateFilter, filterFields, children } = props;
    const theme = useTheme();
    const anchorRef = useRef(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [openFilters, setOpenFilters] = useState(isSmallScreen ? false : true);

    return (
        <>
            <FilterDrawer 
                openFilters={openFilters} 
                setOpenFilters={setOpenFilters} 
                anchorRef={anchorRef}
            >
                <FilterWrapper 
                    filters={filters}
                    filterFields={filterFields} 
                    updateFilter={updateFilter} 
                    />
            </FilterDrawer>
            
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Box>
                    <IconButton 
                        ref={anchorRef}
                        onClick={() => setOpenFilters(old => !old)} 
                        color="inherit" 
                        aria-label="open drawer"
                    >
                        <FilterListIcon />
                    </IconButton>
                    <Chips filters={filters} updateFilter={updateFilter} />
                </Box>
                {children}
            </Box>
        </>
    )
}

const Chips = ({filters, updateFilter}) => {
  const getIcon = typeFilter => {
    switch (typeFilter) {
        case 'searchText':
            return <SearchIcon />
        case 'category':
            return <CategoryIcon />;
        case 'product':
            return <LocalOfferIcon />;
        case 'unitOfMeasure':
            return <ScaleIcon />;
        case 'branch':
            return <DomainIcon />
        case 'supplier':
            return <LocalShippingIcon />
        case 'active': 
           return <StarBorderPurple500Icon />
    }
  }
    return (
        <>
            {Object.entries(filters).map(([typeFilter, value], i) => {
                if (value) {
                    return (
                        <Chip 
                            key={i} 
                            size="small"
                            onDelete={() => updateFilter(typeFilter, '')} 
                            icon={getIcon(typeFilter)} 
                            label={value} 
                            sx={{p: 2, borderRadius: 2, m: 0.4}}
                        />
                    );
                }
                return null;
            })}
        </>
    )
}