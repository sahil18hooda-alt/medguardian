"use client";

import { useMemo, useState } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export type TranscriptionEntry = {
  date: string;
  text: string;
};

type TranscriptionHistoryProps = {
  history: TranscriptionEntry[];
  onCopy: (text: string) => void;
};

export function TranscriptionHistory({ history, onCopy }: TranscriptionHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const groupedHistory = useMemo(() => {
    if (!history || history.length === 0) return [];

    const groups: { date: Date; entries: TranscriptionEntry[] }[] = [];

    history.forEach((entry) => {
      const entryDate = parseISO(entry.date);
      const existingGroup = groups.find((group) => isSameDay(group.date, entryDate));

      if (existingGroup) {
        existingGroup.entries.push(entry);
      } else {
        groups.push({ date: entryDate, entries: [entry] });
      }
    });

    return groups;
  }, [history]);

  const handleCopy = (entry: TranscriptionEntry) => {
    const uniqueId = `${entry.date}-${entry.text.slice(0, 10)}`;
    onCopy(entry.text);
    setCopiedId(uniqueId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (groupedHistory.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-headline">Transcription History</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {groupedHistory.map((group, groupIndex) => (
            <AccordionItem key={group.date.toISOString()} value={`item-${groupIndex}`}>
                <AccordionTrigger>
                    <h3 className="text-lg font-semibold">
                        {format(group.date, "MMMM d, yyyy")}
                    </h3>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
                    {group.entries.map((entry) => {
                        const uniqueId = `${entry.date}-${entry.text.slice(0, 10)}`;
                        return (
                        <div key={uniqueId} className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <p className="text-sm text-muted-foreground">
                            {format(parseISO(entry.date), "p")}
                            </p>
                            <div className="flex items-start gap-4">
                            <p className="flex-1 whitespace-pre-wrap">{entry.text}</p>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopy(entry)}
                            >
                                {copiedId === uniqueId ? (
                                <ClipboardCheck className="h-5 w-5 text-green-500" />
                                ) : (
                                <Clipboard className="h-5 w-5" />
                                )}
                            </Button>
                            </div>
                        </div>
                        );
                    })}
                    </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
