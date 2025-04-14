
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const InterestSelection: React.FC = () => {
  const { selectInterest, state: {error, user, loading} } = useAuth();
  const navigate=useNavigate();
  React.useEffect(() => {
    if (user?.interest) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleInterestSelection = async (interest: string) => {
    await selectInterest(interest);
    navigate('/chat');
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Select Your Interest</CardTitle>
        <CardDescription className="text-center">
          This will determine your role in Cricket Talk Hub
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          className="h-24 text-lg border-2 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-all"
          onClick={() => handleInterestSelection('Playing Cricket')}
          disabled={loading}
        >
          <div className="flex flex-col items-center">
            <span className="text-xl">🏏</span>
            <span className="font-medium mt-2">Playing Cricket</span>
            <span className="text-xs text-muted-foreground mt-1">(Full chat access)</span>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-24 text-lg border-2 hover:bg-green-50 hover:border-green-500 hover:text-green-700 transition-all"
          onClick={() => handleInterestSelection('Watching Cricket')}
          disabled={loading}
        >
          <div className="flex flex-col items-center">
            <span className="text-xl">👁️</span>
            <span className="font-medium mt-2">Watching Cricket</span>
            <span className="text-xs text-muted-foreground mt-1">(Read-only access)</span>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default InterestSelection;
