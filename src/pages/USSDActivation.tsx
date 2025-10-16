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
        title: 'خطأ',
        description: 'الرجاء اختيار المشغل',
        variant: 'destructive',
      });
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال رقم هاتف صحيح',
        variant: 'destructive',
      });
      return;
    }

    if (!activationCode || activationCode.length !== 4) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال رمز تفعيل مكون من 4 أرقام',
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
          title: 'نجح',
          description: 'تم إكمال طلب التفعيل',
        });
      } else {
        setResponse(result.error || 'Activation failed');
        toast({
          title: 'خطأ',
          description: result.error || 'فشل التفعيل',
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setResponse(errorMessage);
      toast({
        title: 'خطأ',
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
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة للرئيسية
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>تفعيل USSD</CardTitle>
            <CardDescription>
              اختر المشغل الخاص بك، أدخل رقم الهاتف ورمز التفعيل
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Operator Selection */}
            <div className="space-y-3">
              <Label>اختر المشغل</Label>
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
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="أدخل رقم الهاتف"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                maxLength={15}
              />
            </div>

            {/* Activation Code Input */}
            <div className="space-y-2">
              <Label htmlFor="code">رمز التفعيل (4 أرقام)</Label>
              <Input
                id="code"
                type="text"
                placeholder="أدخل رمز مكون من 4 أرقام"
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
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التفعيل...
                  </>
                ) : (
                  'تفعيل'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                إعادة تعيين
              </Button>
            </div>

            {/* Response Display */}
            {response && (
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-lg">الاستجابة</CardTitle>
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
