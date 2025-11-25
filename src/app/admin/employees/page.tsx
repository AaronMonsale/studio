import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listUsers, createUser } from "@/lib/admin-actions";
import { UserRole } from "@prisma/client";

export default async function EmployeesPage() {
    const users = await listUsers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Employee Management</h1>
                    <p className="text-muted-foreground">Manage employee accounts and staff profiles.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add Employee</CardTitle>
                    <CardDescription>Create a new user account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createUser} className="grid gap-4 max-w-xl">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="john@company.com" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="••••••" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <select id="role" name="role" className="col-span-3 border rounded-md h-9 px-3">
                                <option value="STAFF">Staff</option>
                                <option value="KITCHEN">Kitchen</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Create Profile</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>A list of all users in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.name || '—'}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {u.role === UserRole.ADMIN ? 'Admin' : u.role === UserRole.KITCHEN ? 'Kitchen' : 'Staff'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
