import { type ReactNode } from "react";
import { Icon } from "@app/ui/Icon";
import Logo from "@app/assets/images/logo.png";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
      <div className="min-h-screen flex">
        {/* Left Side - Management Hub Section */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 xl:px-12 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-gray-900">
            {/* Animated Shapes */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400/5 rounded-lg rotate-45 animate-bounce"></div>
            <div className="absolute bottom-20 left-16 w-12 h-12 bg-pink-500/10 rounded-full animate-ping"></div>
            <div className="absolute bottom-40 right-16 w-8 h-8 bg-pink-400/15 rounded-lg animate-pulse"></div>

            {/* Floating Orbs */}
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-pink-400/10 to-slate-500/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-slate-400/10 to-pink-500/10 rounded-full blur-xl animate-float-delayed"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-white px-8">
            <div className="w-full">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-10 bg-white backdrop-blur-sm rounded-lg flex items-center justify-center px-1 py-3">
                  <img src={Logo} alt="Logo" className="h-10 w-auto rounded" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Afeed Hub</h1>
                  <p className="text-white/80 text-sm">Management Center</p>
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-6 leading-tight">
                <span className="block text-content">Control Center</span>
              </h2>

              {/* Feature List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#196FF0" + "33" }}
                  >
                    <Icon
                      icon="lucide:activity"
                      className="w-5 h-5 text-[#196FF0]"
                    />
                  </div>
                  <span className="text-white/90">Control Manage Products</span>
                </div>
                {/* <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#f43f6e" + "33" }}
                  >
                    <Icon
                      icon="lucide:package"
                      className="w-5 h-5"
                      style={{ color: "#f43f6e" }}
                    />
                  </div>
                  <span className="text-white/90">
                    Warehouse & Inventory Control
                  </span>
                </div> */}
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#196FF0" + "33" }}
                  >
                    <Icon
                      icon="lucide:square-chart-gantt"
                      className="w-5 h-5 text-[#196FF0]"
                    />
                  </div>
                  <span className="text-white/90">
                    Custmomer & Creator Management
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#196FF0" + "33" }}
                  >
                    <Icon
                      icon="lucide:chart-no-axes-combined"
                      className="w-5 h-5 text-[#196FF0]"
                    />
                  </div>
                  <span className="text-white/90">Analytics & Reporting</span>
                </div>
              </div>

              {/* Operations Info */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#196FF0" }}>
                    @afeed.co
                  </div>
                  <div className="text-sm text-white/70">Domain</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">
                    Online
                  </div>
                  <div className="text-sm text-white/70">
                    Systems Operational
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">Secure</div>
                  <div className="text-sm text-white/70">Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-base-100">
          <div className="mx-auto w-full max-w-sm lg:w-96">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
