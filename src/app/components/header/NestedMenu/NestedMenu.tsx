import * as React from "react";
import List from "@mui/material/List";
import { Box, Paper } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "@mui/material";
import NestedMenuItem from "./NestedMenuItem";
import { MenuProvider } from "./MenuContext";
import { useState } from "react";
import { Category } from "../../../types/category";



//Mapeia as categorias apenas, e passa para o NestedMenuItem, a categoria completa.
function RecursiveNestedMenu({ categories }: { categories: Category[] }) {
    return (
        <>
            {categories.map((category) => (
                <NestedMenuItem key={category.id} category={category} />
            ))}
        </>
    )
}

export default function NestedList({ categories }: { categories: Category[] }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    return (
        <Box 
            sx={{ position: 'relative' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link 
                underline="hover" 
                color="inherit" 
                sx={{ 
                    cursor: 'pointer',
                    display: 'block',
                    padding: '8px 0'
                }}
            >
                Categorias <ArrowDropDownIcon />
            </Link>

            {/* Menu dropdown */}
            {isOpen && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: 300,
                        maxHeight: 500,
                        overflow: 'auto',
                        zIndex: 1000,
                        boxShadow: 3,
                        bgcolor: 'background.paper'
                    }}
                >
                    <MenuProvider>
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            sx={{ padding: 0 }}
                        >
                            <RecursiveNestedMenu categories={categories} />
                        </List>
                    </MenuProvider>
                </Paper>
            )}
        </Box>
    );
}
