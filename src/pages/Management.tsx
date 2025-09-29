import { useNavigate } from "react-router-dom";
import { Settings, Users, Smartphone, CreditCard, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Management = () => {
  const navigate = useNavigate();

  const pages = [
    {
      title: "Devices",
      description: "Manage devices and SIM cards",
      icon: Smartphone,
      path: "/devices",
      color: "bg-blue-500"
    },
    {
      title: "SIM Cards",
      description: "Manage SIM cards and configurations",
      icon: CreditCard,
      path: "/simcards",
      color: "bg-purple-500"
    },
    {
      title: "Activation",
      description: "Manage activation codes and operations",
      icon: Zap,
      path: "/activation",
      color: "bg-yellow-500"
    },
    {
      title: "Top-up",
      description: "Manage top-up codes and transactions",
      icon: CreditCard,
      path: "/topup",
      color: "bg-green-500"
    },
    {
      title: "Users",
      description: "Manage system users and permissions",
      icon: Users,
      path: "/users",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Management Panel</h1>
                <p className="text-sm text-muted-foreground">Manage your USSD system</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <Card
                key={page.path}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(page.path)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-12 h-12 ${page.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{page.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{page.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Management;
