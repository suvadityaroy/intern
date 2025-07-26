import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "CodeSecure | AI-Powered Vulnerability Scanner",
  description: "Scan your code for vulnerabilities and get instant AI-powered fixes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className={cn("bg-background text-foreground min-h-screen flex flex-col relative overflow-x-hidden")}>  
        {/* Enhanced Animated Bubbles & Dots Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          {/* Main Bubbles */}
          <div className="absolute top-[-120px] left-[-100px] w-[420px] h-[420px] bg-gradient-to-br from-purple-500/40 via-blue-400/30 to-cyan-300/30 rounded-full blur-3xl animate-bubble1 shadow-2xl" />
          <div className="absolute bottom-[-140px] right-[-80px] w-[370px] h-[370px] bg-gradient-to-tr from-pink-400/40 via-fuchsia-400/30 to-indigo-400/30 rounded-full blur-2xl animate-bubble2 shadow-xl" />
          <div className="absolute top-[35%] left-[-120px] w-[260px] h-[260px] bg-gradient-to-br from-cyan-400/40 via-sky-300/30 to-blue-400/30 rounded-full blur-2xl animate-bubble3 shadow-lg" />
          <div className="absolute top-[60%] right-[-100px] w-[180px] h-[180px] bg-gradient-to-tr from-yellow-300/40 via-orange-300/30 to-pink-300/30 rounded-full blur-2xl animate-bubble4 shadow-lg" />
          {/* Floating Dots */}
          <div className="absolute top-[20%] left-[10%] w-4 h-4 bg-pink-400/70 rounded-full blur-md animate-dot1" />
          <div className="absolute top-[70%] left-[30%] w-3 h-3 bg-blue-400/70 rounded-full blur-sm animate-dot2" />
          <div className="absolute top-[50%] right-[20%] w-2.5 h-2.5 bg-purple-400/70 rounded-full blur-[2px] animate-dot3" />
          <div className="absolute bottom-[15%] right-[10%] w-3 h-3 bg-cyan-300/70 rounded-full blur-[2px] animate-dot4" />
          <div className="absolute bottom-[30%] left-[25%] w-2 h-2 bg-yellow-300/70 rounded-full blur-[1.5px] animate-dot5" />
          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-blue-50/40 to-background/90" />
        </div>

        {/* Navbar */}
        <nav className="w-full px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur border-b border-gray-200 sticky top-0 z-20 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="inline-block w-8 h-8 bg-gradient-to-tr from-primary to-accent rounded-full mr-2 animate-bounce shadow-lg" />
            CodeSecure
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="https://github.com/" target="_blank" rel="noopener" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in-slow">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full py-6 px-4 text-center text-muted-foreground text-xs border-t border-gray-200 bg-background/80 backdrop-blur animate-fade-in">
          <span>© {new Date().getFullYear()} CodeSecure. Built with ❤️ for secure code development.</span>
        </footer>
      </body>
    </html>
  );
}
