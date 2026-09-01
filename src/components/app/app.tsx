import {
  ConstructorPage,
  Login,
  Register,
  Profile,
  ProfileOrders,
  ForgotPassword,
  ResetPassword,
  Feed,
  NotFound404
} from '@pages';
import styles from './app.module.css';
import {
  Navigate,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import { Preloader } from '@ui';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsIsLoading,
  selectIngredientsError,
  fetchIngredients
} from '../../slices/ingredientsSlice';
import {
  selectUser,
  selectUserIsRequested,
  selectIsSuccessRegistrarion,
  selectUserError,
  getUser,
  setAuthChecked
} from '../../slices/userSlice';
import { useEffect } from 'react';
import { ProtectedRoute } from '../protectedRoute';
import { getCookie } from '../../utils/cookie';

const App = () => {
  /** TODO: взять переменные из стора */
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients = useAppSelector(selectIngredients);
  const isIngredientsLoading = useAppSelector(selectIngredientsIsLoading);
  const isSuccessRegistrarion = useAppSelector(selectIsSuccessRegistrarion);
  const ingredientsLoadingError = useAppSelector(selectIngredientsError);
  const user = useAppSelector(selectUser);
  const userName = user?.name;
  const userIsRequested = useAppSelector(selectUserIsRequested);
  const userError = useAppSelector(selectUserError);
  const background = location.state?.background;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked());
    }
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader userName={userName} />
      <>
        <Routes location={background ?? location}>
          <Route
            path='/'
            element={
              <>
                {isIngredientsLoading || userIsRequested ? (
                  <Preloader />
                ) : ingredientsLoadingError ? (
                  <div
                    className={`${styles.error} text text_type_main-medium pt-4`}
                  >
                    {ingredientsLoadingError}
                  </div>
                ) : ingredients.length > 0 ? (
                  <ConstructorPage />
                ) : (
                  <div
                    className={`${styles.title} text text_type_main-medium pt-4`}
                  >
                    Нет ингредиентов
                  </div>
                )}
              </>
            }
          />
          <Route path={'/ingredients/:id'} element={<IngredientDetails />} />
          <Route path={'/feed'} element={<Feed />} />
          <Route path={'/feed/:number'} element={<OrderInfo />} />

          <Route
            path={'/login'}
            element={
              <>
                {isSuccessRegistrarion && (
                  <div
                    className={`${styles.title} text text_type_main-medium pt-4`}
                  >
                    Вы успешно зарегистрировались! Выполните вход.
                  </div>
                )}
                {userIsRequested ? (
                  <Preloader />
                ) : userError ? (
                  <>
                    <div
                      className={`${styles.error} text text_type_main-medium pt-4`}
                    >
                      {userError}
                    </div>
                    <Login />
                  </>
                ) : (
                  <ProtectedRoute onlyUnAuth>
                    <Login />
                  </ProtectedRoute>
                )}
              </>
            }
          />
          <Route
            path={'/register'}
            element={
              <>
                {userIsRequested ? (
                  <Preloader />
                ) : userError ? (
                  <>
                    <div
                      className={`${styles.error} text text_type_main-medium pt-4`}
                    >
                      {userError}
                    </div>
                    <Register />
                  </>
                ) : isSuccessRegistrarion ? (
                  <Navigate to='/login' replace />
                ) : (
                  <ProtectedRoute onlyUnAuth>
                    <Register />
                  </ProtectedRoute>
                )}
              </>
            }
          />
          <Route
            path={'/forgot-password'}
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/reset-password'}
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/profile'}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/profile/orders'}
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/profile/orders/:id'}
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
          <Route path={'*'} element={<NotFound404 />} />
        </Routes>
        {background && (
          <Routes>
            <Route
              path={'/feed/:number'}
              element={
                <Modal title={'Детали заказа'} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path={'/ingredients/:id'}
              element={
                <Modal
                  title={'Детали ингредиента'}
                  onClose={() => navigate(-1)}
                >
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path={'/profile/orders/:id'}
              element={
                <Modal title={'Детали заказа'} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}
      </>
    </div>
  );
};

export default App;
