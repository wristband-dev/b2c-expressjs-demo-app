import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    spacing: (factor) => `${0.25 * factor}rem`,
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.54)',
      disabled: 'rgba(0,0,0,0.38)',
      hint: 'rgba(0,0,0,0.38)',
    },
    primary: {
      main: '#FF00EF',
      light: 'rgb(255, 51, 242)',
      dark: 'rgb(178, 0, 167)',
      contrastText: '#fff',
    },
    secondary: {
      main: '#efff00',
      light: 'rgb(242, 255, 51)',
      dark: 'rgb(167, 178, 0)',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    error: {
      main: '#FF1000',
      light: 'rgb(255, 63, 51)',
      dark: 'rgb(178, 11, 0)',
      contrastText: '#fff',
    },
    warning: {
      main: '#FF8F00',
      light: 'rgb(255, 165, 51)',
      dark: 'rgb(178, 100, 0)',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    info: {
      main: '#0070FF',
      light: 'rgb(51, 140, 255)',
      dark: 'rgb(0, 78, 178)',
      contrastText: '#fff',
    },
    success: {
      main: '#00FF10',
      light: 'rgb(51, 255, 63)',
      dark: 'rgb(0, 178, 11)',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    divider: 'rgba(0,0,0,0.12)',
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
});
