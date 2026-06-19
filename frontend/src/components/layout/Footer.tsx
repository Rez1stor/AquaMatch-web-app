import React from 'react';
import { Fish } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Fish className="w-6 h-6" />
          <span className="font-bold text-lg text-foreground">AquaMatch</span>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Twój osobisty asystent do tworzenia idealnego i bezpiecznego ekosystemu wodnego.
        </p>
        <div className="text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} AquaMatch. Wszystkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
