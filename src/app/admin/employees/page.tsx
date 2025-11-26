import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EmployeesForm } from "@/components/admin/employees-form";
import { Label } from "@/components/ui/label";
import { listUsers, createUser } from "@/lib/admin-actions";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
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
                    <CardDescription>Create a new Staff (name + PIN) or Kitchen (name + password) account. Email is optional.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EmployeesForm />
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
                                <TableHead className="text-right">Actions</TableHead>
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
                                    <TableCell className="text-right">
                                        <DeleteUserButton userId={u.id} />
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
