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
    description: string;
    category: string;
    simCard: 'INWI' | 'ORANGE' | 'IAM';
    device: string;
    operator: string;
    status: 'active' | 'inactive' | 'pending';
  }>({
    name: "",
    code: "",
    description: "",
    category: "",
    simCard: "INWI",
    device: "",
    operator: "",
    status: "active",
  });

  useEffect(() => {
    if (editingCode) {
      setFormData({
        name: editingCode.name,
        code: editingCode.code,
        description: editingCode.description || "",
        category: editingCode.category || "",
        simCard: editingCode.simCard,
        device: editingCode.device,
        operator: editingCode.operator,
        status: editingCode.status,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        category: "",
        simCard: "INWI",
        device: "",
        operator: "",
        status: "active",
      });
    }
  }, [editingCode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.code && formData.simCard && formData.device && formData.operator) {
      onSave(formData);
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
            <Label htmlFor="simCard">SIM Card *</Label>
            <Select value={formData.simCard} onValueChange={(value) => setFormData({ ...formData, simCard: value as 'INWI' | 'ORANGE' | 'IAM' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select SIM card" />
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
            <Label htmlFor="operator">Operator *</Label>
            <Input
              id="operator"
              value={formData.operator}
              onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
              placeholder="e.g., INWI Morocco"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' | 'pending' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
            disabled={!formData.name || !formData.code || !formData.simCard || !formData.device || !formData.operator}
          >
            {editingCode ? "Update" : "Add"} Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUSSDDialog;