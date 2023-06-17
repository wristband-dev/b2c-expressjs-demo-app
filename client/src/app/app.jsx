import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

import { FullScreenSpinner, Navbar, NewAccountDialog } from 'components';
import { useAuthState } from 'context';
import { sessionHooks } from 'hooks';
import { CardsPage, HomePage, ReferralsPage, SettingsPage } from 'pages';

// This demo app does not have any unprotected routes or pages.  If your app needed
// that functionality, then this is where you would add the unprotected routes.
function UnauthenticatedApp() {
  return <FullScreenSpinner />;
}

function AuthenticatedApp() {
  const { data: paymentCard } = sessionHooks.useSessionPaymentCard();

  return (
    <>
      <Navbar />
      <NewAccountDialog open={!paymentCard} />
      {paymentCard ? (
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate replace to="/home" />} />
        </Routes>
      ) : (
        <FullScreenSpinner />
      )}
    </>
  );
}

export function App() {
  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  const { isAuthenticated } = useAuthState();
  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}
