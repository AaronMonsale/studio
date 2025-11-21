import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export default function StaffPage() {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Staff POS Interface</CardTitle>
                    <CardDescription>This is where the main point of sale terminal would be.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                        <Terminal className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-4 text-center text-muted-foreground">POS Terminal Under Construction</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
