import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Box, Toolbar, Tooltip, styled, useTheme, useMediaQuery } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import { SideDrawer } from 'components';
import { Logo } from 'images';

const linkStyle = ({ theme }) => {
  return {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    display: 'flex',
    height: '100%',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: '#ffffff',
      filter: 'brightness(80%)',
      cursor: 'pointer',
    },
  };
};
const StyledRouterLink = styled(Link)(linkStyle);

export function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeMobile = useMediaQuery(theme.breakpoints.up('md'));
  const paddingX = isLargeMobile ? 1.8125 : 2.5;
  const paddingY = isLargeMobile ? 3.5 : 4;
  const linkPadding = { padding: `${theme.spacing(paddingX)} ${theme.spacing(paddingY)}` };

  return (
    <AppBar
      position="sticky"
      sx={{ background: 'linear-gradient(0deg, rgba(221,221,221,1) 0%, rgba(254,254,254,1) 100%)' }}
    >
      <Toolbar sx={{ height: '100%' }}>
        <Link to="/">
          <Box
            component="img"
            sx={{ cursor: 'pointer', height: '2.75rem', maxHeight: { xs: '2rem', sm: '2.5rem', md: '2.75rem' } }}
            alt="Logo"
            src={Logo}
          />
        </Link>
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', marginLeft: 'auto' }}>
          {isMobile ? (
            <SideDrawer />
          ) : (
            <>
              <Tooltip title="Home">
                <StyledRouterLink sx={linkPadding} to="/home">
                  <HomeIcon fontSize={isLargeMobile ? 'large' : 'medium'} />
                </StyledRouterLink>
              </Tooltip>
              <Tooltip title="Referrals">
                <StyledRouterLink sx={linkPadding} to="/referrals">
                  <CelebrationIcon fontSize={isLargeMobile ? 'large' : 'medium'} />
                </StyledRouterLink>
              </Tooltip>
              <Tooltip title="Manage Cards">
                <StyledRouterLink sx={linkPadding} to="/cards">
                  <CreditCardIcon fontSize={isLargeMobile ? 'large' : 'medium'} />
                </StyledRouterLink>
              </Tooltip>
              <Tooltip title="Account Settings">
                <StyledRouterLink sx={linkPadding} to="/settings">
                  <AccountCircleIcon fontSize={isLargeMobile ? 'large' : 'medium'} />
                </StyledRouterLink>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
