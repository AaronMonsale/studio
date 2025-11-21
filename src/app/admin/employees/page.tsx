import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { employeeAccounts } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Users, PlusCircle } from "lucide-react";


export default function EmployeesPage() {
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-2');

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Employee Management</h1>
                    <p className="text-muted-foreground">Manage employee accounts and staff profiles.</p>
                </div>
                <Button><PlusCircle className="mr-2 h-4 w-4" />Add Employee</Button>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
                {employeeAccounts.map(account => (
                    <AccordionItem value={account.id} key={account.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-secondary rounded-md">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="font-medium">{account.accountName}</div>
                                    <div className="text-sm text-muted-foreground">{account.staff.length} staff members</div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <Card className="ml-16 border-l-4">
                                <CardContent className="pt-6">
                                     <ul className="space-y-4">
                                        {account.staff.map(staff => (
                                            <li key={staff.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={userAvatar?.imageUrl} data-ai-hint={userAvatar?.imageHint} />
                                                        <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{staff.name}</p>
                                                        <p className="text-sm text-muted-foreground">PIN: ****</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">Staff</Badge>
                                            </li>
                                        ))}
                                     </ul>
                                </CardContent>
                           </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
