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
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          fontWeight: 500,
          color: '#102d57',
        }}
      >
        Minha Conta
      </Typography>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        sx={{ padding: '8px 0' }}
      >
        {items.map((item, index) => (
          <React.Fragment key={`main-item-${index}`}>
            <ListItemButton
              onClick={() => handleListItemClick(index, item)}
              selected={activeSection === item.label || (item.subItems?.some(subItem => subItem.label === activeSection))}
              sx={{
                borderRadius: '4px',
                margin: '2px 8px',
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
              <ListItemIcon sx={{ minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: activeSection === item.label ? 500 : 400,
                    fontSize: '0.95rem',
                  } 
                }}
              />
              {item.subItems && (openIndexes.includes(index) ? <ExpandLess /> : <ExpandMore />)}
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
                              borderRadius: '4px',
                              margin: '2px 8px 2px 16px',
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(16, 45, 87, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(16, 45, 87, 0.12)',
                                },
                              },
                            }}
                            selected={activeSection === subItem.label}
                            onClick={() => handleSubItemClick(subItem.label)}
                          >
                            <ListItemIcon sx={{ minWidth: '40px' }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={subItem.label} 
                              primaryTypographyProps={{ 
                                sx: { 
                                  fontWeight: activeSection === subItem.label ? 500 : 400,
                                  fontSize: '0.9rem',
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