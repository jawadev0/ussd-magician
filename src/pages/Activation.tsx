import { useState, useEffect } from "react";
import { Edit, Trash2, Search, Play, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddUSSDDialog from "@/components/AddUSSDDialog";

interface USSDCode {
  id: string;
  code: string;
  name: string;
  operator: string;
  sim: number;
  status: string;
  description?: string;
  result?: string;
}

const Activation = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [executingCode, setExecutingCode] = useState<string | null>(null);
  const [ussdResult, setUssdResult] = useState<{ code: string; result: string } | null>(null);
  const [activationCodes, setActivationCodes] = useState<USSDCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchActivationCodes();
  }, []);

  const fetchActivationCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('ussd_codes')
        .select('*')
        .eq('type', 'ACTIVATION')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivationCodes(data || []);
    } catch (error) {
      console.error('Error fetching codes:', error);
      toast({
        title: "Error",
        description: "Failed to load activation codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteCode = async (id: string, code: string) => {
    setExecutingCode(code);
    try {
      const { data, error } = await supabase.functions.invoke('execute-ussd-code', {
        body: { code_id: id, ussd_code: code }
      });

      if (error) throw error;

      if (data.success) {
        setUssdResult({ code, result: data.result });
        await fetchActivationCodes(); // Refresh to show updated status
        toast({
          title: "Success",
          description: "Activation code executed successfully",
        });
      }
    } catch (error) {
      console.error('Execute error:', error);
      toast({
        title: "Error",
        description: "Failed to execute activation code",
        variant: "destructive",
      });
    } finally {
      setExecutingCode(null);
    }
  };

  const handleDeleteActivationCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ussd_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setActivationCodes(prev => prev.filter(code => code.id !== id));
      toast({
        title: "Success",
        description: "Activation code deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete activation code",
        variant: "destructive",
      });
    }
  };

  const filteredActivationCodes = activationCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.operator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activation Codes</h1>
            <p className="text-sm text-muted-foreground">Manage and execute activation codes</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Code
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activation codes..."
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
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>SIM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivationCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono">{code.code}</TableCell>
                      <TableCell className="font-medium">{code.name}</TableCell>
                      <TableCell className="text-muted-foreground">{code.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={code.operator === 'INWI' ? 'default' : code.operator === 'ORANGE' ? 'secondary' : 'outline'}>
                          {code.operator}
                        </Badge>
                      </TableCell>
                      <TableCell>{code.sim ? `SIM ${code.sim}` : '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{code.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleExecuteCode(code.id, code.code)}
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
                            onClick={() => handleDeleteActivationCode(code.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredActivationCodes.length === 0 && searchTerm && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No activation codes found matching "{searchTerm}"
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

        <AddUSSDDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={fetchActivationCodes}
          type="ACTIVATION"
        />
      </div>
    </div>
  );
};

export default Activation;
