import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { sessionService } from 'services';

export const useInitializeAccount = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(sessionService.initializeAccount, {
    onSuccess: (data) => {
      queryClient.setQueryData(['session-payment-card'], () => data.paymentCard);
      queryClient.setQueryData(['session-user'], () => data.user);
      enqueueSnackbar('Thanks for joining Invotastic.  Cheers!', { variant: 'success' });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};

export const useSessionPaymentCard = () => {
  return useQuery(['session-payment-card'], sessionService.fetchSessionPaymentCard, {
    cacheTime: Infinity,
    placeholderData: {},
  });
};

export const useSessionUser = () => {
  return useQuery(['session-user'], sessionService.fetchSessionUser, { cacheTime: Infinity, placeholderData: {} });
};

export const useUpdatePaymentCard = (clearCardForm) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(sessionService.updateSessionPaymentCard, {
    onMutate: async (updatedPaymentCard) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['session-payment-card'], exact: true });
      // Snapshot the previous value
      const previousPaymentCard = queryClient.getQueryData(['session-payment-card']);
      // Optimistically update to the new value
      queryClient.setQueryData(['session-payment-card'], { ...previousPaymentCard, ...updatedPaymentCard });
      // Return a context with the previous and new value
      return { previousPaymentCard, updatedPaymentCard };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['session-payment-card'], data);
      clearCardForm();
      enqueueSnackbar('Payment card updated successfully.', { variant: 'success' });
    },
    onError: (error, updatedPaymentCard, context) => {
      console.log(error);
      queryClient.setQueryData(['session-payment-card'], context.previousPaymentCard);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};

export const useUpdateSessionUser = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(sessionService.updateSessionUser, {
    onMutate: async (updatedUser) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['session-user'], exact: true });
      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(['session-user']);
      // Optimistically update to the new value
      queryClient.setQueryData(['session-user'], { ...previousUser, ...updatedUser });
      // Return a context with the previous and new value
      return { previousUser, updatedUser };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['session-user'], data);
      enqueueSnackbar('Profile updated successfully.', { variant: 'success' });
    },
    onError: (error, updatedUser, context) => {
      console.log(error);
      queryClient.setQueryData(['session-user'], context.previousUser);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
  });
};
