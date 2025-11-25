'use client'

import { ChevronLeft, ChevronRight, Info, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function CriarSorteioClient() {
  const [currentStep, setCurrentStep] = useState(1)
  const [entregaDosBilhetes, setEntregaDosBilhetes] = useState('1')
  const router = useRouter()

  const steps = [
    { id: 1, title: 'Informações Básicas' },
    { id: 2, title: 'Configuração do Sorteio' },
    { id: 3, title: 'Premiações do Sorteio' },
    { id: 4, title: 'Regras do Sorteio' },
    { id: 5, title: 'Revisão e Publicação' },
  ]

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    toast('Sorteio criado com sucesso!', {
      description: 'O sorteio foi cadastrado e está ativo.',
      action: { label: <X size={20} />, onClick: () => {} },
    })
    router.push('/sorteios')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {step.id}
              </div>
              <span
                className={`text-xs mt-2 text-center ${currentStep >= step.id ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 rounded transition-colors ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`}
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
            <TabsContent value="step1" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título do Sorteio</Label>
                <Input
                  id="titulo"
                  placeholder={`Ex: Mega Sorteio ${new Date().getFullYear()}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o sorteio..."
                  className="min-h-20"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short">Link de Acesso</Label>
                <InputGroup>
                  <InputGroupInput
                    id="short"
                    placeholder="SORTEIO10"
                    className="!pl-1"
                  />
                  <InputGroupAddon>
                    <InputGroupText className="text-neutral-500">
                      https://sorteio.frontless.com.br/
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          className="rounded-full"
                          size="icon-xs"
                        >
                          <Info />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>Gerar link aleatório</TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          className="rounded-full"
                          size="icon-xs"
                        >
                          <Info />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>Copiar link completo.</TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data do Sorteio</Label>
                <Input id="data" type="date" />
              </div>
            </TabsContent>

            {/* Etapa 2 */}
            <TabsContent value="step2" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="total-bilhetes">Total de bilhetes</Label>
                <Select>
                  <SelectTrigger
                    id="total-bilhetes"
                    name="total-bilhetes"
                    className="w-full"
                  >
                    <SelectValue placeholder="Seleciona a quantia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Quantia</SelectLabel>
                      <SelectItem value="apple">10 bilhetes</SelectItem>
                      <SelectItem value="banana">100 bilhetes</SelectItem>
                      <SelectItem value="blueberry">1.000 bilhetes</SelectItem>
                      <SelectItem value="grapes">10.000 bilhetes</SelectItem>
                      <SelectItem value="pineapple">
                        100.000 bilhetes
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bilhetes-participante">
                  Bilhetes por participantes
                </Label>
                <Input
                  id="bilhetes-participante"
                  name="bilhetes-participante"
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entrega-bilhetes">
                  Ordem de distribuição dos bilhetes
                </Label>
                <RadioGroup
                  id="entrega-bilhetes"
                  name="entrega-bilhetes"
                  value={entregaDosBilhetes}
                  onValueChange={setEntregaDosBilhetes}
                  className="grid md:grid-cols-2 gap-3 grid-cols-1"
                >
                  <Label
                    htmlFor="opt1"
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3
                    has-[[data-state=checked]]:border-green-600
                    has-[[data-state=checked]]:bg-green-50
                    dark:has-[[data-state=checked]]:border-green-900
                    dark:has-[[data-state=checked]]:bg-green-950"
                  >
                    <RadioGroupItem
                      value="1"
                      id="opt1"
                      className="rounded-full data-[state=checked]:border-green-600
                      data-[state=checked]:bg-green-600 data-[state=checked]:text-white
                      dark:data-[state=checked]:border-green-700
                      dark:data-[state=checked]:bg-green-700"
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm font-medium">Ordenada</p>
                      <p className="text-sm text-muted-foreground">
                        Entrega os bilhetes em ordem crescente até que se
                        esgotem.
                      </p>
                    </div>
                  </Label>

                  <Label
                    htmlFor="opt2"
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3
                      has-[[data-state=checked]]:border-green-600
                      has-[[data-state=checked]]:bg-green-50
                      dark:has-[[data-state=checked]]:border-green-900
                      dark:has-[[data-state=checked]]:bg-green-950"
                  >
                    <RadioGroupItem
                      value="2"
                      id="opt2"
                      className="rounded-full data-[state=checked]:border-green-600
                      data-[state=checked]:bg-green-600 data-[state=checked]:text-white
                      dark:data-[state=checked]:border-green-700
                      dark:data-[state=checked]:bg-green-700"
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm font-medium">Aleatória</p>
                      <p className="text-sm text-muted-foreground">
                        Entrega os bilhetes aleatoriamente até que se esgotem.
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="prefisoTicket">Limite de Participantes</Label>
                <Input id="prefisoTicket" placeholder="Ex: NT2024" />
              </div> */}
            </TabsContent>

            <TabsContent value="step3" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="premio1-titulo">1º Prêmio</Label>
                <Input id="premio1-titulo" placeholder="Titulo do 1º prêmio" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio1-descricao">
                  Descrição do 1º Prêmio
                </Label>
                <Input
                  id="premio1-descricao"
                  type="text"
                  placeholder="Breve descrição do 1° prêmio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio1-foto">Foto do 1º Prêmio</Label>
                <Input id="premio1-foto" type="file" />
              </div>

              <Separator className="my-8" />

              <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-3">
                  <Switch id="premio2-status" />
                  <Label htmlFor="premio2-status">Habilitar 2° Prêmio</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio2-titulo">2º Prêmio</Label>
                <Input id="premio2-titulo" placeholder="Titulo do 2º prêmio" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio2-descricao">
                  Descrição do 2º Prêmio
                </Label>
                <Input
                  id="premio2-descricao"
                  type="text"
                  placeholder="Breve descrição do 2° prêmio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio2-foto">Foto do 2º Prêmio</Label>
                <Input id="premio2-foto" type="file" />
              </div>

              <Separator className="my-8" />

              <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-3">
                  <Switch id="premio3-status" />
                  <Label htmlFor="premio3-status">Habilitar 3° Prêmio</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio3-titulo">3º Prêmio</Label>
                <Input id="premio3-titulo" placeholder="Titulo do 3º prêmio" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio3-descricao">
                  Descrição do 3º Prêmio
                </Label>
                <Input
                  id="premio3-descricao"
                  type="text"
                  placeholder="Breve descrição do 3° prêmio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio3-foto">Foto do 3º Prêmio</Label>
                <Input id="premio3-foto" type="file" />
              </div>
            </TabsContent>

            <TabsContent value="step4" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regras">Regras do sorteio</Label>
                <Textarea
                  id="regras"
                  placeholder="Defina restrições ou regras especiais..."
                  className="min-h-80"
                  rows={4}
                />
              </div>
            </TabsContent>

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
                    <strong>Total de Bilhetes:</strong> 1.000
                  </p>
                  <p>
                    <strong>Bilhetes por Participante:</strong> 5
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
  )
}
