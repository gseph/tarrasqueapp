import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { NextLink } from '../../components/common/NextLink';
import { ControlledPasswordField } from '../../components/form/ControlledPasswordField';
import { ControlledTextField } from '../../components/form/ControlledTextField';
import { useResendEmailVerification } from '../../hooks/data/auth/useResendEmailVerification';
import { useSignIn } from '../../hooks/data/auth/useSignIn';
import { getSetup } from '../../hooks/data/setup/useGetSetup';
import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';
import { ValidateUtils } from '../../utils/ValidateUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { props: {}, redirect: { destination: AppNavigation.Setup } };

  const ssr = new SSRUtils(context);

  // Get the user
  const user = await ssr.getUser();

  // Redirect to the dashboard page if the user is signed in
  if (user) {
    return { props: {}, redirect: { destination: AppNavigation.Dashboard } };
  }

  return { props: { dehydratedState: ssr.dehydrate() } };
};

export default function SignInPage() {
  const signIn = useSignIn();
  const resendEmailVerification = useResendEmailVerification();

  const router = useRouter();

  // Setup form validation schema
  const schema = yup
    .object({
      email: ValidateUtils.Email,
      password: ValidateUtils.Password,
    })
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: yupResolver(schema) });
  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * Handle the form submission
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    try {
      await signIn.mutateAsync(values);
      router.push(AppNavigation.Dashboard);
    } catch (error: any) {
      if (error.message === 'Email not verified') {
        toast.error(
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>{error.message}</Box>

            <Button
              onClick={() => {
                toast.remove();
                toast.promise(resendEmailVerification.mutateAsync(values.email), {
                  loading: 'Resending email',
                  success: 'Email sent, please check your inbox',
                  error: 'Error',
                });
              }}
              size="small"
              color="secondary"
              variant="contained"
            >
              Resend
            </Button>
          </Box>,
        );
      } else {
        toast.error(error.message);
      }
    }
  }

  const email = watch('email');
  const forgotPasswordSuffix = email ? `?email=${email}` : '';

  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Typography variant="h3" align="center" sx={{ mt: 1, mb: 3 }}>
            Sign in
          </Typography>

          <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleSubmitForm)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
                  <ControlledTextField name="email" label="Email" autoFocus />

                  <ControlledPasswordField name="password" label="Password" />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
                    Submit
                  </LoadingButton>
                </Box>
              </form>
            </FormProvider>
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Don&apos;t have an account? <NextLink href={AppNavigation.SignUp}>Sign up</NextLink>
          </Typography>

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            <NextLink href={`${AppNavigation.ForgotPassword}${forgotPasswordSuffix}`}>Forgot your password?</NextLink>
          </Typography>
        </Box>
      </Container>
    </Center>
  );
}
