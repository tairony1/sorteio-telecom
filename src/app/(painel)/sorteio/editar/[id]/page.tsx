import EditarSorteioForm from './editar-sorteio-from'

export default function Page({ params }: { params: { id: number } }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Editar Sorteio
        </h2>
        <p className="text-sm text-muted-foreground">
          Modifique as informações em 5 etapas
        </p>
      </div>

      <EditarSorteioForm />
    </div>
  )
}
