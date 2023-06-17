import React from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

import { invoiceHooks } from 'hooks';

export function InvoiceTable({ invoices = [] }) {
  const { mutate: cancelInvoice } = invoiceHooks.useCancelInvoice();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="invoice table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Who</TableCell>
            <TableCell align="left">Note</TableCell>
            <TableCell align="right">How Much</TableCell>
            <TableCell align="right">Paid</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {invoice.invoiceDate}
              </TableCell>
              <TableCell align="left">{invoice.recipientEmail}</TableCell>
              <TableCell align="left">{invoice.message}</TableCell>
              <TableCell align="right">{'$ ' + invoice.totalDue}</TableCell>
              <TableCell align="right">{invoice.status.toUpperCase() === 'PAID' ? 'Yes' : 'No'}</TableCell>
              <TableCell align="center">
                <Tooltip title="Cancel Invoice">
                  <IconButton
                    aria-label="Cancel Invoice"
                    onClick={() => cancelInvoice(invoice.id)}
                    sx={{ color: '#FF1000', padding: '0.5rem' }}
                  >
                    <DoNotDisturbIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
