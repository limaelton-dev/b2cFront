import * as React from "react";
import List from "@mui/material/List";
import { Box, Paper } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "@mui/material";
import NestedMenuItem from "./NestedMenuItem";
import { MenuProvider } from "./MenuContext";
import { useState } from "react";

// Dados mockados das categorias com múltiplos níveis
const mockCategories = [
    {
        id: 4827,
        name: "Informática",
        subcategories: [
            { 
                id: 1945, 
                name: "Notebooks",
                subcategories: [
                    { id: 8754, name: "Notebooks Gamer" },
                    { id: 6621, name: "Notebooks Profissionais" },
                    { id: 3308, name: "Ultrabooks" }
                ]
            },
            { id: 1298, name: "Desktops" },
            { id: 7054, name: "Tablets" },
            { id: 8860, name: "Monitores" },
            { id: 5532, name: "Impressoras" }
        ]
    },
    {
        id: 9931,
        name: "Periféricos",
        subcategories: [
            { 
                id: 6405, 
                name: "Teclados",
                subcategories: [
                    { id: 8711, name: "Teclados Mecânicos" },
                    { id: 2249, name: "Teclados Gamers" },
                    { id: 9312, name: "Teclados Sem Fio" }
                ]
            },
            { 
                id: 1576, 
                name: "Mouses",
                subcategories: [
                    { 
                        id: 4430, 
                        name: "Mouse Gamer",
                        subcategories: [
                            { id: 2807, name: "Mouse RGB" },
                            { id: 6785, name: "Mouse Profissional" },
                            { id: 9514, name: "Mouse Wireless" }
                        ]
                    },
                    { id: 3326, name: "Mouse Pad" },
                    { id: 7709, name: "Mouse Pad Gamer" }
                ]
            },
            { 
                id: 4459, 
                name: "Headsets",
                subcategories: [
                    { 
                        id: 1207, 
                        name: "Headset Gamer",
                        subcategories: [
                            { id: 5068, name: "Headset 7.1" },
                            { id: 8304, name: "Headset Wireless" },
                            { id: 9145, name: "Headset com RGB" }
                        ]
                    },
                    { id: 7612, name: "Headset Profissional" },
                    { id: 2481, name: "Fones de Ouvido" }
                ]
            },
            { id: 3158, name: "Webcams" },
            { id: 5742, name: "Caixas de Som" }
        ]
    },
    {
        id: 2044,
        name: "Games",
        subcategories: [
            { 
                id: 6983, 
                name: "Consoles",
                subcategories: [
                    { 
                        id: 3359, 
                        name: "Playstation",
                        subcategories: [
                            { id: 1577, name: "PS5" },
                            { id: 4190, name: "PS4" },
                            { id: 8812, name: "Acessórios PS" }
                        ]
                    },
                    { 
                        id: 2740, 
                        name: "Xbox",
                        subcategories: [
                            { id: 6325, name: "Xbox Series X/S" },
                            { id: 8074, name: "Xbox One" },
                            { id: 9011, name: "Acessórios Xbox" }
                        ]
                    },
                    { id: 5506, name: "Nintendo" }
                ]
            },
            { id: 7039, name: "Jogos PC" },
            { id: 4852, name: "Controles" },
            { id: 9278, name: "Cadeiras Gamer" },
            { id: 3104, name: "Streaming" }
        ]
    },
    {
        id: 6647,
        name: "Acessórios"
    }
];


//Mapeia as categorias apenas, e passa para o NestedMenuItem, a categoria completa.
function RecursiveNestedMenu({ categories }: { categories: any[] }) {
    return (
        <>
            {categories.map((category) => (
                <NestedMenuItem key={category.id} category={category} />
            ))}
        </>
    )
}

export default function NestedList() {
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
                            <RecursiveNestedMenu categories={mockCategories} />
                        </List>
                    </MenuProvider>
                </Paper>
            )}
        </Box>
    );
}
