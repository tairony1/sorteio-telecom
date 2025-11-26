import CriarSorteioForm from './criar-sorteio-from'

export default function CriarSorteioPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Criar Novo Sorteio
        </h2>
        <p className="text-sm text-muted-foreground">
          Preencha as informações em 5 etapas
        </p>
      </div>

      <CriarSorteioForm />
    </div>
  )
}
