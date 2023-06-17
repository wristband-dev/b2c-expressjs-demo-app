import React from 'react';
import { Divider, useTheme } from '@mui/material';

export function CustomDivider({ flexItem = false, orientation = 'horizontal' }) {
  const theme = useTheme();
  const isVertical = orientation === 'vertical';

  return (
    <Divider
      orientation={orientation}
      flexItem={flexItem}
      color={theme.palette.secondary.main}
      sx={isVertical ? undefined : { borderWidth: isVertical ? undefined : '0.05rem', margin: '0 auto', width: '75%' }}
    />
  );
}
