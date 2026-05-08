import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-blue-500">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              DuongNT_Blog
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DuongNT_Blog — Built for learning & research purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
