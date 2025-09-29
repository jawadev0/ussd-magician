import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ussdService } from '@/services/ussdService';
import inwiLogo from '@/assets/inwi-logo.png';
import orangeLogo from '@/assets/orange-logo.png';
import iamLogo from '@/assets/iam-logo.png';

type Operator = 'inwi' | 'orange' | 'iam';

const USSDActivation = () => {
  const navigate = useNavigate();
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const operators = [
    { id: 'inwi' as Operator, name: 'inwi', logo: inwiLogo },
    { id: 'orange' as Operator, name: 'Orange', logo: orangeLogo },
    { id: 'iam' as Operator, name: 'IAM', logo: iamLogo },
  ];

  const handleActivate = async () => {
    // Validation
    if (!selectedOperator) {
      toast({
        title: 'Error',
        description: 'Please select an operator',
        variant: 'destructive',
      });
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'Error',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    if (!activationCode || activationCode.length !== 4) {
      toast({
        title: 'Error',
        description: 'Please enter a 4-digit activation code',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      // Build USSD code based on operator and inputs
      const ussdCode = `*${activationCode}*${phoneNumber}#`;
      
      const result = await ussdService.executeUSSDCode(ussdCode);

      if (result.success) {
        setResponse(result.result);
        toast({
          title: 'Success',
          description: 'Activation request completed',
        });
      } else {
        setResponse(result.error || 'Activation failed');
        toast({
          title: 'Error',
          description: result.error || 'Activation failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setResponse(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedOperator(null);
    setPhoneNumber('');
    setActivationCode('');
    setResponse(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>USSD Activation</CardTitle>
            <CardDescription>
              Select your operator, enter your phone number and activation code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Operator Selection */}
            <div className="space-y-3">
              <Label>Select Operator</Label>
              <div className="grid grid-cols-3 gap-4">
                {operators.map((operator) => (
                  <button
                    key={operator.id}
                    onClick={() => setSelectedOperator(operator.id)}
                    className={`p-4 border-2 rounded-lg transition-all hover:scale-105 ${
                      selectedOperator === operator.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    disabled={isLoading}
                  >
                    <img
                      src={operator.logo}
                      alt={operator.name}
                      className="w-full h-24 object-contain"
                    />
                    <p className="mt-2 text-sm font-medium text-center">{operator.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                maxLength={15}
              />
            </div>

            {/* Activation Code Input */}
            <div className="space-y-2">
              <Label htmlFor="code">Activation Code (4 digits)</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 4-digit code"
                value={activationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setActivationCode(value);
                  }
                }}
                disabled={isLoading}
                maxLength={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleActivate}
                disabled={isLoading || !selectedOperator || !phoneNumber || activationCode.length !== 4}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  'Activate'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>

            {/* Response Display */}
            {response && (
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{response}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default USSDActivation;
