'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUser } from '@/lib/admin-actions';

export function EmployeesForm() {
  const [role, setRole] = useState<'STAFF' | 'KITCHEN'>('STAFF');

  return (
    <form action={createUser} className="grid gap-4 max-w-xl">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">Account Type</Label>
        <select id="role" name="role" className="col-span-3 border rounded-md h-9 px-3" value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="STAFF">Staff</option>
          <option value="KITCHEN">Kitchen</option>
        </select>
      </div>

      {role === 'STAFF' && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" placeholder="e.g., Jane Doe" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pin" className="text-right">PIN</Label>
            <Input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              placeholder="4-digit PIN"
              className="col-span-3"
              required
              minLength={4}
              maxLength={4}
              pattern="[0-9]{4}"
              title="PIN must be exactly 4 digits"
            />
          </div>
        </>
      )}

      {role === 'KITCHEN' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">Password</Label>
          <Input id="password" name="password" type="password" placeholder="Set a password" className="col-span-3" required />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit">Create Profile</Button>
      </div>
    </form>
  );
}
