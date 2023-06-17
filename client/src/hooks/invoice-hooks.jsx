import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { invoiceService } from 'services';

export const useInvoices = () => {
  return useQuery(['invoices'], invoiceService.fetchInvoices, { placeholderData: [] });
};

export const useCreateInvoice = (closeFormDialog, fireConfetti) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(invoiceService.createInvoice, {
    onSuccess: () => {
      closeFormDialog();
      queryClient.invalidateQueries('invoices');
      setTimeout(() => {
        enqueueSnackbar(`Invoice sent successfully.`, { variant: 'success' });
        fireConfetti();
      }, 200);
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};

export const useCancelInvoice = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(invoiceService.cancelInvoice, {
    onMutate: async () => await queryClient.cancelQueries('invoices'),
    onSuccess: () => enqueueSnackbar(`Invoice cancelled successfully.`, { variant: 'success' }),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries('invoices'),
  });
};
