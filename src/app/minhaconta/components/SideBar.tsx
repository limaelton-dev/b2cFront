import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import { Collapse, Divider } from '@mui/material';

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
    const [openIndexes, setOpenIndexes] = React.useState<number[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
        const item = items[index];
    
        if (item.subItems) {
            setOpenIndexes(prev => 
                prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
            );
        } else {
            onSectionChange(item.label);
        }
    };

    return(
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <List component="nav">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {/* {index > 0 && <Divider />} */}
                        <ListItemButton onClick={() => handleListItemClick(index)}>
                            <ListItemIcon sx={{ minWidth: 30, widht: '12px' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label} 
                                primaryTypographyProps={{ fontSize: '12px' }}
                            />
                            {item.subItems ? (
                                openIndexes.includes(index) ? <ExpandLess /> : <ExpandMore />
                            ) : null}
                        </ListItemButton>
                        {item.subItems && (
                            <Collapse in={openIndexes.includes(index)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <ListItemButton 
                                            key={subItem.label} 
                                            sx={{ pl: 4 }}
                                            onClick={() => onSectionChange(subItem.label)}
                                        >
                                            <ListItemIcon sx={{ minWidth: 30, widht: '12px' }}>
                                                {subItem.icon}
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={subItem.label} 
                                                primaryTypographyProps={{ fontSize: '11px' }}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
}
