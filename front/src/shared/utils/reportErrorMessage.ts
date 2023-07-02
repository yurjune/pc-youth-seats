import toast from 'react-hot-toast';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export const reportErrorMessage = (error: unknown) => {
  const message = getErrorMessage(error);
  console.error(error);
  toast.error(message, { id: message });
};
