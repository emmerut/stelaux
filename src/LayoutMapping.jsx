import BaseLayout from "./homepage/layouts/BaseLayout";
import CrmBaseLayout from "./stelaux/layouts/BaseLayout";

const layoutMapping = {
  "": BaseLayout,
  "stela": CrmBaseLayout,
};

export default layoutMapping;