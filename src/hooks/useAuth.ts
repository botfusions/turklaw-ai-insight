import { useAuthData } from '@/contexts/AuthDataContext';
import { useAuthActions } from '@/contexts/AuthActionsContext';
import { AuthContextType } from '@/types/auth';

export const useAuth = (): AuthContextType => {
  const authData = useAuthData();
  const authActions = useAuthActions();

  return {
    ...authData,
    ...authActions
  };
};