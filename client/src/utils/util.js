export function arrangeConfetti(makeShot) {
  makeShot(0.25, { spread: 26, startVelocity: 55 });
  makeShot(0.2, { spread: 60 });
  makeShot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  makeShot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  makeShot(0.1, { spread: 120, startVelocity: 45 });
}

export function logout() {
  window.location = `${window.location.origin}/api/auth/logout`;
}

export function redirectToLogin() {
  const query = new URLSearchParams({ return_url: encodeURI(window.location.href) }).toString();
  window.location = `${window.location.origin}/api/auth/login?${query}`;
}
