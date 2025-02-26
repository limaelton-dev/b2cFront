import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface SubItem {
    icon: React.ReactNode;
    label: string;
}

interface MainItem {
    icon: React.ReactNode;
    label: string;
    subItems?: SubItem[];
}

interface SideBarProps {
    items: MainItem[];
    onSectionChange: (section: string) => void;
}

export default function SideBar({items, onSectionChange}: SideBarProps) {
    const [openIndexes, setOpenIndexes] = React.useState<number[]>([0]);
    const [selectedItem, setSelectedItem] = React.useState<string>('Dados pessoais');

    const handleListItemClick = (index: number, item: MainItem) => {
        if (item.subItems) {
            setOpenIndexes(prev => 
                prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
            );
        } else {
            setSelectedItem(item.label);
            onSectionChange(item.label);
        }
    };

    const handleSubItemClick = (label: string) => {
        setSelectedItem(label);
        onSectionChange(label);
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 200,
                backgroundColor: 'transparent'
            }}
        >
            <List
                component="nav"
                sx={{
                    p: 0,
                    '& .MuiListItemButton-root': {
                        transition: 'all 0.2s ease',
                        borderRadius: '8px',
                        mb: 0.5,
                    }
                }}
            >
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <ListItemButton 
                            onClick={() => handleListItemClick(index, item)}
                            sx={{
                                minHeight: '40px',
                                backgroundColor: selectedItem === item.label ? '#102d57' : 'transparent',
                                color: selectedItem === item.label ? 'white' : '#666',
                                '&:hover': {
                                    backgroundColor: selectedItem === item.label ? '#102d57' : '#f0f0f0',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <ListItemIcon 
                                sx={{ 
                                    minWidth: 35,
                                    color: selectedItem === item.label ? 'white' : '#666',
                                    '& .MuiSvgIcon-root': {
                                        fontSize: '20px'
                                    }
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label}
                                primaryTypographyProps={{ 
                                    fontSize: '13px',
                                    fontWeight: selectedItem === item.label ? 500 : 400
                                }}
                            />
                            {item.subItems && (
                                <motion.div
                                    animate={{ rotate: openIndexes.includes(index) ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {openIndexes.includes(index) ? 
                                        <ExpandLess sx={{ fontSize: '18px' }} /> : 
                                        <ExpandMore sx={{ fontSize: '18px' }} />
                                    }
                                </motion.div>
                            )}
                        </ListItemButton>

                        <AnimatePresence>
                            {item.subItems && (
                                <Collapse in={openIndexes.includes(index)} timeout="auto">
                                    <List 
                                        component="div" 
                                        disablePadding
                                        sx={{ mt: 0.5, ml: 1 }}
                                    >
                                        {item.subItems.map((subItem, subIndex) => (
                                            <motion.div
                                                key={subItem.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2, delay: subIndex * 0.1 }}
                                            >
                                                <ListItemButton 
                                                    sx={{
                                                        pl: 4,
                                                        minHeight: '36px',
                                                        borderRadius: '8px',
                                                        backgroundColor: selectedItem === subItem.label ? '#102d57' : 'transparent',
                                                        color: selectedItem === subItem.label ? 'white' : '#666',
                                                        '&:hover': {
                                                            backgroundColor: selectedItem === subItem.label ? '#102d57' : '#f0f0f0',
                                                        }
                                                    }}
                                                    onClick={() => handleSubItemClick(subItem.label)}
                                                >
                                                    <ListItemText 
                                                        primary={subItem.label}
                                                        primaryTypographyProps={{ 
                                                            fontSize: '12px',
                                                            fontWeight: selectedItem === subItem.label ? 500 : 400
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </motion.div>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </List>
        </Box>
    );
}
