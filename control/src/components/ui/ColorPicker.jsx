// control/src/components/ui/ColorPicker.jsx

"use client";

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import Input from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import EyeDropperIcon from 'lucide-react';

function ColorPicker({ initialColor = "#000000", onChange }) {
  const [color, setColor] = useState(initialColor);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  const handleInputChange = (e) => {
    const newColor = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      handleColorChange(newColor);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        value={color}
        onChange={handleInputChange}
        className="w-28"
        aria-label="Color hexadecimal"
      />
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ backgroundColor: color }}
            aria-label="Abrir selector de color"
          >
            <EyeDropperIcon className="w-6 h-6 text-white mix-blend-difference m-auto" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 border-none">
          <HexColorPicker color={color} onChange={handleColorChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ColorPicker;
