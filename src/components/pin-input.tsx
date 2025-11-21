'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Delete } from 'lucide-react';

export function PinInput() {
  const [pin, setPin] = useState('');
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };
  
  useEffect(() => {
    if (pin.length === 4) {
      // Automatically submit the form
      const form = formRef.current;
      if (form) {
        // We need to find the parent form of the button that was clicked to open the pin input
        const parentForm = form.closest('form');
        if (parentForm) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            parentForm.dispatchEvent(submitEvent);
        }
      }
    }
  }, [pin]);

  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'Clear', '0', 'Backspace'
  ];

  return (
    <div className="flex flex-col items-center" ref={formRef}>
      <Input
        type="hidden"
        name="pin"
        value={pin}
      />
      <div className="flex space-x-2 mb-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-12 w-12 rounded-md border flex items-center justify-center text-2xl font-bold ${
              pin.length > index ? 'bg-primary/20 border-primary' : 'bg-secondary'
            }`}
          >
            {pin.length > index ? '●' : ''}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {buttons.map((btn) => {
          if (btn === 'Clear') {
            return <Button key={btn} type="button" variant="outline" size="lg" className="text-sm" onClick={handleClear} disabled={pending}>Clear</Button>;
          }
          if (btn === 'Backspace') {
            return <Button key={btn} type="button" variant="outline" size="lg" onClick={handleBackspace} disabled={pending}><Delete /></Button>;
          }
          return <Button key={btn} type="button" variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick(btn)} disabled={pending}>{btn}</Button>;
        })}
      </div>
    </div>
  );
}
