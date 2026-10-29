import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 py-10 px-4 text-center text-xs text-[#94A3B8]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#F8FAFC]">nyxequities.</span>
          <span>&copy; 2026. Built on Binance Smart Chain.</span>
        </div>
        <div className="flex items-center space-x-5">
          <a
            href="https://github.com/MansiGole/NyxEquities/blob/main/docs/DX_REPORT.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F8FAFC] transition-colors"
          >
            Developer Experience Report
          </a>
          <span className="text-white/20">&bull;</span>
          <a
            href="https://github.com/MansiGole/NyxEquities"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F8FAFC] transition-colors"
          >
            GitHub
          </a>
          <span className="text-white/20">&bull;</span>
          <span className="text-[#00E599] font-medium">BSC Mainnet (Chain 56)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

