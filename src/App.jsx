import React, { useEffect, useState } from "react";
import layoutMapping from "./LayoutMapping";

function App() {
  const [Layout, setLayout] = useState(null);
  
  useEffect(() => {
    const host = window.location.host;
    const subdomain = host.split('.')[0];
    const layout = layoutMapping[subdomain] || layoutMapping[""];
    
    setLayout(() => layout);
  }, []);

  return Layout ? <Layout /> : null;
}

export default App;