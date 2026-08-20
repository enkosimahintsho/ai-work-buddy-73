import { useState } from "react";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AiDisclaimer } from "@/components/app-shell";

export function AiOutputCard({
  title,
  text,
  loading,
  error,
  emptyHint,
}: {
  title: string;
  text: string | null;
  loading: boolean;
  error: string | null;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {text && !loading && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Generating a professional draft…
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : text ? (
          <>
            <div className="ai-output text-card-foreground">{text}</div>
            <AiDisclaimer className="mt-6 border-t border-border pt-3" />
          </>
        ) : (
          <div className="flex flex-col items-start gap-2 py-6 text-sm text-muted-foreground">
            <Sparkles className="size-5 text-primary" />
            {emptyHint}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
