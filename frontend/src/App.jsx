import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './components/Home'
import Login, { action as loginAction } from './components/forms/Login'
import Header from './components/header/Header'
import Registration, { action as registerAction } from './components/forms/Registration'
import checkTokenExists, { tokenLoader } from './components/util/Auth'
import { action as logoutAction } from './components/forms/logout';
import UserProfile, { loader as profileLoader, action as profileAction } from './components/forms/UserProfile'
import ErrorPage from './components/ErrorPage'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      id: 'root',
      loader: tokenLoader,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          path: "login",
          element: <Login />,
          action: loginAction
        },
        {
          path: "register",
          element: <Registration />,
          action: registerAction
        },
        {
          path: "home",
          element: <Home />,
          loader: checkTokenExists
        },
        {
          path: "user/profile",
          element: <UserProfile />,
          loader: profileLoader,
          action: profileAction
        },
        {
          path: "logout",
          action: logoutAction,
          loader: checkTokenExists
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
