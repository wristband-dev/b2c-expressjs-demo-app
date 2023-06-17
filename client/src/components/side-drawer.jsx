import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Divider, Drawer, IconButton, List, ListItem, ListItemText, Typography, styled, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const linkStyle = ({ theme }) => {
  return {
    color: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(1),
    textDecoration: 'none',
    '& p': {
      fontWeight: '500',
      paddingLeft: theme.spacing(1),
    },
  };
};

const StyledRouterLink = styled(Link)(linkStyle);
const StyledListItem = styled(ListItem)(({ theme }) => {
  return {
    '&:hover': { backgroundColor: theme.palette.secondary.main },
  };
});

export function SideDrawer() {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Drawer
        PaperProps={{ sx: { paddingTop: '1rem', width: '12rem' } }}
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
          <Divider />
          <StyledListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <StyledRouterLink to="/home">
                <HomeIcon />
                <Typography>Home</Typography>
              </StyledRouterLink>
            </ListItemText>
          </StyledListItem>
          <Divider />
          <StyledListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <StyledRouterLink to="/referrals">
                <CelebrationIcon />
                <Typography>Referrals</Typography>
              </StyledRouterLink>
            </ListItemText>
          </StyledListItem>
          <Divider />
          <StyledListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <StyledRouterLink to="/cards">
                <CreditCardIcon />
                <Typography>Cards</Typography>
              </StyledRouterLink>
            </ListItemText>
          </StyledListItem>
          <Divider />
          <StyledListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <StyledRouterLink to="/settings">
                <AccountCircleIcon />
                <Typography>Settings</Typography>
              </StyledRouterLink>
            </ListItemText>
          </StyledListItem>
          <Divider />
        </List>
      </Drawer>
      <IconButton sx={{ color: theme.palette.primary.main }} onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </>
  );
}
