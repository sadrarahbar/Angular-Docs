const deploymentUrl = process.env.PWA_DEPLOYMENT_URL;
const secret = process.env.PUSH_NOTIFY_SECRET;

const notify = async () => {
  if (!deploymentUrl || !secret) {
    throw new Error('PWA_DEPLOYMENT_URL and PUSH_NOTIFY_SECRET are required.');
  }

  const endpoint = new URL('/api/push/notify-content-update', deploymentUrl);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });

  const result: unknown = await response.json();

  if (!response.ok) {
    throw new Error(`Content notification failed (${response.status}): ${JSON.stringify(result)}`);
  }

  console.log(JSON.stringify(result, null, 2));
};

notify().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
