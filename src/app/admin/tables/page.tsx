'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Table as TableIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Table = {
    id: string;
    name: string;
};

const initialTables: Table[] = [
    { id: 't1', name: 'Table 1' },
    { id: 't2', name: 'Table 2' },
    { id: 't3', name: 'Terrace 1' },
];

export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>(initialTables);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Table Management</h1>
                    <p className="text-muted-foreground">Manage the tables available in your establishment.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" />Add Table</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Tables</DialogTitle>
                            <DialogDescription>
                                Create a single table or multiple tables at once.
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="single" className="w-full pt-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="single">Single Table</TabsTrigger>
                                <TabsTrigger value="bulk">Bulk Create</TabsTrigger>
                            </TabsList>
                            <TabsContent value="single">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Table Name
                                        </Label>
                                        <Input id="name" placeholder="e.g., Table 10 or Patio 2" className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={() => setIsDialogOpen(false)}>Create Table</Button>
                                </DialogFooter>
                            </TabsContent>
                            <TabsContent value="bulk">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="prefix" className="text-right">
                                            Prefix
                                        </Label>
                                        <Input id="prefix" placeholder="e.g., Table" defaultValue="Table" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="number" className="text-right">
                                            Number
                                        </Label>
                                        <Input id="number" type="number" placeholder="e.g., 10" className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={() => setIsDialogOpen(false)}>Create Tables</Button>
                                </DialogFooter>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>

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
                                <p className="mt-2 text-center font-medium">{table.name}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
