'use client'

import { ChevronLeft, ChevronRight, Info, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
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
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ---------------- Types (sem ZOD) ----------------
type Premio = {
  status: boolean
  titulo?: string | null
  descricao?: string | null
  foto?: File | null
}

type FormValues = {
  titulo: string
  descricao?: string | null
  short: string
  data: string
  totalBilhetes?: string | number | undefined
  bilhetesPorParticipante: number
  entregaBilhetes: '1' | '2'
  premios: {
    premio1: Premio
    premio2: Premio
    premio3: Premio
  }
  regras?: string | null
}

// ---------------- Component ----------------
export default function CriarSorteioClient() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const steps = [
    { id: 1, title: 'Informações Básicas' },
    { id: 2, title: 'Configuração do Sorteio' },
    { id: 3, title: 'Premiações do Sorteio' },
    { id: 4, title: 'Regras do Sorteio' },
    { id: 5, title: 'Revisão e Publicação' },
  ]

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      titulo: '',
      descricao: '',
      short: '',
      data: '',
      totalBilhetes: '10',
      bilhetesPorParticipante: 5,
      entregaBilhetes: '1',
      premios: {
        premio1: { status: true, titulo: '', descricao: '', foto: null },
        premio2: { status: false, titulo: '', descricao: '', foto: null },
        premio3: { status: false, titulo: '', descricao: '', foto: null },
      },
      regras: '',
    } as Partial<FormValues>,
  })

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((s) => s + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const handleSetStep = (step: number) => {
    if (step < 1 || step > 5) return

    setCurrentStep(step)
  }

  // salva arquivo (o primeiro arquivo) no react-hook-form
  const handleFileChange = (fieldPath: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      setValue(fieldPath as any, null)
      return
    }
    // guardamos apenas o primeiro arquivo como File
    setValue(fieldPath as any, files[0])
    clearErrors(fieldPath as any)
  }

  // Validação manual -> retorna lista de mensagens e também chama setError para exibir inline
  const validateForm = (values: FormValues) => {
    const msgs: string[] = []

    // limpa erros prévios
    // (re-registering errors by setError when encountering them)
    // Básicos
    if (!values.titulo || values.titulo.trim().length < 3) {
      const m = 'Título obrigatório (mínimo 3 caracteres).'
      msgs.push(m)
      setError('titulo', { type: 'manual', message: m })
    }

    if (!values.short || values.short.trim().length === 0) {
      const m = 'O link é obrigatório.'
      msgs.push(m)
      setError('short' as any, { type: 'manual', message: m })
    } else {
      if (values.short.trim().length < 3 || values.short.trim().length > 10) {
        const m = 'O link deve conter de 3 a 10 caracteres.'
        msgs.push(m)
        setError('short' as any, { type: 'manual', message: m })
      }
    }

    if (!values.data || Number.isNaN(Date.parse(values.data))) {
      const m = 'Data inválida.'
      msgs.push(m)
      setError('data' as any, { type: 'manual', message: m })
    }

    const total =
      typeof values.totalBilhetes === 'string'
        ? Number(values.totalBilhetes)
        : values.totalBilhetes
    if (!total || Number.isNaN(Number(total)) || Number(total) < 10) {
      const m = 'Total de bilhetes inválido (mínimo 10).'
      msgs.push(m)
      setError('totalBilhetes' as any, { type: 'manual', message: m })
    }

    if (
      !values.bilhetesPorParticipante ||
      Number(values.bilhetesPorParticipante) < 1
    ) {
      const m = 'Bilhetes por participante deve ser no mínimo 1.'
      msgs.push(m)
      setError('bilhetesPorParticipante' as any, { type: 'manual', message: m })
    }

    if (!['1', '2'].includes(values.entregaBilhetes)) {
      const m = 'Escolha a ordem de entrega dos bilhetes.'
      msgs.push(m)
      setError('entregaBilhetes' as any, { type: 'manual', message: m })
    }
    // premios: se habilitado, precisa de título e foto
    // ;(['premio1', 'premio2', 'premio3'] as const).forEach((key) => {
    //   const p = (values as any).premios[key] as Premio | undefined
    //   if (!p) return
    //   if (p.status) {
    //     if (!p.titulo || String(p.titulo).trim() === '') {
    //       const m = `Título obrigatório para ${key}.`
    //       msgs.push(m)
    //       setError(`premios.${key}.titulo` as any, {
    //         type: 'manual',
    //         message: m,
    //       })
    //     }
    //     if (!p.foto || !(p.foto instanceof File)) {
    //       const m = `Imagem obrigatória para ${key}.`
    //       msgs.push(m)
    //       setError(`premios.${key}.foto` as any, { type: 'manual', message: m })
    //     }
    //   }
    // })

    return msgs
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log('FORM', data)

    // validação manual
    const errorsList = validateForm(data)
    if (errorsList.length > 0) {
      // exibe toast com primeiros 3 erros para não poluir
      const preview = errorsList.slice(0, 5).join(' \n ')
      // toast.error('Corrija os seguintes erros: ' + preview)
      toast('Preencha os dados', {
        description: (
          // Adicione a classe 'whitespace-pre-line' à descrição, se necessário
          <span className="whitespace-pre-line">
            {'\n'}
            {preview}
          </span>
        ),
      })
      return
    }

    try {
      // montar FormData para enviar (multipart)
      const fd = new FormData()
      fd.append('titulo', data.titulo)
      if (data.descricao) fd.append('descricao', data.descricao)
      fd.append('short', data.short)
      fd.append('data', data.data)

      // coerções
      const total =
        typeof data.totalBilhetes === 'string'
          ? Number(data.totalBilhetes)
          : data.totalBilhetes
      if (total !== undefined) fd.append('total_bilhetes', String(total))

      fd.append('bilhetes_participante', String(data.bilhetesPorParticipante))
      fd.append('entrega_bilhetes', String(Number(data.entregaBilhetes))) // envia 1|2 como número
      if (data.regras) fd.append('regras', data.regras)

      // premios
      for (const key of ['premio1', 'premio2', 'premio3'] as const) {
        const p = (data as any).premios[key] as Premio | undefined
        fd.append(`${key}_status`, String(Boolean(p?.status)))
        if (p?.titulo) fd.append(`${key}_titulo`, String(p.titulo))
        if (p?.descricao) fd.append(`${key}_descricao`, String(p.descricao))
        if (p?.foto && p.foto instanceof File) {
          fd.append(`${key}_foto`, p.foto, p.foto.name)
        }
      }

      console.log('FORM', fd)
      const res = await fetch('/api/sorteios', { method: 'POST', body: fd })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        // tenta mapear erros da API e exibir via toast
        if (json && json.errors && typeof json.errors === 'object') {
          // aplicar errors via setError se possível
          for (const k of Object.keys(json.errors)) {
            const msgs = json.errors[k]
            setError(k as any, {
              type: 'server',
              message: Array.isArray(msgs) ? msgs.join(', ') : String(msgs),
            })
          }
          toast.error('Existem erros no formulário. Verifique os campos.')
        } else {
          const message = (json && json.message) || 'Erro ao criar sorteio'
          toast.error(message)
        }
        return
      }

      toast.success('Sorteio criado com sucesso!', {
        description: 'O sorteio foi cadastrado e está ativo.',
        action: { label: <X size={20} />, onClick: () => {} },
      })

      // router.push('/sorteios')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Erro ao enviar formulário')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Steps header */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <button
                type="button"
                onClick={() => handleSetStep(step.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {step.id}
              </button>
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
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título do Sorteio</Label>
                <Input id="titulo" {...register('titulo')} />
                {errors.titulo && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.titulo.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" {...register('descricao')} />
                {errors.descricao && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.descricao.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="short">Link de Acesso</Label>

                {/* ==== InputGroup do shadcn (mantive seu design) ==== */}
                <InputGroup>
                  <InputGroupInput
                    id="short"
                    placeholder="SORTEIO10"
                    className="pl-1! placeholder:text-neutral-500"
                    {...register('short')}
                  />
                  <InputGroupAddon>
                    <InputGroupText className="text-neutral-200">
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
                {errors.short && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.short.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data do Sorteio</Label>
                <Input id="data" type="date" {...register('data')} />
                {errors.data && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.data.message)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="total-bilhetes">Total de bilhetes</Label>
                <Controller
                  control={control}
                  name="totalBilhetes"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as any}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleciona a quantia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Quantia</SelectLabel>
                          <SelectItem value="10">10 bilhetes</SelectItem>
                          <SelectItem value="100">100 bilhetes</SelectItem>
                          <SelectItem value="1000">1.000 bilhetes</SelectItem>
                          <SelectItem value="10000">10.000 bilhetes</SelectItem>
                          <SelectItem value="100000">
                            100.000 bilhetes
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.totalBilhetes && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.totalBilhetes.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bilhetes-participante">
                  Bilhetes por participante
                </Label>
                <Input
                  id="bilhetes-participante"
                  type="number"
                  {...register('bilhetesPorParticipante', {
                    valueAsNumber: true,
                  })}
                />
                {errors.bilhetesPorParticipante && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.bilhetesPorParticipante.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entrega-bilhetes">
                  Ordem de distribuição dos bilhetes
                </Label>

                {/* ==== RadioGroup mantendo estilo shadcn ==== */}
                <Controller
                  control={control}
                  name="entregaBilhetes"
                  render={({ field }) => (
                    <RadioGroup
                      id="entrega-bilhetes"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid md:grid-cols-2 gap-3 grid-cols-1"
                    >
                      <Label
                        htmlFor="opt1"
                        className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 dark:has-[[data-state=checked]]:border-green-900 dark:has-[[data-state=checked]]:bg-green-950"
                      >
                        <RadioGroupItem
                          value="1"
                          id="opt1"
                          className="rounded-full data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-green-700 dark:data-[state=checked]:bg-green-700"
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
                        className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 dark:has-[[data-state=checked]]:border-green-900 dark:has-[[data-state=checked]]:bg-green-950"
                      >
                        <RadioGroupItem
                          value="2"
                          id="opt2"
                          className="rounded-full data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-green-700 dark:data-[state=checked]:bg-green-700"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm font-medium">Aleatória</p>
                          <p className="text-sm text-muted-foreground">
                            Entrega os bilhetes aleatoriamente até que se
                            esgotem.
                          </p>
                        </div>
                      </Label>
                    </RadioGroup>
                  )}
                />
                {errors.entregaBilhetes && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.entregaBilhetes.message)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Premio 1 */}
              <div className="space-y-2">
                <Label htmlFor="premio1-titulo">1º Prêmio - Título</Label>
                <Input
                  id="premio1-titulo"
                  {...register('premios.premio1.titulo' as any)}
                />
                {errors.premios?.premio1?.titulo && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.premios.premio1.titulo?.message)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio1-descricao">Descrição</Label>
                <Input
                  id="premio1-descricao"
                  {...register('premios.premio1.descricao' as any)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio1-foto">Foto do 1º Prêmio</Label>
                <input
                  id="premio1-foto"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      'premios.premio1.foto' as any,
                      e.target.files
                    )
                  }
                />
                {errors.premios?.premio1?.foto && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.premios.premio1.foto?.message)}
                  </p>
                )}
              </div>

              <Separator className="my-6" />

              {/* Premio 2 */}
              <div className="flex items-center space-x-2 pb-3">
                <Controller
                  control={control}
                  name="premios.premio2.status"
                  render={({ field }) => (
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  )}
                />
                <Label htmlFor="premio2-status">Habilitar 2° Prêmio</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premio2-titulo">2º Prêmio - Título</Label>
                <Input
                  id="premio2-titulo"
                  {...register('premios.premio2.titulo' as any)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio2-descricao">Descrição</Label>
                <Input
                  id="premio2-descricao"
                  {...register('premios.premio2.descricao' as any)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio2-foto">Foto do 2º Prêmio</Label>
                <input
                  id="premio2-foto"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      'premios.premio2.foto' as any,
                      e.target.files
                    )
                  }
                />
                {errors.premios?.premio2?.foto && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.premios.premio2.foto?.message)}
                  </p>
                )}
              </div>

              <Separator className="my-6" />

              {/* Premio 3 */}
              <div className="flex items-center space-x-2 pb-3">
                <Controller
                  control={control}
                  name="premios.premio3.status"
                  render={({ field }) => (
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  )}
                />
                <Label htmlFor="premio3-status">Habilitar 3° Prêmio</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premio3-titulo">3º Prêmio - Título</Label>
                <Input
                  id="premio3-titulo"
                  {...register('premios.premio3.titulo' as any)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio3-descricao">Descrição</Label>
                <Input
                  id="premio3-descricao"
                  {...register('premios.premio3.descricao' as any)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio3-foto">Foto do 3º Prêmio</Label>
                <input
                  id="premio3-foto"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      'premios.premio3.foto' as any,
                      e.target.files
                    )
                  }
                />
                {errors.premios?.premio3?.foto && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.premios.premio3.foto?.message)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regras">Regras do sorteio</Label>
                <Textarea
                  id="regras"
                  {...register('regras')}
                  className="min-h-80"
                />
              </div>
            </div>
          )}

          {/* STEP 5 - revisão e submit */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Revisão dos Dados</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Título:</strong> {getValues('titulo') || '-'}
                  </p>
                  <p>
                    <strong>Data:</strong> {getValues('data') || '-'}
                  </p>
                  <p>
                    <strong>Total de Bilhetes:</strong>{' '}
                    {String(getValues('totalBilhetes') || '-')}
                  </p>
                  <p>
                    <strong>Bilhetes por Participante:</strong>{' '}
                    {String(getValues('bilhetesPorParticipante'))}
                  </p>
                  <p>
                    <strong>Prêmios:</strong>{' '}
                    {
                      ['premio1', 'premio2', 'premio3'].filter((k) =>
                        getValues(`premios.${k}.status` as any)
                      ).length
                    }{' '}
                    prêmios cadastrados
                  </p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  ⚠️ Após publicar, o sorteio ficará ativo e os participantes
                  poderão resgatar tickets.
                </p>
              </div>
            </div>
          )}

          {/* navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>

            {currentStep < 5 ? (
              <Button type="button" onClick={handleNext} className="gap-2">
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" /> Publicar Sorteio
              </Button>
              // <Button type="submit" disabled={isSubmitting} className="gap-2">
              //   <Save className="h-4 w-4" /> Publicar Sorteio
              // </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
