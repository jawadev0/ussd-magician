import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USSDCode } from "@/types/ussd";

interface AddUSSDDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ussdCode: Omit<USSDCode, 'id' | 'created_at'>) => void;
  editingCode?: USSDCode | null;
}

const CATEGORIES = [
  "Balance Check",
  "Data Plans", 
  "Airtime",
  "Services",
  "Banking",
  "Other"
];

const AddUSSDDialog = ({ open, onOpenChange, onSave, editingCode }: AddUSSDDialogProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    type: 'TOPUP' | 'ACTIVATION';
    description: string;
    category: string;
    sim: 1 | 2;
    operator: 'ORANGE' | 'INWI' | 'IAM';
    device: string;
    status: 'pending' | 'done' | 'failed';
  }>({
    name: "",
    code: "",
    type: "TOPUP",
    description: "",
    category: "",
    sim: 1,
    operator: "INWI",
    device: "",
    status: "pending",
  });

  useEffect(() => {
    if (editingCode) {
      setFormData({
        name: editingCode.name,
        code: editingCode.code,
        type: editingCode.type,
        description: editingCode.description || "",
        category: editingCode.category || "",
        sim: editingCode.sim,
        operator: editingCode.operator,
        device: editingCode.device,
        status: editingCode.status,
      });
    } else if (open) {
      setFormData({
        name: "",
        code: "",
        type: "TOPUP",
        description: "",
        category: "",
        sim: 1,
        operator: "INWI",
        device: "",
        status: "pending",
      });
    }
  }, [editingCode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.code && formData.device) {
      onSave({
        name: formData.name,
        code: formData.code,
        type: formData.type,
        description: formData.description,
        category: formData.category,
        sim: formData.sim,
        operator: formData.operator,
        device: formData.device,
        status: formData.status,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCode ? "Edit USSD Code" : "Add New USSD Code"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Check Balance"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code">USSD Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., *123#"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'TOPUP' | 'ACTIVATION' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TOPUP">TOPUP</SelectItem>
                <SelectItem value="ACTIVATION">ACTIVATION</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sim">SIM *</Label>
            <Select value={formData.sim.toString()} onValueChange={(value) => setFormData({ ...formData, sim: parseInt(value) as 1 | 2 })}>
              <SelectTrigger>
                <SelectValue placeholder="Select SIM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">SIM 1</SelectItem>
                <SelectItem value="2">SIM 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="operator">Operator *</Label>
            <Select value={formData.operator} onValueChange={(value) => setFormData({ ...formData, operator: value as 'ORANGE' | 'INWI' | 'IAM' })}>
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
            <Label htmlFor="device">Device *</Label>
            <Input
              id="device"
              value={formData.device}
              onChange={(e) => setFormData({ ...formData, device: e.target.value })}
              placeholder="e.g., Samsung Galaxy S21"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'pending' | 'done' | 'failed' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              rows={3}
            />
          </div>
        </form>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.name || !formData.code || !formData.device}
          >
            {editingCode ? "Update" : "Add"} Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUSSDDialog;