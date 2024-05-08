import React from "react";
import { Helmet } from "react-helmet";
import HomeApp from "../routes/business/HomeApp"; 


const BaseLayout = () => (
  <>
    <Helmet>
      <title>Emiro Duque Sanchez | El gran trovador del paisaje Venezolano.</title>
      <meta name="description" content="Déjate seducir por la poesía exquisita y evocadora de Emiro Duque Sanchez El gran trovador del paisaje Venezolano. Sus versos te transportarán a paisajes emocionales, despertando tus sentidos y tocando las fibras más profundas de tu ser." />
      <meta name="keywords" content="poesía, libros, cultura" />
      <link rel="icon" href="https://emirostatic.s3.amazonaws.com/static/img/favicon.png"/>
    </Helmet>
    <HomeApp />
  </>
);

export default BaseLayout;