import React from 'react';
import { Link } from 'react-router-dom';
import { FishOff, Home } from 'lucide-react';

export default function NotFoundView() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="relative mb-8 animate-bounce">
        <FishOff className="w-32 h-32 text-muted-foreground/30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-foreground drop-shadow-lg">
          404
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-primary mb-4">Ups! Woda wyschła...</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Strona, której szukasz, wypłynęła na głębokie wody i nie możemy jej znaleźć. Sprawdź poprawność adresu URL.
      </p>
      
      <Link 
        to="/" 
        className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-3 text-lg"
      >
        <Home className="w-6 h-6" /> Wróć do bezpiecznej przystani
      </Link>
    </div>
  );
}
