import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../providers/ThemeProvider';
import { User, Lock, Palette, LogOut, Loader2, CheckCircle, Eye, EyeOff, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter ao menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  const isPassword = props.type === 'password';
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={isPassword && show ? 'text' : props.type}
          className={cn(
            'w-full h-11 px-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all',
            error ? 'border-destructive' : 'border-border',
            isPassword && 'pr-10',
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const qc = useQueryClient();

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const updateProfile = useMutation({
    mutationFn: (data: ProfileForm) => api.patch('/auth/me', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    },
  });

  const changePassword = useMutation({
    mutationFn: (data: PasswordForm) => api.patch('/auth/me', { currentPassword: data.currentPassword, newPassword: data.newPassword }),
    onSuccess: () => {
      passwordForm.reset();
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
  });

  const themeOptions = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Escuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in pb-20 lg:pb-0 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Personalize sua conta e preferências</p>
      </div>

      {/* Profile */}
      <Section title="Perfil" icon={User}>
        <form
          onSubmit={profileForm.handleSubmit((d) => updateProfile.mutate(d))}
          className="space-y-4"
        >
          <InputField
            label="Nome"
            type="text"
            placeholder="Seu nome"
            {...profileForm.register('name')}
            error={profileForm.formState.errors.name?.message}
          />
          <InputField
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            {...profileForm.register('email')}
            error={profileForm.formState.errors.email?.message}
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Salvar perfil
            </button>
            {profileSuccess && (
              <div className="flex items-center gap-1.5 text-emerald-500 text-sm">
                <CheckCircle className="w-4 h-4" />
                Salvo!
              </div>
            )}
          </div>
          {updateProfile.isError && (
            <p className="text-xs text-destructive">Erro ao salvar. Tente novamente.</p>
          )}
        </form>
      </Section>

      {/* Password */}
      <Section title="Senha" icon={Lock}>
        <form
          onSubmit={passwordForm.handleSubmit((d) => changePassword.mutate(d))}
          className="space-y-4"
        >
          <InputField
            label="Senha atual"
            type="password"
            placeholder="••••••••"
            {...passwordForm.register('currentPassword')}
            error={passwordForm.formState.errors.currentPassword?.message}
          />
          <InputField
            label="Nova senha"
            type="password"
            placeholder="••••••••"
            {...passwordForm.register('newPassword')}
            error={passwordForm.formState.errors.newPassword?.message}
          />
          <InputField
            label="Confirmar nova senha"
            type="password"
            placeholder="••••••••"
            {...passwordForm.register('confirmPassword')}
            error={passwordForm.formState.errors.confirmPassword?.message}
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {changePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Alterar senha
            </button>
            {passwordSuccess && (
              <div className="flex items-center gap-1.5 text-emerald-500 text-sm">
                <CheckCircle className="w-4 h-4" />
                Alterada!
              </div>
            )}
          </div>
          {changePassword.isError && (
            <p className="text-xs text-destructive">Erro ao alterar senha. Verifique a senha atual.</p>
          )}
        </form>
      </Section>

      {/* Theme */}
      <Section title="Aparência" icon={Palette}>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all',
                  isActive
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <Icon className="w-5 h-5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Account */}
      <Section title="Conta" icon={LogOut}>
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Logado como <span className="font-medium text-foreground">{user?.email}</span>
          </p>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        </div>
      </Section>
    </div>
  );
}
