import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Activation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [activationForm, setActivationForm] = useState({
    code: '',
    operator: '',
    sim: '',
    description: ''
  });

  const [activationCodes, setActivationCodes] = useState([
    {
      id: '1',
      code: '*100#',
      operator: 'INWI',
      sim: 'SIM 1',
      status: 'pending',
      description: 'Balance Check'
    }
  ]);

  const handleAddActivationCode = () => {
    if (!activationForm.code || !activationForm.operator || !activationForm.sim) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCode = {
      id: Date.now().toString(),
      code: activationForm.code,
      operator: activationForm.operator,
      sim: activationForm.sim,
      status: 'pending',
      description: activationForm.description
    };

    setActivationCodes(prev => [...prev, newCode]);
    setActivationForm({ code: '', operator: '', sim: '', description: '' });
    
    toast({
      title: "Success",
      description: "Activation code added successfully",
    });
  };

  const handleDeleteActivationCode = (id: string) => {
    setActivationCodes(prev => prev.filter(code => code.id !== id));
    toast({
      title: "Success",
      description: "Activation code deleted successfully",
    });
  };

  const filteredActivationCodes = activationCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.sim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/management")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Activation</h1>
                <p className="text-sm text-muted-foreground">Manage activation codes and operations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>USSD Activation Management</CardTitle>
            <CardDescription>Manage activation codes and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Activation Code *</Label>
                <Input 
                  placeholder="*100#" 
                  value={activationForm.code}
                  onChange={(e) => setActivationForm(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Operator *</Label>
                <Select value={activationForm.operator} onValueChange={(value) => setActivationForm(prev => ({ ...prev, operator: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INWI">INWI</SelectItem>
                    <SelectItem value="ORANGE">ORANGE</SelectItem>
                    <SelectItem value="IAM">IAM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>SIM Slot *</Label>
                <Select value={activationForm.sim} onValueChange={(value) => setActivationForm(prev => ({ ...prev, sim: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SIM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIM 1">SIM 1</SelectItem>
                    <SelectItem value="SIM 2">SIM 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  placeholder="Balance check, etc." 
                  value={activationForm.description}
                  onChange={(e) => setActivationForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={handleAddActivationCode}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activation Code
            </Button>

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
                      <TableCell className="text-muted-foreground">{code.description || '-'}</TableCell>
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
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No activation codes found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Activation;
