import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-lg font-bold text-primary", className)}>
      <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
        <Zap className="h-5 w-5" />
      </div>
      <span className="font-headline">SwiftPOS</span>
    </div>
  );
}
