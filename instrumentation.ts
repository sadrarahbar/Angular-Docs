export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const { notifyIfContentChanged } = await import('./app/pwa/pushNotifications');

  try {
    await notifyIfContentChanged();
  } catch (error) {
    console.error('Unable to check PWA content notifications during startup.', error);
  }
}
