import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddUSSDDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  type: 'TOPUP' | 'ACTIVATION';
}

const CATEGORIES = [
  "Balance Check",
  "Data Plans", 
  "Airtime",
  "Services",
  "Banking",
  "Other"
];

const AddUSSDDialog = ({ open, onOpenChange, onSuccess, type }: AddUSSDDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    description: string;
    category: string;
    sim: 1 | 2;
    operator: 'ORANGE' | 'INWI' | 'IAM' | '';
    device: string;
  }>({
    name: "",
    code: "",
    description: "",
    category: "",
    sim: 1,
    operator: "",
    device: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        code: "",
        description: "",
        category: "",
        sim: 1,
        operator: "",
        device: "",
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('add-ussd-code', {
        body: {
          name: formData.name,
          code: formData.code,
          type: type,
          description: formData.description || undefined,
          category: formData.category || undefined,
          sim: formData.sim,
          operator: formData.operator || undefined,
          device: formData.device || undefined,
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'ACTIVATION' ? 'Activation' : 'Top-up'} code added successfully`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding code:', error);
      toast({
        title: "Error",
        description: "Failed to add USSD code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add New {type === 'ACTIVATION' ? 'Activation' : 'Top-up'} Code
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
            <Label htmlFor="operator">Operator</Label>
            <Select value={formData.operator} onValueChange={(value) => setFormData({ ...formData, operator: value as 'ORANGE' | 'INWI' | 'IAM' | '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select operator (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INWI">INWI</SelectItem>
                <SelectItem value="ORANGE">ORANGE</SelectItem>
                <SelectItem value="IAM">IAM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="device">Device</Label>
            <Input
              id="device"
              value={formData.device}
              onChange={(e) => setFormData({ ...formData, device: e.target.value })}
              placeholder="e.g., Samsung Galaxy S21 (optional)"
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
        </form>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.name || !formData.code || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUSSDDialog;