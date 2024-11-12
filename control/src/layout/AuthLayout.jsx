import React, {Suspense} from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Loading from "@/components/Loading";
const AuthLayout = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Toaster />
        {<Outlet />}
      </Suspense>
    </>
  );
};

export default AuthLayout;
