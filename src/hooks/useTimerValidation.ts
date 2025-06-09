
export const useTimerValidation = () => {
  const isValidUUID = (id: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  };

  const validateMatchId = (matchId: string): boolean => {
    if (!isValidUUID(matchId)) {
      console.warn('Invalid UUID format for match timer:', matchId);
      return false;
    }
    return true;
  };

  return {
    isValidUUID,
    validateMatchId
  };
};
