import { Car, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function OnboardingPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-xl">
          <Car className="w-10 h-10 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">Bem-vindo, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">
            Sua conta foi criada com sucesso. Agora vamos cadastrar seu primeiro veículo.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4">
          <h3 className="font-semibold">O que você vai poder fazer:</h3>
          {[
            'Controlar todos os abastecimentos',
            'Registrar manutenções preventivas',
            'Receber alertas de vencimentos',
            'Acompanhar o consumo do veículo',
            'Gerar relatórios detalhados',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>

        <Link
          to="/vehicles/new"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
        >
          Cadastrar meu primeiro veículo
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
          Pular por enquanto
        </Link>
      </div>
    </div>
  );
}
