import React, { useCallback, useRef, useState } from 'react';
import { Button, Container, FormControl, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactCanvasConfetti from 'react-canvas-confetti';

import { CustomDivider } from 'components';
import { settingsActionsHooks } from 'hooks';
import { constants, util } from 'utils';

const DESCRIPTION =
  `You'll get $5 for each friend who signs up and either makes or receives a payment of at least $5.` +
  ` After the invite, your friends have 14 days to send or receive a payment.`;

export function InviteUserForm() {
  const [inviteEmail, setInviteEmail] = useState('');

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

  const onInviteSuccess = () => {
    setInviteEmail('');
    fireConfetti();
  };

  const { mutate: createNewUserInvite, isLoading: isSubmitting } =
    settingsActionsHooks.useCreateNewUserInvite(onInviteSuccess);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <form>
      <ReactCanvasConfetti refConfetti={getInstance} style={constants.CONFETTI_CANVAS_STYLE} />
      <Typography margin="1rem 0">{DESCRIPTION}</Typography>
      <Container
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '2rem auto',
        }}
      >
        <Container
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: '1rem',
          }}
        >
          <Typography paddingBottom="0.25rem" variant={isMobile ? 'h5' : 'h4'} textAlign="center">
            {'0 / 5'}
          </Typography>
          <Typography fontSize={isMobile ? '0.875rem' : '1rem'} textAlign="center">
            Total referrals
          </Typography>
        </Container>
        <CustomDivider flexItem orientation="vertical" />
        <Container
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '1rem',
          }}
        >
          <Typography paddingBottom="0.25rem" variant={isMobile ? 'h5' : 'h4'} textAlign="center">
            {'$ 0'}
          </Typography>
          <Typography fontSize={isMobile ? '0.875rem' : '1rem'} textAlign="center">
            Total earned
          </Typography>
        </Container>
      </Container>
      <FormControl fullWidth sx={{ margin: '0.75rem auto' }}>
        <TextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          spellCheck={false}
          value={inviteEmail}
          onChange={(event) => setInviteEmail(event.target.value)}
        />
      </FormControl>
      <Container disableGutters sx={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!inviteEmail || isSubmitting}
          onClick={() => createNewUserInvite(inviteEmail)}
          startIcon={<SendIcon />}
          sx={{ maxWidth: '15rem' }}
        >
          INVITE
        </Button>
      </Container>
    </form>
  );
}
