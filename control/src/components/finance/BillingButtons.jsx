import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button';
import SelectCurrency from '@/components/ui/Select'

function FinanceButtons() {
  const navigate = useNavigate();
  
  return (
    <div className="flex space-x-2 sm:justify-end items-center rtl:space-x-reverse">
      {/* ... your buttons ... */}
      <SelectCurrency
        label="Moneda"
        placeholder="Seleccionar moneda"
        options={[
          { value: 'USD', label: 'USD' },
          { value: 'VES', label: 'VES' },
        ]}
      />
      <Button
        className="mt-6 text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"
        onClick={() => navigate('/create-invoice')}
      >
        Crear Facturación
      </Button>
    </div>
  );
}

export default FinanceButtons;