import * as React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { MainItemType, SubItemType } from '../../types';

interface SideBarProps {
  items: MainItemType[];
  onSectionChange: (section: string) => void;
  activeSection: string;
}

export default function SideBar({ items, onSectionChange, activeSection }: SideBarProps) {
  const [openIndexes, setOpenIndexes] = React.useState<number[]>([0]);

  // Efeito para expandir automaticamente o item que contém a seção ativa
  React.useEffect(() => {
    items.forEach((item, index) => {
      if (item.label === activeSection) {
        setOpenIndexes(prev => prev.includes(index) ? prev : [...prev, index]);
      } else if (item.subItems?.some(subItem => subItem.label === activeSection)) {
        setOpenIndexes(prev => prev.includes(index) ? prev : [...prev, index]);
      }
    });
  }, [activeSection, items]);

  const handleListItemClick = (index: number, item: MainItemType) => {
    if (item.subItems) {
      setOpenIndexes(prev => 
        prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
      );
      
      // Se o item principal for clicado e tiver subitens, selecione o primeiro subitem
      if (!openIndexes.includes(index) && item.subItems.length > 0) {
        onSectionChange(item.subItems[0].label);
      }
    } else {
      onSectionChange(item.label);
    }
  };

  const handleSubItemClick = (label: string) => {
    onSectionChange(label);
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: '#102d57',
          mb: 2,
          fontSize: '1.1rem',
        }}
      >
        Minha Conta
      </Typography>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        sx={{ padding: 0 }}
      >
        {items.map((item, index) => (
          <React.Fragment key={`main-item-${index}`}>
            <ListItemButton
              onClick={() => handleListItemClick(index, item)}
              selected={activeSection === item.label || (item.subItems?.some(subItem => subItem.label === activeSection))}
              sx={{
                borderRadius: '4px',
                pl: 0,
                pr: 2,
                py: 0.75,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(16, 45, 87, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(16, 45, 87, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '36px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  sx: {
                    fontSize: '0.85rem',
                  } 
                }}
              />
              {item.subItems && (openIndexes.includes(index) ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
            </ListItemButton>
            
            {item.subItems && (
              <AnimatePresence>
                {openIndexes.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Collapse in={openIndexes.includes(index)} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subItems.map((subItem, subIndex) => (
                          <ListItemButton
                            key={`sub-item-${index}-${subIndex}`}
                            sx={{
                              pl: 4,
                              pr: 2,
                              py: 0.75,
                              borderRadius: '4px',
                              '&.Mui-selected': {
                                backgroundColor: 'transparent',
                                color: '#102d57',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              },
                            }}
                            selected={activeSection === subItem.label}
                            onClick={() => handleSubItemClick(subItem.label)}
                          >
                            <ListItemIcon sx={{ minWidth: '36px' }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={subItem.label} 
                              primaryTypographyProps={{ 
                                sx: { 
                                  fontWeight: activeSection === subItem.label ? 600 : 400,
                                  fontSize: '0.8rem',
                                  color: activeSection === subItem.label ? '#102d57' : 'inherit',
                                } 
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
} 