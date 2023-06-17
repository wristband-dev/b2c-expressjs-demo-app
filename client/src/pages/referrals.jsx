import React from 'react';
import { Box, Card, Container, Typography } from '@mui/material';

import { TouchpointChip, InviteUserForm } from 'components';
import { ReferralsBackground } from 'images';

const image = `linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1)), url(${ReferralsBackground})`;

export function ReferralsPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: image,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <Container sx={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)' }}>
        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.9)', margin: '0 auto', padding: '2rem', maxWidth: '48rem' }}>
          <Typography fontSize="2rem" textAlign="center" marginBottom="2rem">
            Invite your friends and get up to $25
          </Typography>
          <TouchpointChip />
          <InviteUserForm />
        </Card>
      </Container>
    </Box>
  );
}
