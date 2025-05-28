const handlePageTransition = async (callback) => {
  if (!document.startViewTransition) {
    return callback();
  }

  const transition = document.startViewTransition(callback);

  try {
    await transition.finished;
  } catch (error) {
    console.error('Error during page transition:', error);
  }
};

export default handlePageTransition;
