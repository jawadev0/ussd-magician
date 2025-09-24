import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [formData, setFormData] = useState({
    name: editingCode?.name || "",
    code: editingCode?.code || "",
    description: editingCode?.description || "",
    category: editingCode?.category || "",
  });

  const handleSave = () => {
    if (formData.name && formData.code) {
      onSave({
        name: formData.name,
        code: formData.code,
        description: formData.description,
        category: formData.category,
        last_executed: editingCode?.last_executed,
      });
      
      // Reset form
      setFormData({
        name: "",
        code: "",
        description: "",
        category: "",
      });
      
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingCode ? "Edit USSD Code" : "Add New USSD Code"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name || !formData.code}>
            {editingCode ? "Update" : "Add"} Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUSSDDialog;