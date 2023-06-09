import toast from 'react-hot-toast';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const reportErrorMessage = (error: unknown, id: string) => {
  const message = getErrorMessage(error);
  console.error(message);
  toast.error(message, { id });
};
