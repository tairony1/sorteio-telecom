'use client'

import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { DashboardLayout } from '@/layouts/DashboardLayout'

export default function CriarSorteio() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const steps = [
    { id: 1, title: 'Informações Básicas' },
    { id: 2, title: 'Configuração de Tickets' },
    { id: 3, title: 'Prêmios' },
    { id: 4, title: 'Participantes' },
    { id: 5, title: 'Revisão e Publicação' },
  ]

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    toast('Sorteio criado com sucesso!', {
      description: 'O sorteio foi cadastrado e está ativo.',
      action: {
        label: <X size={20} />,
        onClick: () => console.log('Undo'),
      },
    })

    router.push('/sorteios')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Criar Novo Sorteio
          </h2>
          <p className="text-muted-foreground">
            Preencha as informações em 5 etapas
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-xs mt-2 text-center ${
                    currentStep >= step.id
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-colors ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Etapa {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={`step${currentStep}`} className="w-full">
              {/* Step 1 */}
              <TabsContent value="step1" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Sorteio</Label>
                  <Input id="titulo" placeholder="Ex: Sorteio de Natal 2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva o sorteio..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data do Sorteio</Label>
                  <Input id="data" type="date" />
                </div>
              </TabsContent>

              {/* Step 2 */}
              <TabsContent value="step2" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="totalTickets">Total de Tickets</Label>
                  <Input id="totalTickets" type="number" placeholder="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketsPorContrato">
                    Tickets por Contrato
                  </Label>
                  <Input
                    id="ticketsPorContrato"
                    type="number"
                    placeholder="5"
                    defaultValue="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefisoTicket">Prefixo do Ticket</Label>
                  <Input id="prefisoTicket" placeholder="Ex: NT2024" />
                </div>
              </TabsContent>

              {/* Step 3 */}
              <TabsContent value="step3" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="premio1">1º Prêmio</Label>
                  <Input id="premio1" placeholder="Descrição do 1º prêmio" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor1">Valor do 1º Prêmio</Label>
                  <Input id="valor1" type="text" placeholder="R$ 10.000,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premio2">2º Prêmio</Label>
                  <Input id="premio2" placeholder="Descrição do 2º prêmio" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor2">Valor do 2º Prêmio</Label>
                  <Input id="valor2" type="text" placeholder="R$ 5.000,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premio3">3º Prêmio</Label>
                  <Input id="premio3" placeholder="Descrição do 3º prêmio" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor3">Valor do 3º Prêmio</Label>
                  <Input id="valor3" type="text" placeholder="R$ 2.000,00" />
                </div>
              </TabsContent>

              {/* Step 4 */}
              <TabsContent value="step4" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="limiteParticipantes">
                    Limite de Participantes
                  </Label>
                  <Input
                    id="limiteParticipantes"
                    type="number"
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criterios">Critérios de Participação</Label>
                  <Textarea
                    id="criterios"
                    placeholder="Ex: Apenas clientes com contratos ativos"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restricoes">Restrições</Label>
                  <Textarea
                    id="restricoes"
                    placeholder="Defina restrições ou regras especiais..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* Step 5 */}
              <TabsContent value="step5" className="space-y-4">
                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">Revisão dos Dados</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Título:</strong> Sorteio de Natal 2024
                    </p>
                    <p>
                      <strong>Data:</strong> 25/12/2024
                    </p>
                    <p>
                      <strong>Total de Tickets:</strong> 1000
                    </p>
                    <p>
                      <strong>Tickets por Contrato:</strong> 5
                    </p>
                    <p>
                      <strong>Participantes:</strong> Até 500
                    </p>
                    <p>
                      <strong>Prêmios:</strong> 3 prêmios cadastrados
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    ⚠️ Após publicar, o sorteio ficará ativo e os participantes
                    poderão resgatar tickets.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              {currentStep < 5 ? (
                <Button onClick={handleNext} className="gap-2">
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2">
                  <Save className="h-4 w-4" />
                  Publicar Sorteio
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
