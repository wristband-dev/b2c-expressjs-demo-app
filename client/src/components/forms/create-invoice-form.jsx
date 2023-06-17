import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { FormControl, FormHelperText, IconButton, TextField, Tooltip } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LoadingButton from '@mui/lab/LoadingButton';
import { NumericFormat } from 'react-number-format';
import SendIcon from '@mui/icons-material/Send';
import { formatISO } from 'date-fns';

import { invoiceHooks } from 'hooks';

export function CreateInvoiceForm({ closeFormDialog, fireConfetti }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [totalDue, setTotalDue] = useState(null);

  const { mutate: createInvoice, isSubmitting } = invoiceHooks.useCreateInvoice(closeFormDialog, fireConfetti);

  const emojiPickerRef = useOnclickOutside(() => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
  });

  const onEmojiClick = (event, emojiObject) => {
    event.preventDefault();
    onMessageChange(message + emojiObject.emoji);
  };

  const handleSubmit = () => {
    createInvoice({
      recipientEmail,
      message,
      totalDue: parseFloat(totalDue).toFixed(2),
      invoiceDate: formatISO(new Date(), { representation: 'date' }),
    });
  };

  const onMessageChange = (value) => {
    if (!value || value.length <= 280) {
      setMessage(value);
    }
  };

  // Super crude form validation :o)
  const submitEnabled = recipientEmail && message && totalDue;

  return (
    <form>
      <FormControl fullWidth sx={{ margin: '0.75rem auto' }}>
        <TextField
          id="customer-email"
          label="Who Owes Money? (email)"
          type="email"
          variant="outlined"
          fullWidth
          required
          spellCheck={false}
          value={recipientEmail}
          onChange={(event) => setRecipientEmail(event.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ margin: '0.75rem auto' }}>
        <NumericFormat
          customInput={TextField}
          autoComplete="off"
          allowNegative={false}
          decimalScale={2}
          decimalSeparator="."
          displayType="input"
          label="How Much?"
          onValueChange={(values) => setTotalDue(values.value)}
          prefix="$ "
          required
          thousandsGroupStyle="thousand"
          thousandSeparator={true}
          type="text"
          value={totalDue}
          valueIsNumericString={true}
          variant="outlined"
        />
      </FormControl>
      <FormControl fullWidth sx={{ position: 'relative' }}>
        <TextField
          id="message"
          label="What's it for?"
          type="text"
          variant="outlined"
          fullWidth
          required
          multiline
          rows={5}
          spellCheck={false}
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          sx={{ '& textarea': { letterSpacing: '0.25px', lineHeight: '1.5' } }}
          InputProps={{
            endAdornment: (
              <Tooltip title="Add Emoji">
                <IconButton
                  sx={{ color: 'rgb(167, 178, 0)', marginTop: 'auto', padding: '0.5rem' }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <EmojiEmotionsIcon />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
        {showEmojiPicker && (
          <div ref={emojiPickerRef} style={{ position: 'absolute', zIndex: '100', bottom: '0', right: '0' }}>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <FormHelperText>Max 280 characters</FormHelperText>
      </FormControl>
      <LoadingButton
        loading={isSubmitting}
        disabled={!submitEnabled}
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{ marginTop: '2rem' }}
        startIcon={<SendIcon />}
      >
        SEND PAYMENT REQUEST
      </LoadingButton>
    </form>
  );
}
