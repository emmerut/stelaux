import React from "react";
import { Helmet } from "react-helmet";
import CrmApp from "../CrmApp"; 


const BaseLayout = () => (
  
  <>
    <Helmet>
      <title>Stela Control Dynamic All in One.</title>
      <meta name="description" content="Stela Control Dynamic es un CRM todo en uno fácil de usar, diseñado para startups, con gestión de pedidos, suscripciones, contenido, publicaciones de blog y más, potenciado con IA." />
      <meta name="keywords" content="CRM, startups, gestión de pedidos, suscripciones, marketing de contenido, publicaciones de blog, mensajería inteligente, tecnología IA" />
      <link rel="icon" href="https://stelacdn.s3.amazonaws.com/static/img/favicon.png"/>
    </Helmet>
    <CrmApp />
  </>
);

export default BaseLayout;