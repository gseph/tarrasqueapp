import { Box, CircularProgress, Container } from '@mui/material';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';

import { Center } from '../components/common/Center';
import { CampaignAccordions } from '../components/dashboard/CampaignAccordions';
import { DashboardModals } from '../components/dashboard/DashboardModals';
import { TopBar } from '../components/dashboard/TopBar/TopBar';
import { useGetUser } from '../hooks/data/auth/useGetUser';
import { getSetup } from '../hooks/data/setup/useGetSetup';
import { Gradient } from '../lib/colors';
import { AppNavigation } from '../lib/navigation';
import { SSRUtils } from '../utils/SSRUtils';

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

  // Redirect to the sign-in page if the user is not signed in
  if (!user) {
    return { props: {}, redirect: { destination: AppNavigation.SignIn } };
  }

  return { props: { dehydratedState: ssr.dehydrate() } };
};

export default function DashboardPage() {
  const { isLoading } = useGetUser();

  if (isLoading) {
    return (
      <Center>
        <CircularProgress disableShrink />
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard · Tarrasque App</title>
      </Head>

      <Box
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', background: Gradient.Linear }}
      >
        <TopBar />

        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            flex: '1 0 auto',
            transition: 'padding 0.3s ease',
            p: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <CampaignAccordions />
        </Container>
      </Box>

      <DashboardModals />
    </>
  );
}
