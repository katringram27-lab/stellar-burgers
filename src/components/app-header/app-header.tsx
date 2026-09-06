import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { TAppHeaderUIProps } from '../ui/app-header/type';

export const AppHeader: FC<TAppHeaderUIProps> = ({ userName }) => (
  <AppHeaderUI userName={userName} />
);
