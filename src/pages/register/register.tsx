import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  registerUser,
  selectUserError,
  selectUserIsRequested
} from '../../slices/userSlice';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
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
      registerUser({
        name: userName,
        email,
        password
      })
    );
  };

  return (
    <RegisterUI
      errorText={error || undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
