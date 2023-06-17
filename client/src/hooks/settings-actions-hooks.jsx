import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { settingsService } from 'services';

export const useCreateNewUserInvite = (onInviteSuccess) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(settingsService.createNewUserInvite, {
    onSuccess: () => {
      onInviteSuccess();
      enqueueSnackbar('The user invite email has been sent.', { variant: 'success' });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['new-user-invites'] }),
  });
};

export const useChangeEmailRequests = () => {
  return useQuery(['change-email-requests'], settingsService.fetchChangeEmailRequests, {
    placeholderData: { items: [], totalResults: 0 },
  });
};

export const useCreateChangeEmailRequest = (clearNewEmail) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(settingsService.createChangeEmailRequest, {
    onSuccess: () => {
      clearNewEmail();
      enqueueSnackbar('Check your inbox for further instructions.', { variant: 'success' });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['change-email-requests'] }),
  });
};

export const useCancelChangeEmailRequest = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(settingsService.cancelChangeEmailRequest, {
    onMutate: async () => await queryClient.cancelQueries({ queryKey: ['change-email-requests'], exact: true }),
    onSuccess: () => enqueueSnackbar('Change email request has been cancelled.', { variant: 'success' }),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(`${error.response.data.code}`, { variant: 'error' });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['change-email-requests'] }),
  });
};
