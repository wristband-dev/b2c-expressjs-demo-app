import React, { useState } from 'react';
import { Container, FormControl, FormHelperText, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import MuiPhoneNumber from 'material-ui-phone-number';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { format } from 'date-fns';

import { sessionHooks } from 'hooks';
import { constants } from 'utils';

export function NewAccountForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState(null);
  const [securityCode, setSecurityCode] = useState('');
  const [zipCode, setZipCode] = useState('');

  const { mutate: initializeAccount, isLoading } = sessionHooks.useInitializeAccount();

  const onCardNumberChange = (value) => {
    if (value.length <= 19) {
      const normalizedValue = value.replace(constants.NON_NUMERIC_CHARS, '');
      const cardNumberSpaces = normalizedValue.match(/.{1,4}/g);
      setCardNumber(cardNumberSpaces ? cardNumberSpaces.join(' ') : normalizedValue);
    }
  };

  const onSecurityCodeChange = (value) => {
    if (value.length <= 3) {
      setSecurityCode(value.replace(constants.NON_NUMERIC_CHARS, ''));
    }
  };

  const onZipCodeChange = (value) => {
    if (value.length <= 5) {
      setZipCode(value.replace(constants.NON_NUMERIC_CHARS, ''));
    }
  };

  const onSubmit = () => {
    initializeAccount({
      givenName: firstName,
      familyName: lastName,
      phoneNumber,
      cardNumber: cardNumber.replace(constants.NON_NUMERIC_CHARS, ''),
      expirationDate: expirationDate ? format(expirationDate, 'MM/yy') : null,
      securityCode,
      zipCode,
    });
  };

  // Super crude form validation :o)
  const submitEnabled =
    firstName &&
    lastName &&
    phoneNumber &&
    expirationDate &&
    expirationDate instanceof Date &&
    !isNaN(expirationDate) &&
    securityCode &&
    cardNumber &&
    zipCode &&
    zipCode.length === 5;

  return (
    <form>
      <FormControl fullWidth sx={{ margin: '0 auto 0.75rem' }}>
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
          label="Phone Number (SMS-enabled)"
          variant="outlined"
          value={phoneNumber}
          required
          defaultCountry={'us'}
          onChange={(value) => setPhoneNumber(value)}
          sx={{ svg: { height: '1.25rem' } }}
        />
        <FormHelperText>
          By submitting, you confirm that you are authorized to use the number entered and agree to receive SMS texts to
          verify your own the number. Carrier fees may apply.
        </FormHelperText>
      </FormControl>
      <Container sx={{ margin: '1rem 0 0', padding: '0 !important' }}>
        <Typography sx={{ fontSize: '1.25rem' }}>Debit or Credit Card</Typography>
        <Typography sx={{ color: 'rgba(0,0,0,0.54)', fontSize: '1rem', margin: '0.5rem 0 1rem' }}>
          We charge a 3% fee for sending money with credit cards. We don&apos;t charge for purchases or any debit card
          payments.
        </Typography>
      </Container>
      <FormControl fullWidth sx={{ margin: '0.75rem auto' }}>
        <TextField
          id="card-number"
          label="Card Number"
          type="text"
          variant="outlined"
          required
          fullWidth
          spellCheck={false}
          value={cardNumber}
          onChange={(event) => onCardNumberChange(event.target.value)}
          InputProps={{ endAdornment: <CreditCardIcon /> }}
        />
      </FormControl>
      <Container disableGutters sx={{ display: 'flex', flexDirection: 'row', margin: '0.75rem auto' }}>
        <FormControl sx={{ flex: '3 1' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              id="expiration-date"
              label="Expiration Date"
              format="MM/yy"
              disablePast
              views={['month', 'year']}
              minDate={new Date()}
              value={expirationDate}
              onChange={(value) => setExpirationDate(value)}
              slotProps={{ textField: { variant: 'outlined', required: true } }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ flex: '2 1', paddingLeft: '2rem' }}>
          <TextField
            id="security-code"
            label="Security Code"
            type="text"
            variant="outlined"
            fullWidth
            required
            spellCheck={false}
            value={securityCode}
            onChange={(event) => onSecurityCodeChange(event.target.value)}
          />
        </FormControl>
      </Container>
      <FormControl fullWidth sx={{ margin: '0.75rem auto 2rem' }}>
        <TextField
          id="zip-code"
          label="Zip Code"
          type="text"
          variant="outlined"
          fullWidth
          required
          spellCheck={false}
          value={zipCode}
          onChange={(event) => onZipCodeChange(event.target.value)}
        />
      </FormControl>
      <LoadingButton
        loading={isLoading}
        disabled={!submitEnabled}
        variant="contained"
        fullWidth
        onClick={onSubmit}
        startIcon={<ThumbUpIcon />}
      >
        START INVOICING
      </LoadingButton>
    </form>
  );
}
