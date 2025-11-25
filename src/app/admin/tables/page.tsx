import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table as TableIcon } from "lucide-react";
import { listTables, createTable, bulkCreateTables } from "@/lib/admin-actions";

export default async function TablesPage() {
    const tables = await listTables();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Table Management</h1>
                    <p className="text-muted-foreground">Manage the tables available in your establishment.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add Tables</CardTitle>
                    <CardDescription>Create a single table or multiple tables at once.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="single" className="w-full pt-2">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="single">Single Table</TabsTrigger>
                            <TabsTrigger value="bulk">Bulk Create</TabsTrigger>
                        </TabsList>
                        <TabsContent value="single">
                            <form action={createTable} className="grid gap-4 py-4 max-w-xl">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="label" className="text-right">Table Label</Label>
                                    <Input id="label" name="label" placeholder="e.g., Table 10 or Patio 2" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="capacity" className="text-right">Capacity</Label>
                                    <Input id="capacity" name="capacity" type="number" min="1" defaultValue="1" className="col-span-3" />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Create Table</Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="bulk">
                            <form action={bulkCreateTables} className="grid gap-4 py-4 max-w-xl">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="prefix" className="text-right">Prefix</Label>
                                    <Input id="prefix" name="prefix" placeholder="e.g., Table" defaultValue="Table" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="number" className="text-right">Number</Label>
                                    <Input id="number" name="number" type="number" placeholder="e.g., 10" className="col-span-3" />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Create Tables</Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Tables</CardTitle>
                    <CardDescription>A list of all tables currently in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {tables.map(table => (
                            <div key={table.id} className="flex flex-col items-center justify-center p-4 border rounded-lg aspect-square">
                                <TableIcon className="h-8 w-8 text-muted-foreground" />
                                <p className="mt-2 text-center font-medium">{table.label}</p>
                                <p className="text-xs text-muted-foreground">Cap. {table.capacity} • {table.status.toLowerCase()}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
