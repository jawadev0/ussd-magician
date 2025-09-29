import { Smartphone, CreditCard, Zap, Users, Home, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Devices", url: "/devices", icon: Smartphone },
  { title: "SIM Cards", url: "/simcards", icon: CreditCard },
  { title: "Activation", url: "/activation", icon: Zap },
  { title: "Top-up", url: "/topup", icon: CreditCard },
  { title: "USSD Activation", url: "/ussd-activation", icon: Phone },
  { title: "Users", url: "/users", icon: Users },
];

export function TopNavbar() {
  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              USSD Manager
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
