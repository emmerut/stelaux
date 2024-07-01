import React from "react";
import Image2 from "@/assets/images/all-img/widget-bg-2.png";
import { SkeletionTitle } from "@/components/skeleton/Skeleton";

const ImageBlock2 = ({ name }) => {
  return (
    <div
      className="bg-no-repeat bg-cover bg-center p-5 rounded-[6px] relative"
      style={{
        backgroundImage: `url(${Image2})`,
      }}
    >
      <div>
        <h4 className="text-xl font-medium text-white mb-2">
          <span className="block font-normal">Hola,</span>
          <span className="block">{name ? name : <SkeletionTitle className="w-28" />}</span>
        </h4>
        <p className="text-sm text-white font-normal">
          Bienvenid@ a StelaUX Control
        </p>
      </div>
    </div>
  );
};

export default ImageBlock2;
