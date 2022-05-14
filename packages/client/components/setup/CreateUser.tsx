import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Role } from '../../lib/types';
import { store } from '../../store';
import { ControlledTextField } from '../form/ControlledTextField';

interface IProps {
  onSubmit: () => void;
}

export const CreateUser: React.FC<IProps> = ({ onSubmit }) => {
  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: zodResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * Handle the form submission
   * @param values
   */
  async function handleSubmitForm(values: Schema) {
    const user = { ...values, roles: [Role.ADMIN, Role.USER] };
    await store.setup.createUser(user);
    onSubmit();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField size="small" name="name" label="Name" sx={{ m: 1 }} />
          <ControlledTextField size="small" name="email" label="Email" sx={{ m: 1 }} />
          <ControlledTextField size="small" name="password" label="Password" type="password" sx={{ m: 1 }} />
        </Box>

        <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2 }}>
          Continue
        </LoadingButton>
      </form>
    </FormProvider>
  );
};