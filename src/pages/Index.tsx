import { useNavigate } from "react-router-dom";
import { Smartphone, Zap, CreditCard, Users, TrendingUp, Activity, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Smartphone, label: "الأجهزة النشطة", value: "1", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: CreditCard, label: "شرائح SIM", value: "2", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: Activity, label: "العمليات اليوم", value: "17", color: "text-green-500", bg: "bg-green-50" },
    { icon: TrendingUp, label: "معدل النجاح", value: "98%", color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const quickActions = [
    { icon: Phone, title: "تفعيل USSD", description: "تفعيل شرائح SIM الجديدة", path: "/ussd-activation", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { icon: Smartphone, title: "الأجهزة", description: "إدارة أجهزتك", path: "/devices", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
    { icon: Zap, title: "أكواد التفعيل", description: "عرض أكواد التفعيل", path: "/activation", color: "bg-gradient-to-br from-green-500 to-green-600" },
    { icon: CreditCard, title: "الشحن", description: "إدارة أكواد الشحن", path: "/topup", color: "bg-gradient-to-br from-orange-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            مدير USSD
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            أدر عمليات الهاتف المحمول بسهولة. تحكم في الأجهزة وشرائح SIM وأكواد USSD من لوحة تحكم واحدة قوية.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${stat.bg}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-bold">الإجراءات السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`h-2 ${action.color}`} />
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">النشاط الأخير</h2>
            <Button variant="ghost" onClick={() => navigate("/devices")}>عرض الكل</Button>
          </div>
          <Card className="border-0 gradient-card">
            <CardContent className="p-6 space-y-4">
              {[
                { action: "تم تفعيل SIM 1", time: "منذ ساعتين", status: "نجح" },
                { action: "تم فحص الرصيد", time: "منذ 5 ساعات", status: "نجح" },
                { action: "تمت عملية الشحن", time: "منذ يوم واحد", status: "نجح" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'نجح' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
