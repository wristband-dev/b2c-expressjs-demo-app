import React, { useState } from 'react';
import { Button, Container, FormControl, TextField } from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';
import SaveIcon from '@mui/icons-material/Save';

import { sessionHooks } from 'hooks';

export function ProfileSettingsForm() {
  const { data: user, error, isFetching, isLoading } = sessionHooks.useSessionUser();
  const { mutate: updateUser } = sessionHooks.useUpdateSessionUser();

  const [firstName, setFirstName] = useState(user.givenName ?? '');
  const [lastName, setLastName] = useState(user.familyName ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '');

  const updateUserInfo = () => {
    updateUser({
      id: user.id,
      givenName: firstName,
      familyName: lastName,
      phoneNumber,
    });
  };

  const isEmptyPhoneNumber = () => {
    return !phoneNumber || phoneNumber === '+';
  };

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your user: ' + error.message;
  }

  return (
    <form>
      <FormControl fullWidth sx={{ margin: '1.75rem auto 0.75rem' }}>
        <TextField
          id="first-name"
          label="First Name"
          type="text"
          variant="outlined"
          required
          fullWidth
          spellCheck={false}
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ margin: '0.75rem auto' }}>
        <TextField
          id="last-name"
          label="Last Name"
          type="text"
          variant="outlined"
          required
          fullWidth
          spellCheck={false}
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ margin: '0.75rem auto' }}>
        <MuiPhoneNumber
          id="phone-number"
          label="Phone Number"
          variant="outlined"
          value={phoneNumber}
          required
          defaultCountry={'us'}
          onChange={(value) => setPhoneNumber(value)}
          sx={{ svg: { height: '1.25rem' } }}
        />
      </FormControl>
      <Container disableGutters sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={isFetching || !firstName || !lastName || isEmptyPhoneNumber(phoneNumber)}
          onClick={updateUserInfo}
          startIcon={<SaveIcon />}
          sx={{ maxWidth: '15rem' }}
        >
          SAVE
        </Button>
      </Container>
    </form>
  );
}
