'use client'

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Info,
  Save,
  Shuffle,
  X,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Label } from '@/components/ui/label'
// imports shadcn para date picker (ajuste paths se necessário)
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { api } from '@/services/api'

const BASE_URL_SHORT =
  process.env.NEXT_PUBLIC_BASE_URL_SHORT || 'https://meusite.com/'

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
  bilhetesEntrega: '1' | '2'
  premios: {
    premio1: Premio
    premio2: Premio
    premio3: Premio
  }
  regras?: string | null
}

// ---------------- Component ----------------

export default function EditarSorteioForm() {
  const params = useParams()
  const [sorteioId, setSorteioId] = useState(params.id)

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
      bilhetesEntrega: '1',
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

  // ---------------- Date picker state ----------------
  const initialDate = (() => {
    const d = getValues('data')
    if (d) {
      try {
        return new Date(d)
      } catch {
        return undefined
      }
    }
    return undefined
  })()
  const [openDate, setOpenDate] = useState(false)
  const [date, setDate] = useState<Date | undefined>(initialDate)

  const formatOnlyDate = (value: any) => {
    if (!value) return ''
    const d = value instanceof Date ? value : new Date(value)
    return d.toLocaleDateString('pt-BR')
  }

  useEffect(() => {
    // se já houver data no form, manter sincronizado
    const d = getValues('data')
    if (d && !date) {
      try {
        setDate(new Date(d))
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------------- Previews para fotos dos prêmios ----------------
  // mapa: 'premio1' | 'premio2' | 'premio3' => objectURL string
  const [previews, setPreviews] = useState<Record<string, string | null>>({
    premio1: null,
    premio2: null,
    premio3: null,
  })

  const premio1FotoRef = useRef<HTMLInputElement>(null)
  const premio2FotoRef = useRef<HTMLInputElement>(null)
  const premio3FotoRef = useRef<HTMLInputElement>(null)

  // quando montar, obter dados do backend e popular form
  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const { data, status } = await api.get(`/sorteio/${sorteioId}`)
        console.log(`GET /sorteio/${sorteioId}`, data)

        if (!mounted) return
        if (status !== 200) {
          toast.error('Erro ao buscar dados do sorteio')
          return
        }

        // popula campos (ajuste nomes conforme GET)
        setValue('titulo' as any, data.titulo || '')
        setValue('descricao' as any, data.descricao || '')
        setValue('short' as any, data.short || '')
        setValue('data' as any, data.data || '')
        setDate(data.data)
        setValue('totalBilhetes' as any, String(data.total_bilhetes || '10'))
        setValue(
          'bilhetesPorParticipante' as any,
          Number(data.bilhetes_participante || 1)
        )
        setValue('bilhetesEntrega' as any, data.bilhetes_entrega || '1')
        setValue('regras' as any, data.regras || '')

        // premios: preencher campos e previews (fotoUrl)
        for (const key of ['premio1', 'premio2', 'premio3'] as const) {
          const p = data.premios?.[key] || {}
          setValue(`premios.${key}.titulo` as any, p.titulo || '')
          setValue(`premios.${key}.descricao` as any, p.descricao || '')
          setValue(`premios.${key}.status` as any, Boolean(p.status))
          if (p.fotoUrl) {
            setPreviews((prev) => ({ ...prev, [key]: p.fotoUrl }))
            // guarda também campo para informar ao backend caso o arquivo não seja substituído
            // (o backend espera premioN_foto_existente — adicionaremos isso no submit)
          }
        }

        toast.success('Dados carregados para edição')
      } catch (err: any) {
        console.error(err)
        toast.error('Erro ao carregar dados do sorteio')
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorteioId])

  // salva arquivo (o primeiro arquivo) no react-hook-form e cria preview
  const handleFileChange = (fieldPath: string, files: FileList | null) => {
    // fieldPath: exemplo 'premios.premio1.foto'
    const keyMatch = fieldPath.match(/premios\.(premio[123])\.foto/)
    const key = keyMatch ? keyMatch[1] : null

    if (!files || files.length === 0) {
      setValue(fieldPath as any, null)
      if (key) {
        const prev = previews[key]
        if (prev) {
          URL.revokeObjectURL(prev)
        }
        setPreviews((p) => ({ ...p, [key]: null }))
      }
      return
    }
    const file = files[0]
    setValue(fieldPath as any, file)
    clearErrors(fieldPath as any)

    if (key) {
      // revoke old
      const old = previews[key]
      if (old) URL.revokeObjectURL(old)

      const url = URL.createObjectURL(file)
      setPreviews((p) => ({ ...p, [key]: url }))
    }
  }

  // ---------------- Tabs (prêmios) ----------------
  const [activePrizeTab, setActivePrizeTab] = useState<1 | 2 | 3>(1)

  // Validação manual -> retorna lista de mensagens e também chama setError para exibir inline
  const validateForm = (values: FormValues) => {
    const msgs: string[] = []

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

    if (!['1', '2'].includes(values.bilhetesEntrega)) {
      const m = 'Escolha a ordem de entrega dos bilhetes.'
      msgs.push(m)
      setError('bilhetesEntrega' as any, { type: 'manual', message: m })
    }

    return msgs
  }

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    // validação (usa a mesma validateForm do criar-sorteio-form)
    const errorsList = validateForm(formData)
    if (errorsList.length > 0) {
      const preview = errorsList.slice(0, 5).join(' \n ')
      toast('Preencha os dados', {
        description: (
          <span className="whitespace-pre-line">
            {'\n'}
            {preview}
          </span>
        ),
      })
      return
    }

    try {
      const form = new FormData()
      form.append('titulo', formData.titulo)
      if (formData.descricao) form.append('descricao', formData.descricao)
      form.append('short', formData.short)
      form.append('data', formData.data)
      if (formData.totalBilhetes !== undefined)
        form.append('total_bilhetes', String(formData.totalBilhetes))
      form.append(
        'bilhetes_participante',
        String(formData.bilhetesPorParticipante)
      )
      form.append('bilhetes_entrega', String(Number(formData.bilhetesEntrega)))
      if (formData.regras) form.append('regras', formData.regras)

      // premios: se não enviou novo arquivo para um prêmio, envia campo premioN_foto_existente
      for (const key of ['premio1', 'premio2', 'premio3'] as const) {
        const p = (formData as any).premios[key] as Premio | undefined
        form.append(`${key}_status`, String(Boolean(p?.status)))
        if (p?.titulo) form.append(`${key}_titulo`, String(p.titulo))
        if (p?.descricao) form.append(`${key}_descricao`, String(p.descricao))
        if (p?.foto && p.foto instanceof File) {
          form.append(`${key}_foto`, p.foto, p.foto.name)
        } else {
          // se preview existe, enviar campo de foto existente para backend manter a imagem
          if (previews[key]) {
            form.append(`${key}_foto_existente`, previews[key] as string)
          }
        }
      }

      console.log('zz1')
      const { data, status } = await api.patch(`/sorteio/${sorteioId}`, form)
      console.log('zz2', data, status)
      if (status === 200) {
        toast.success('Sorteio atualizado com sucesso!', {
          description: 'Alterações salvas.',
        })
        // router.push('/sorteios')
        return
      }

      toast.error('Erro ao editar sorteio')
    } catch (err: any) {
      console.error(err)
      const res = err?.response?.data || {}
      toast.error(res.error || 'Erro ao enviar formulário')
    }
  }

  const generateShort = async () => {
    try {
      const { data, status } = await api.get('/sorteio/short')
      console.log('POST /api/sorteio/short', status, data)

      setValue('short', data.short)
      if (errors.short) {
        clearErrors('short')
      }

      toast.success('Link gerado com sucesso!')
    } catch (err: any) {
      console.error(err)
      const res = err?.response?.data || {}
      toast.error(res.error || 'Erro ao enviar formulário')
    }
  }

  const copiarShortLink = () => {
    const text = getValues('short')
    navigator.clipboard
      .writeText(`${BASE_URL_SHORT}${text}`)
      .then(() => toast.success('Link copiado com sucesso!'))
      .catch(() => toast.error('Erro ao copiar link.'))
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
                <InputGroup>
                  <InputGroupInput
                    id="short"
                    placeholder="SORTEIO10"
                    className="pl-1! placeholder:text-neutral-500 text-primary"
                    {...register('short')}
                  />
                  <InputGroupAddon>
                    <InputGroupText className="text-neutral-200">
                      {BASE_URL_SHORT}
                    </InputGroupText>
                  </InputGroupAddon>

                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          className="rounded-sm text-primary-foreground/50 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 gap-1.5"
                          // size=""
                          onClick={generateShort}
                        >
                          <Shuffle /> Gerar
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>Gerar link aleatório</TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>

                  <InputGroupAddon align="inline-end" className="ml-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          className="rounded-sm text-primary-foreground/50 border  gap-1.5"
                          // size=""
                          onClick={copiarShortLink}
                        >
                          <Copy /> Copiar
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

                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {formatOnlyDate(date) || 'Selecione a data'}
                      <ChevronDown className="ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(d: Date | undefined) => {
                        setDate(d)
                        setOpenDate(false)
                        if (d) {
                          // salvar como ISO (você pode formatar diferente se quiser)
                          setValue('data' as any, d.toISOString())
                          clearErrors('data' as any)
                        } else {
                          setValue('data' as any, '')
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>

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

                <Controller
                  control={control}
                  name="bilhetesEntrega"
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
                {errors.bilhetesEntrega && (
                  <p className="text-red-400 text-sm font-light">
                    {String(errors.bilhetesEntrega.message)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 - PRÊMIOS COM TABS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Tabs header */}
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setActivePrizeTab(n as 1 | 2 | 3)}
                    className={`px-4 py-2 rounded-md font-medium border ${
                      activePrizeTab === n
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent text-foreground border-muted'
                    }`}
                  >
                    Prêmio {n}
                  </button>
                ))}
              </div>

              {/* Conteúdo da Tab ativa */}
              {activePrizeTab === 1 && (
                <div className="space-y-4">
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
                    <Item variant="outline">
                      <ItemContent>
                        <ItemTitle>Selecione a foto do 1° Premio</ItemTitle>
                        <ItemDescription>
                          <input
                            ref={premio1FotoRef}
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
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (premio1FotoRef.current) {
                              premio1FotoRef.current.click()
                            }
                          }}
                        >
                          Selecionar foto
                        </Button>
                      </ItemActions>
                    </Item>
                    {previews.premio1 && (
                      <img
                        src={previews.premio1}
                        alt="preview premio1"
                        className="mt-2 h-[250px] w-[250px] rounded object-cover border bg-center"
                      />
                    )}
                    {errors.premios?.premio1?.foto && (
                      <p className="text-red-400 text-sm font-light">
                        {String(errors.premios.premio1.foto?.message)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activePrizeTab === 2 && (
                <div className="space-y-4">
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
                    <Item variant="outline">
                      <ItemContent>
                        <ItemTitle>Selecione a foto do 2° Premio</ItemTitle>
                        <ItemDescription>
                          <input
                            ref={premio2FotoRef}
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
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (premio2FotoRef.current) {
                              premio2FotoRef.current.click()
                            }
                          }}
                        >
                          Selecionar foto
                        </Button>
                      </ItemActions>
                    </Item>
                    {previews.premio2 && (
                      <img
                        src={previews.premio2}
                        alt="preview premio2"
                        className="mt-2 h-[250px] w-[250px] rounded object-cover border bg-center"
                      />
                    )}
                    {errors.premios?.premio2?.foto && (
                      <p className="text-red-400 text-sm font-light">
                        {String(errors.premios.premio2.foto?.message)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activePrizeTab === 3 && (
                <div className="space-y-4">
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
                    <Item variant="outline">
                      <ItemContent>
                        <ItemTitle>Selecione a foto do 3° Premio</ItemTitle>
                        <ItemDescription>
                          <input
                            ref={premio3FotoRef}
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
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (premio3FotoRef.current) {
                              premio3FotoRef.current.click()
                            }
                          }}
                        >
                          Selecionar foto
                        </Button>
                      </ItemActions>
                    </Item>
                    {/* <input
                      id="premio3-foto"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          'premios.premio3.foto' as any,
                          e.target.files
                        )
                      }
                    /> */}
                    {previews.premio3 && (
                      <img
                        src={previews.premio3}
                        alt="preview premio3"
                        className="mt-2 h-[250px] w-[250px] rounded object-cover border bg-center"
                      />
                    )}
                    {errors.premios?.premio3?.foto && (
                      <p className="text-red-400 text-sm font-light">
                        {String(errors.premios.premio3.foto?.message)}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
                    <strong>Data do Sorteio:</strong>{' '}
                    {formatOnlyDate(getValues('data')) || '-'}
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
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleNext()
                }}
                className="gap-2"
              >
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{' '}
                Publicar Sorteio
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
