import React, { useState } from 'react';
import { Button, Container, FormControl, TextField } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SaveIcon from '@mui/icons-material/Save';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

import { sessionHooks } from 'hooks';
import { constants } from 'utils';

export function PaymentCardForm({ paymentCard }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState(null);
  const [securityCode, setSecurityCode] = useState('');
  const [zipCode, setZipCode] = useState('');

  const clearCardForm = () => {
    setCardNumber('');
    setExpirationDate(null);
    setSecurityCode('');
    setZipCode('');
  };

  const { mutate: updatePaymentCard, isLoading } = sessionHooks.useUpdatePaymentCard(clearCardForm);

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

  const updatePaymentCardInfo = () => {
    updatePaymentCard({
      id: paymentCard.id,
      cardNumber: cardNumber.replace(constants.NON_NUMERIC_CHARS, ''),
      expirationDate: expirationDate ? format(expirationDate, 'MM/yy') : null,
      securityCode,
      zipCode,
    });
  };

  // Super crude form validation :o)
  const submitEnabled =
    expirationDate &&
    expirationDate instanceof Date &&
    !isNaN(expirationDate) &&
    securityCode &&
    cardNumber &&
    zipCode &&
    zipCode.length === 5;

  return (
    <form>
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
      <Container disableGutters sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!submitEnabled || isLoading}
          onClick={updatePaymentCardInfo}
          startIcon={<SaveIcon />}
          sx={{ maxWidth: '15rem' }}
        >
          SAVE
        </Button>
      </Container>
    </form>
  );
}
