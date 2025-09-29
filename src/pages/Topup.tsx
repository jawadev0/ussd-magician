import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Topup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [topupForm, setTopupForm] = useState({
    code: '',
    operator: '',
    sim: '',
    amount: '',
    description: ''
  });

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

  const handleAddTopupCode = () => {
    if (!topupForm.code || !topupForm.operator || !topupForm.sim || !topupForm.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCode = {
      id: Date.now().toString(),
      code: topupForm.code,
      operator: topupForm.operator,
      sim: topupForm.sim,
      status: 'pending',
      amount: topupForm.amount,
      description: topupForm.description
    };

    setTopupCodes(prev => [...prev, newCode]);
    setTopupForm({ code: '', operator: '', sim: '', amount: '', description: '' });
    
    toast({
      title: "Success",
      description: "Top-up code added successfully",
    });
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
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/management")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <CreditCard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Top-up</h1>
                <p className="text-sm text-muted-foreground">Manage top-up codes and transactions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>USSD Top-up Management</CardTitle>
            <CardDescription>Manage top-up codes and transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Top-up Code *</Label>
                <Input 
                  placeholder="*555*123456789#" 
                  value={topupForm.code}
                  onChange={(e) => setTopupForm(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount (MAD) *</Label>
                <Input 
                  type="number" 
                  placeholder="100" 
                  value={topupForm.amount}
                  onChange={(e) => setTopupForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Operator *</Label>
                <Select value={topupForm.operator} onValueChange={(value) => setTopupForm(prev => ({ ...prev, operator: value }))}>
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
                <Select value={topupForm.sim} onValueChange={(value) => setTopupForm(prev => ({ ...prev, sim: value }))}>
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
                  placeholder="Top-up description" 
                  value={topupForm.description}
                  onChange={(e) => setTopupForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={handleAddTopupCode}>
              <Plus className="h-4 w-4 mr-2" />
              Add Top-up Code
            </Button>

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
      </main>
    </div>
  );
};

export default Topup;
