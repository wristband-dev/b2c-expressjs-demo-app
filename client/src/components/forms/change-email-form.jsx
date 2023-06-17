import React, { useState } from 'react';
import { Button, Container, FormControl, TextField, Typography } from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import EmailIcon from '@mui/icons-material/Email';

import { sessionHooks, settingsActionsHooks } from 'hooks';

const buttonStyles = { display: 'flex', justifyContent: 'center', margin: '2rem auto' };

export function ChangeEmailForm() {
  const [newEmail, setNewEmail] = useState('');

  const clearNewEmail = () => {
    setNewEmail('');
  };

  const { data: user } = sessionHooks.useSessionUser();
  const {
    data: changeEmailRequests,
    error: emailError,
    isLoading: emailLoading,
  } = settingsActionsHooks.useChangeEmailRequests();
  const { mutate: createChangeEmailRequest, isLoading: emailSubmitting } =
    settingsActionsHooks.useCreateChangeEmailRequest(clearNewEmail);
  const { mutate: cancelChangeEmailRequest, isLoading: emailCancelling } =
    settingsActionsHooks.useCancelChangeEmailRequest();

  const { items, totalResults } = changeEmailRequests;
  const hasExistingChangeEmailRequest = totalResults > 0;

  const changeEmail = () => {
    createChangeEmailRequest({ newEmail });
  };

  const cancelChangeEmail = () => {
    cancelChangeEmailRequest({ requestId: items[0].id });
    setNewEmail('');
  };

  if (emailLoading) {
    return 'Loading...';
  }

  if (emailError) {
    return 'An error has occurred retrieving your change email requests: ' + emailError.message;
  }

  return (
    <form>
      <Typography margin="1rem 0">
        Email Address:
        <Typography variant="span" sx={{ paddingLeft: '0.5rem' }}>
          <strong>{user.email}</strong>
        </Typography>
      </Typography>
      {hasExistingChangeEmailRequest && (
        <>
          <Typography margin="1rem 0">
            You have requested to change your email address. Instructions have been sent to:
            <Typography variant="span" sx={{ paddingLeft: '0.5rem' }}>
              <strong>{items[0].newEmail}</strong>
            </Typography>
            .
          </Typography>
          <Container disableGutters sx={buttonStyles}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              disabled={emailCancelling}
              onClick={cancelChangeEmail}
              startIcon={<DoNotDisturbIcon />}
              sx={{ maxWidth: '15rem' }}
            >
              CANCEL
            </Button>
          </Container>
        </>
      )}
      {!hasExistingChangeEmailRequest && (
        <>
          <Typography margin="1rem 0">
            You can change your current email address after confirming your new email address.
          </Typography>
          <FormControl variant="outlined" fullWidth sx={{ margin: '0.75rem auto' }}>
            <TextField
              id="new-email"
              label="New Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              spellCheck={false}
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
            />
          </FormControl>
          <Container disableGutters sx={buttonStyles}>
            <Button
              variant="contained"
              fullWidth
              disabled={!newEmail || emailSubmitting}
              onClick={changeEmail}
              startIcon={<EmailIcon />}
              sx={{ maxWidth: '15rem' }}
            >
              CHANGE EMAIL
            </Button>
          </Container>
        </>
      )}
    </form>
  );
}
