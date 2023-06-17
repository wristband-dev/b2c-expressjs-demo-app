import React, { useCallback, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, Container, Typography, useTheme } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import WarningIcon from '@mui/icons-material/Warning';
import ReactCanvasConfetti from 'react-canvas-confetti';

import { CreateInvoiceDialog, InvoiceTable } from 'components';
import { invoiceHooks } from 'hooks';
import { constants, util } from 'utils';

export function HomePage() {
  const [showPaymentActivity, setShowPaymentActivity] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  const { data: invoices, error, isLoading: isInvoicesLoading } = invoiceHooks.useInvoices();

  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fireConfetti = useCallback(() => util.arrangeConfetti(makeShot), [makeShot]);

  const theme = useTheme();

  if (isInvoicesLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your invoices: ' + error.message;
  }

  return (
    <Box
      sx={{
        padding: '0 1.5rem',
        minHeight: '100vh',
        backgroundColor: '#fefefe',
        backgroundImage:
          'radial-gradient(#FF00EF 0.65px, transparent 0.65px), radial-gradient(#FF00EF 0.65px, #fafaff 0.65px)',
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0,13px 13px',
      }}
    >
      <ReactCanvasConfetti refConfetti={getInstance} style={constants.CONFETTI_CANVAS_STYLE} />
      <Typography
        margin="0 auto"
        padding="3rem 0 2rem"
        textAlign="center"
        fontSize="1.75rem"
        fontWeight={700}
        letterSpacing="0.75px"
      >
        Welcome to a simpler peer-to-peer invoicing.
      </Typography>
      <Box margin="0 auto" display="flex" alignItems="center" justifyContent="center">
        <WarningIcon sx={{ color: theme.palette.warning.main }} />
        <Typography fontStyle="italic" fontWeight={400} paddingLeft="1rem">
          (We are currently in Beta!)
        </Typography>
      </Box>
      <Box margin="5rem auto">
        <CreateInvoiceDialog
          open={showCreateInvoice}
          handleClose={() => setShowCreateInvoice(false)}
          fireConfetti={fireConfetti}
        />
        <Container
          disableGutters
          sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '18rem' }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<PaidIcon />}
            onClick={() => setShowCreateInvoice(true)}
            sx={{ height: '2.5rem' }}
          >
            REQUEST PAYMENT
          </Button>
        </Container>
      </Box>
      <Box marginBottom="2rem">
        <Typography fontSize="1.75rem" textAlign="center" fontWeight={500}>
          Activity Feed
        </Typography>
        <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
          <ButtonGroup color="info" sx={{ backgroundColor: '#eee' }} aria-label="activity feed button group">
            <Button
              sx={{}}
              variant={showPaymentActivity ? 'outlined' : 'contained'}
              onClick={() => setShowPaymentActivity(false)}
            >
              REQUESTS
            </Button>
            <Button
              variant={showPaymentActivity ? 'contained' : 'outlined'}
              onClick={() => setShowPaymentActivity(true)}
            >
              PAYMENTS
            </Button>
          </ButtonGroup>
        </Container>
        <Container
          disableGutters
          sx={{ display: 'flex', justifyContent: 'center', margin: '3rem auto', maxWidth: '60rem' }}
        >
          {!showPaymentActivity && invoices.length === 0 && (
            <Typography variant="h5">You haven&apos;t sent any invoices yet.</Typography>
          )}
          {!showPaymentActivity && invoices.length > 0 && <InvoiceTable invoices={invoices} />}
          {showPaymentActivity && <Typography variant="h5">You haven&apos;t made any payments yet.</Typography>}
        </Container>
      </Box>
    </Box>
  );
}
