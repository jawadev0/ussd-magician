import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Edit, Clock, CheckCircle, XCircle } from "lucide-react";
import { USSDCode, USSDResult } from "@/types/ussd";
import { useToast } from "@/hooks/use-toast";

interface USSDCardProps {
  ussdCode: USSDCode;
  onEdit: (ussdCode: USSDCode) => void;
  onDelete: (id: string) => void;
  onExecute: (code: string) => Promise<{ success: boolean; result?: string; error?: string }>;
}

const USSDCard = ({ ussdCode, onEdit, onDelete, onExecute }: USSDCardProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<USSDResult | null>(null);
  const { toast } = useToast();

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const response = await onExecute(ussdCode.code);
      const result: USSDResult = {
        id: Date.now().toString(),
        ussd_code_id: ussdCode.id,
        result: response.result || '',
        status: response.success ? 'success' : 'error',
        executed_at: new Date(),
        error_message: response.error,
      };
      setLastResult(result);
      
      toast({
        title: response.success ? "USSD Executed" : "Execution Failed",
        description: response.success ? "Code executed successfully" : response.error,
        variant: response.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Execution Error",
        description: "Failed to execute USSD code",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = () => {
    if (!lastResult) return <Clock className="h-4 w-4" />;
    if (lastResult.status === 'success') return <CheckCircle className="h-4 w-4 text-success" />;
    if (lastResult.status === 'error') return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4" />;
  };

  const getStatusColor = () => {
    if (!lastResult) return "secondary";
    return lastResult.status === 'success' ? "default" : "destructive";
  };

  return (
    <Card className="w-full hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {ussdCode.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {ussdCode.code}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {ussdCode.category && (
              <Badge variant="secondary" className="text-xs">
                {ussdCode.category}
              </Badge>
            )}
            <div className="flex items-center">
              {getStatusIcon()}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {ussdCode.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {ussdCode.description}
          </p>
        )}
        
        {lastResult && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Result:</span>
              <Badge variant={getStatusColor() as any} className="text-xs">
                {lastResult.status}
              </Badge>
            </div>
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm font-mono text-muted-foreground break-words">
                {lastResult.result || lastResult.error_message || "No result"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Executed: {lastResult.executed_at.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 gap-2">
        <Button
          onClick={handleExecute}
          disabled={isExecuting}
          className="flex-1"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          {isExecuting ? "Executing..." : "Execute"}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(ussdCode)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(ussdCode.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default USSDCard;