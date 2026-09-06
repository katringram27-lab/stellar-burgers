import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  loginUser,
  selectUserError,
  selectUserIsRequested
} from '../../slices/userSlice';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useAppSelector(selectUserError);
  const isRequested = useAppSelector(selectUserIsRequested);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isRequested) {
      return;
    }
    dispatch(
      loginUser({
        email,
        password
      })
    );
  };

  return (
    <LoginUI
      errorText={error || undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
