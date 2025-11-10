// src/AppContent.jsx
import { useEffect, useState } from "react";
import Background from "./components/Background/Background";
import Loader from "./components/Loader/Loader";
import BurgerMenu from "./components/BurgerMenu/BurgerMenu";
import Header from "./components/Header/Header";
import AppRouter from "./router/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, SESSION_FLAG_KEY } from "./redux/auth/auth-operations";
import { getModalStatus } from "./redux/auth/auth-selector";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const AppContent = () => {
  const isLoadingUI = useSelector((state) => state.ui.isLoading);
  const showModal = useSelector(getModalStatus);
  const dispatch = useDispatch();

  const [menuActive, setMenuActive] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const toggleNavMenu = () => setMenuActive((prev) => !prev);

  // Scroll lock pentru modale
  useEffect(() => {
    const body = document.querySelector("#root");
    if (!body) return;

    if (showModal) {
      disableBodyScroll(body);
    } else {
      enableBodyScroll(body);
    }

    return () => {
      enableBodyScroll(body);
    };
  }, [showModal]);

  // ✅ Check auth doar dacă avem flag salvat după un login anterior
  useEffect(() => {
    let hasSession = false;
    try {
      hasSession = window.localStorage.getItem(SESSION_FLAG_KEY) === "1";
    } catch (_) {
      hasSession = false;
    }

    if (!hasSession) {
      // guest clar -> nu mai lovim /current => zero 401 la prima deschidere
      setAuthChecked(true);
      return;
    }

    // există flag -> merită să verificăm cu backend-ul
    dispatch(getCurrentUser()).finally(() => {
      setAuthChecked(true);
    });
  }, [dispatch]);

  return (
    <Background>
      {(isLoadingUI || !authChecked) && <Loader />}
      <Header menuActive={menuActive} setMenuActive={setMenuActive} />
      {menuActive && <BurgerMenu toggleNavMenu={toggleNavMenu} />}
      <AppRouter />
    </Background>
  );
};

export default AppContent;
