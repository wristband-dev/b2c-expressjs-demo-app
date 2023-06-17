import React from 'react';
import { Container, Grid, Typography } from '@mui/material';

import { PaymentCardForm } from 'components';
import { sessionHooks } from 'hooks';

export function CardsPage() {
  const { data: paymentCard, error, isLoading } = sessionHooks.useSessionPaymentCard();

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your payment card: ' + error.message;
  }

  return (
    <Grid container marginX="auto" x={{ minHeight: '100vh', backgroundColor: '#fefefe' }}>
      <Grid item xs={12} margin="2rem 0" textAlign="center">
        <Typography fontSize="2rem">Payment Cards</Typography>
      </Grid>
      <Grid container item xs={12} marginBottom="2rem">
        <Grid item xs={1} sm={2} />
        <Grid container item xs={10} sm={8}>
          <Grid item xs={12}>
            <Typography variant="h5" margin="1rem 0">
              Current Card
            </Typography>
            <Container disableGutters sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography margin="0.25rem 0">{`Card Number: ************ ${paymentCard.lastFourDigits}`}</Typography>
              <Typography margin="0.25rem 0">{`Expires: ${paymentCard.expirationDate}`}</Typography>
            </Container>
          </Grid>
        </Grid>
        <Grid item xs={1} sm={2} />
      </Grid>
      <Grid container item xs={12} marginBottom="2rem">
        <Grid item xs={1} sm={2} />
        <Grid container item xs={10} sm={8}>
          <Grid item xs={12}>
            <Typography variant="h5" margin="1rem 0">
              Debit or Credit Card
            </Typography>
            <PaymentCardForm paymentCard={paymentCard} />
          </Grid>
        </Grid>
        <Grid item xs={1} sm={2} />
      </Grid>
    </Grid>
  );
}
