import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import { Collapse } from '@mui/material';

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
}
export default function SelectedListItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [listItemOpen, setlistItemOpen] = React.useState(false);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setlistItemOpen(!listItemOpen);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
          {listItemOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={listItemOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                <StarBorder />
                </ListItemIcon>
                <ListItemText primary="Starred" />
            </ListItemButton>
            </List>
        </Collapse>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItemButton>
      </List>
    </Box>
  );
}
