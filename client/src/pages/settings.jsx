import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import { TouchpointChip, ChangeEmailForm, CustomDivider, ProfileSettingsForm } from 'components';

export function SettingsPage() {
  return (
    <Grid container marginX="auto" x={{ minHeight: '100vh', backgroundColor: '#fefefe' }}>
      <Grid item xs={12} marginTop="2rem" textAlign="center">
        <Typography fontSize="2rem">Account Settings</Typography>
      </Grid>
      <Grid container item xs={12} marginBottom="2rem">
        <Grid item xs={1} sm={2} />
        <Grid container item xs={10} sm={8}>
          <Grid item xs={12}>
            <Typography fontSize="1.5rem" margin="1rem 0 0.5rem">
              Profile
            </Typography>
            <TouchpointChip />
            <ProfileSettingsForm />
          </Grid>
          <Grid item xs={12} marginY={2}>
            <CustomDivider />
          </Grid>
          <Grid item xs={12}>
            <Typography fontSize="1.5rem" margin="1rem 0 0.5rem">
              Email
            </Typography>
            <TouchpointChip />
            <ChangeEmailForm />
          </Grid>
          <Grid item xs={12} marginY={2}>
            <CustomDivider />
          </Grid>
          <Grid item xs={12}>
            <Typography fontSize="1.5rem" margin="1rem 0 0.5rem">
              Sign Out of Account
            </Typography>
            <TouchpointChip />
            <Typography margin="1rem 0">Leavin so soon?</Typography>
            <Container disableGutters sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                startIcon={<LogoutIcon />}
                href={`${window.location.origin}/api/auth/logout`}
                sx={{ maxWidth: '15rem' }}
              >
                SIGN OUT
              </Button>
            </Container>
          </Grid>
        </Grid>
        <Grid item xs={1} sm={2} />
      </Grid>
    </Grid>
  );
}
