import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App'

// Libraries
import { ParallaxProvider } from "react-scroll-parallax";
import { LazyMotion, domMax } from "framer-motion";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "@/assets/scss/app.scss";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "@/store";
import "react-toastify/dist/ReactToastify.css";
import "@/server";



const subdomain = window.location.hostname.split('.')[0]
const root = ReactDOM.createRoot(document.getElementById('root'));

if (subdomain === 'stela') {
  console.log('subdomain')
  root.render(
    <>
      <BrowserRouter>
        <Provider store={store}>
          <App /> 
        </Provider>
      </BrowserRouter>
    </>
  );
} else {
  root.render(
    <LazyMotion features={domMax}>
      <ParallaxProvider>
        <BrowserRouter>
          <App /> 
        </BrowserRouter>
      </ParallaxProvider>
    </LazyMotion>
  );
}