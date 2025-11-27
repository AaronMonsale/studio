"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function WelcomeToast({ name }: { name: string }) {
  const { toast } = useToast();

  useEffect(() => {
    if (name) {
      toast({ title: `Welcome ${name}` });
    }
  }, [name, toast]);

  return null;
}
