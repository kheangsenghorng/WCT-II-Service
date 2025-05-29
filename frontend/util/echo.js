export const getEcho = async () => {
  if (typeof window === "undefined") return null;

  const { default: Echo } = await import("laravel-echo");
  const Pusher = (await import("pusher-js")).default;

  window.Pusher = Pusher;

  return new Echo({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    encrypted: true,
  });
};
