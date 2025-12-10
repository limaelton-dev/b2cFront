import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CascadeMenuProvider, useCascadeMenu } from './CascadeMenuContext';
import { CascadingMenuItem, Category } from './CascadingMenuItem';

// ---- seus mocks (pode extrair de onde já tem) ----
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Informática',
    subcategories: [
      {
        id: 11,
        name: 'Notebooks',
        subcategories: [
          { id: 111, name: 'Notebooks Gamer' },
          { id: 112, name: 'Notebooks Profissionais' },
          { id: 113, name: 'Ultrabooks' },
        ],
      },
      { id: 12, name: 'Desktops' },
      { id: 13, name: 'Tablets' },
      { id: 14, name: 'Monitores' },
      { id: 15, name: 'Impressoras' },
    ],
  },
  {
    id: 2,
    name: 'Periféricos',
    subcategories: [
      {
        id: 21,
        name: 'Teclados',
        subcategories: [
          { id: 211, name: 'Teclados Mecânicos' },
          { id: 212, name: 'Teclados Gamers' },
          { id: 213, name: 'Teclados Sem Fio' },
        ],
      },
      {
        id: 22,
        name: 'Mouses',
        subcategories: [
          {
            id: 221,
            name: 'Mouse Gamer',
            subcategories: [
              { id: 2211, name: 'Mouse RGB' },
              { id: 2212, name: 'Mouse Profissional' },
              { id: 2213, name: 'Mouse Wireless' },
            ],
          },
          { id: 222, name: 'Mouse Pad' },
          { id: 223, name: 'Mouse Pad Gamer' },
        ],
      },
      {
        id: 23,
        name: 'Headsets',
        subcategories: [
          {
            id: 231,
            name: 'Headset Gamer',
            subcategories: [
              { id: 2311, name: 'Headset 7.1' },
              { id: 2312, name: 'Headset Wireless' },
              { id: 2313, name: 'Headset com RGB' },
            ],
          },
          { id: 232, name: 'Headset Profissional' },
          { id: 233, name: 'Fones de Ouvido' },
        ],
      },
      { id: 24, name: 'Webcams' },
      { id: 25, name: 'Caixas de Som' },
    ],
  },
  {
    id: 3,
    name: 'Games',
    subcategories: [
      {
        id: 31,
        name: 'Consoles',
        subcategories: [
          {
            id: 311,
            name: 'Playstation',
            subcategories: [{ id: 3111, name: 'PS5' }, { id: 3112, name: 'PS4' }, { id: 3113, name: 'Acessórios PS' }],
          },
          {
            id: 312,
            name: 'Xbox',
            subcategories: [{ id: 3121, name: 'Xbox Series X/S' }, { id: 3122, name: 'Xbox One' }, { id: 3123, name: 'Acessórios Xbox' }],
          },
          { id: 313, name: 'Nintendo' },
        ],
      },
      { id: 32, name: 'Jogos PC' },
      { id: 33, name: 'Controles' },
      { id: 34, name: 'Cadeiras Gamer' },
      { id: 35, name: 'Streaming' },
    ],
  },
  { id: 4, name: 'Acessórios' },
];

// ---- raiz que abre o 1º Menu e hospeda a recursão ----

function RootCascadingMenu({ data }: { data: Category[] }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { closeAll } = useCascadeMenu();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseAll = () => {
    setAnchorEl(null);
    closeAll();
  };

  const onLeafClick = (cat: Category) => {
    console.log('Selecionado:', cat.name);
    handleCloseAll();
  };

  return (
    <div>
      <Button
        endIcon={<ArrowDropDownIcon />}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}                  // ABRE POR CLIQUE
      >
        Categorias
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseAll}              // Clique fora/ESC fecha tudo
        MenuListProps={{ dense: true }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableAutoFocus
        disableAutoFocusItem
        disableEnforceFocus
        disableRestoreFocus
      >
        {data.map((cat) => (
          <CascadingMenuItem
            key={cat.id}
            category={cat}
            level={0}
            parentPath=""
            onLeafClick={onLeafClick}
            closeOnLeafClick
          />
        ))}
      </Menu>
    </div>
  );
}

export default function CascadingCategories() {
  return (
    <CascadeMenuProvider>
      <RootCascadingMenu data={mockCategories} />
    </CascadeMenuProvider>
  );
}
