import React, { useEffect, useState } from "react";
import loadingSrc from "../../assets/loading3.gif";

function Loader() {
  const [renderLoader, setRenderLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRenderLoader(true);
    }, 50);
    return setRenderLoader(false);
  }, []);

  if (!renderLoader) return null;

  return (
    <div style={{ marginTop: "15%" }}>
      <img src={loadingSrc} alt="Loading" style={{ maxWidth: "100%" }} />
    </div>
  );
}

export default Loader;
