import { useContext } from 'react';
import { AskMeContext } from '../context/AskMeContext';

export const useAskMe = () => {
  const ctx = useContext(AskMeContext);
  if (!ctx) {
    throw new Error('useAskMe must be used within AskMeProvider');
  }
  return ctx;
};
