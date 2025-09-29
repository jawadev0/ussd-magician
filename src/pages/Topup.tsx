import { useState } from "react";
import { Edit, Trash2, Search, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ussdService } from "@/services/ussdService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Topup = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [executingCode, setExecutingCode] = useState<string | null>(null);
  const [ussdResult, setUssdResult] = useState<{ code: string; result: string } | null>(null);

  const [topupCodes, setTopupCodes] = useState([
    {
      id: '1',
      code: '*555*100#',
      operator: 'ORANGE',
      sim: 'SIM 2',
      status: 'pending',
      amount: '100',
      description: 'Mobile Credit Top-up'
    }
  ]);

  const handleExecuteCode = async (code: string) => {
    setExecutingCode(code);
    try {
      const response = await ussdService.executeUSSDCode(code);
      if (response.success) {
        setUssdResult({ code, result: response.result || 'Code executed successfully' });
        toast({
          title: "Success",
          description: "Top-up code executed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to execute top-up code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while executing the code",
        variant: "destructive",
      });
    } finally {
      setExecutingCode(null);
    }
  };

  const handleDeleteTopupCode = (id: string) => {
    setTopupCodes(prev => prev.filter(code => code.id !== id));
    toast({
      title: "Success",
      description: "Top-up code deleted successfully",
    });
  };

  const filteredTopupCodes = topupCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.sim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Top-up Codes</h1>
          <p className="text-sm text-muted-foreground">View and manage top-up codes</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search top-up codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>SIM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopupCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono">{code.code}</TableCell>
                      <TableCell className="text-muted-foreground">{code.description || '-'}</TableCell>
                      <TableCell>{code.amount} MAD</TableCell>
                      <TableCell>
                        <Badge variant={code.operator === 'INWI' ? 'default' : code.operator === 'ORANGE' ? 'secondary' : 'outline'}>
                          {code.operator}
                        </Badge>
                      </TableCell>
                      <TableCell>{code.sim}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{code.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleExecuteCode(code.code)}
                            disabled={executingCode === code.code}
                          >
                            {executingCode === code.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTopupCode(code.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTopupCodes.length === 0 && searchTerm && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No top-up codes found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={ussdResult !== null} onOpenChange={(open) => !open && setUssdResult(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>USSD Response</DialogTitle>
              <DialogDescription>Code: {ussdResult?.code}</DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{ussdResult?.result}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Topup;
