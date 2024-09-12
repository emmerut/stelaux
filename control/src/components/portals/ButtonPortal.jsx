import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

function PortalButtons() {
  const navigate = useNavigate();

  const redirect = () => {
    navigate('/portals/new');
  };

  return (
    <div>
      <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
        <Button
          className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 smc:px-4 smc:py-2 smc:text-xs"
          onClick={redirect}
        >
          Nuevo Portal
        </Button>
      </div>
    </div>
  );
}

export default PortalButtons;
