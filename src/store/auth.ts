import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/services/api";

interface Usuario {
  id: number;
  nome: string;
}

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  lembrar: string | null;

  login: (
    login: string,
    senha: string,
    lembrar: boolean
  ) => Promise<{
    ok: boolean;
    mensagem?: string;
  }>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      lembrar: null,

      login: async (login, senha, lembrar) => {
        try {
          const { data } = await api.post("/login", {
            login,
            senha,
          });

          // Se logou com sucesso → salva token e user
          set({
            usuario: data.user,
            token: data.token,
          });

          // ❗ Persistência automática está habilitada,
          // mas só queremos salvar se "lembrar = true"
          if (lembrar && login) {
            // limpa persistência (não salva nada)
            set({
              lembrar: login,
            });
          } else {
            set({
              lembrar: null,
            });
          }

          return { ok: true };
        } catch (error: any) {
          return {
            ok: false,
            mensagem: error.response?.data?.mensagem || "Credenciais inválidas",
          };
        }
      },

      logout: () => {
        localStorage.removeItem("auth");
        set({ usuario: null, token: null });
      },
    }),
    {
      name: "auth",
      partialize: (s) => ({
        usuario: s.usuario,
        token: s.token,
        lembrar: s.lembrar,
      }),
    }
  )
);
