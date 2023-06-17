import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';

import { NewAccountForm } from 'components';

export function NewAccountDialog({ open }) {
  return (
    <Dialog keepMounted={false} fullScreen open={open}>
      <Grid container maxWidth={1200} marginX="auto">
        <Grid item xs={12}>
          <DialogTitle sx={{ padding: '0' }} marginTop="2rem" textAlign="center">
            <Typography fontSize="2rem">Getting Started</Typography>
          </DialogTitle>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={1} sm={2} />
          <Grid item xs={10} sm={8}>
            <DialogContent>
              <DialogContentText marginBottom="1rem">
                Welcome to Invotastic! Before you can start sending or receiving payments, we need to collect some basic
                information from you.
              </DialogContentText>
              <NewAccountForm />
            </DialogContent>
          </Grid>
          <Grid item xs={1} sm={2} />
        </Grid>
      </Grid>
    </Dialog>
  );
}
