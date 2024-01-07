/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SkeletonTheme } from 'react-loading-skeleton';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import fa from './translations/fa/common.json';
import en from './translations/en/common.json';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/themes/light-border.css';
import "react-loading-skeleton/dist/skeleton.css";
import 'react-toastify/dist/ReactToastify.css';
import ReminderBar from './components/reminderBar';
import Body from './layouts/Body';

function App() {
  const { reminder, lang } = useSelector((state) => state.auth);

  i18n
    .use(initReactI18next)
    .init({
      fallbackLng: 'fa',
      interpolation: {
        escapeValue: false
      },
      resources: {
        fa: {
          translation: fa
        },
        en: {
          translation: en
        }
      }
    });
  i18n.changeLanguage(lang)

  const instances = tippy('[data-tippy-content]', {
    animation: "scale",
    touch: ['hold', 500],
    duration: [150, 0],
    theme: localStorage.getItem('darkMode') === "enabled" ? 'light-border' : "sijam"
  });
  instances.forEach(instance => {
    if (!instance.props.content) instance.disable();
  });

  const setDocHeight = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
  };

  useEffect(() => {
    setDocHeight();
    window.addEventListener('resize', setDocHeight)
    window.addEventListener('orientationchange', setDocHeight)
    return () => {
      window.removeEventListener('resize', setDocHeight)
      window.removeEventListener('orientationchange', setDocHeight)
    }
  }, []);

  return (
    <SkeletonTheme
      direction="rtl"
    >
      <I18nextProvider i18n={i18n}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored"
          closeButton={null}
          toastStyle={{
            fontFamily: "IRANSans",
            fontSize: "0.8rem",
            borderRadius: 12,
            margin: "1rem 0.5rem"
          }}
        />
        {reminder.show &&
          <ReminderBar
            onClose={reminder.close}
            color={reminder.color}
          >
            {reminder.children}
          </ReminderBar>
        }
        <Body />
      </I18nextProvider>
    </SkeletonTheme>
  );
}

export default App;
