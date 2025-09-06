"use client";

import * as React from "react";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Stack from "@mui/material/Stack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box } from "@mui/material";

type Timer = number | undefined;

export type MenuNode = {
  label: string;
  onClick?: () => void;
  children?: MenuNode[];
};

type UseHoverIntentArgs = {
  closeDelayMs?: number;
  openGuardMs?: number;
};

function useHoverIntent({
  closeDelayMs = 180,
  openGuardMs = 120,
}: UseHoverIntentArgs) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const closeTimer = React.useRef<Timer>();
  const guardTimer = React.useRef<Timer>();
  const openingGuard = React.useRef(false);

  const clear = (ref: React.MutableRefObject<Timer>) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = undefined;
    }
  };

  const openFrom = (el: HTMLElement) => {
    clear(closeTimer);
    openingGuard.current = true;
    setAnchorEl(el);
    clear(guardTimer);
    guardTimer.current = window.setTimeout(() => {
      openingGuard.current = false;
    }, openGuardMs);
  };

  const scheduleClose = (cb?: () => void) => {
    clear(closeTimer);
    closeTimer.current = window.setTimeout(() => {
      setAnchorEl(null);
      cb?.();
    }, closeDelayMs);
  };

  const cancelClose = () => clear(closeTimer);

  const ignoreMouseLeave = () => openingGuard.current;

  React.useEffect(() => {
    return () => {
      clear(closeTimer);
      clear(guardTimer);
    };
  }, []);

  return {
    anchorEl,
    open,
    setAnchorEl,
    openFrom,
    scheduleClose,
    cancelClose,
    ignoreMouseLeave,
  };
}

/** Item recursivo: abre submenu (Popper) ao lado via hover */
function HoverMenuItem({
  node,
  depth,
  parentCancelClose,
  parentScheduleClose,
}: {
  node: MenuNode;
  depth: number;
  parentCancelClose: () => void;
  parentScheduleClose: (cb?: () => void) => void;
}) {
  const {
    anchorEl,
    open,
    openFrom,
    scheduleClose,
    cancelClose,
    ignoreMouseLeave,
    setAnchorEl,
  } = useHoverIntent({ closeDelayMs: 200, openGuardMs: 120 });

  const hasChildren = !!node.children?.length;

  const handleEnterItem = (e: React.MouseEvent<HTMLElement>) => {
    parentCancelClose(); // manter pai aberto
    if (hasChildren) openFrom(e.currentTarget);
  };

  const handleLeaveItem = () => {
    if (ignoreMouseLeave()) return;
    if (hasChildren) scheduleClose(); // fecha só o submenu deste item
  };

  const handleEnterMenu = () => {
    cancelClose();
    parentCancelClose();
  };

  const handleLeaveMenu = () => {
    // ao sair da área do submenu, feche este submenu e deixe o pai decidir fechar depois
    scheduleClose();
  };

  return (
    <>
      <MenuItem
        onMouseEnter={handleEnterItem}
        onMouseLeave={handleLeaveItem}
        onClick={() => {
          if (node.onClick) node.onClick();
          // se for um link final, feche toda a cadeia:
          parentScheduleClose(() => setAnchorEl(null));
        }}
        sx={{ justifyContent: "space-between", gap: 1 }}
      >
        <span>{node.label}</span>
        {hasChildren ? <span>▸</span> : null}
      </MenuItem>

      {hasChildren && open && anchorEl && (
        <Popper
          open
          anchorEl={anchorEl}
          placement="right-start"
          modifiers={[
            { name: "offset", options: { offset: [0, 0] } },
            { name: "preventOverflow", options: { padding: 8 } },
          ]}
        >
          <Paper
            onMouseEnter={handleEnterMenu}
            onMouseLeave={handleLeaveMenu}
            elevation={8}
          >
            <MenuList
              dense
              autoFocusItem={false}
              aria-label={`submenu depth ${depth + 1}`}
            >
              {node.children!.map((child, i) => (
                <HoverMenuItem
                  key={`${depth + 1}-${i}-${child.label}`}
                  node={child}
                  depth={depth + 1}
                  parentCancelClose={cancelClose}
                  parentScheduleClose={scheduleClose}
                />
              ))}
            </MenuList>
          </Paper>
        </Popper>
      )}
    </>
  );
}

/** Raiz do menu: botão âncora + lista de 1º nível */
export default function HoverRecursiveMenu({
  label = "Produtos",
  items,
  closeDelayMs = 200,
  openGuardMs = 120,
}: {
  label?: string;
  items: MenuNode[];
  closeDelayMs?: number;
  openGuardMs?: number;
}) {
  const {
    anchorEl,
    open,
    openFrom,
    scheduleClose,
    cancelClose,
    ignoreMouseLeave,
  } = useHoverIntent({ closeDelayMs, openGuardMs });

  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const handleButtonEnter = (e: React.MouseEvent<HTMLElement>) => {
    openFrom(e.currentTarget as HTMLElement);
  };

  const handleButtonLeave = () => {
    if (ignoreMouseLeave()) return;
    scheduleClose();
  };

  const handleRootEnter = () => cancelClose();
  const handleRootLeave = () => scheduleClose();

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button
        ref={buttonRef}
        disableRipple
        sx={{
          all: "unset",
        }}
        onMouseEnter={handleButtonEnter}
        onMouseLeave={handleButtonLeave}
        onClick={(e) => openFrom(e.currentTarget as HTMLElement)} // opcional: clique também abre
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {label}
        <ArrowDropDownIcon fontSize="small" />
      </Button>

      {open && anchorEl && (
        <Popper
          open
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            { name: "offset", options: { offset: [0, 4] } },
            { name: "preventOverflow", options: { padding: 8 } },
          ]}
        >
          <ClickAwayListener onClickAway={() => scheduleClose()}>
            <Paper
              onMouseEnter={handleRootEnter}
              onMouseLeave={handleRootLeave}
              elevation={8}
            >
              <MenuList dense autoFocusItem={false} aria-label="menu principal">
                {items.map((node, i) => (
                  <HoverMenuItem
                    key={`0-${i}-${node.label}`}
                    node={node}
                    depth={0}
                    parentCancelClose={cancelClose}
                    parentScheduleClose={scheduleClose}
                  />
                ))}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </Stack>
  );
}
