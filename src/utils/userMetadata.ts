import { useUser } from '@clerk/clerk-react';

interface UserMetadata {
  hasCompletedOnboarding?: boolean;
}

export const useUserMetadata = () => {
  const { user } = useUser();

  const markOnboardingComplete = async () => {
    if (!user) return;
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          hasCompletedOnboarding: true
        }
      });
    } catch (error) {
      console.error('Failed to update user metadata:', error);
    }
  };

  const hasCompletedOnboarding = () => {
    if (!user) return false;
    return (user.unsafeMetadata as UserMetadata)?.hasCompletedOnboarding === true;
  };

  return {
    markOnboardingComplete,
    hasCompletedOnboarding
  };
}; 