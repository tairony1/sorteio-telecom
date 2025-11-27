'use client'

import {
  ArrowLeft,
  Award,
  Calendar,
  Check,
  CirclePlus,
  Grid,
  List,
  Medal,
  Search,
  Ticket,
  Trophy,
  Users,
} from 'lucide-react'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  BilhetesGridSkeleton,
  BilhetesListSkeleton,
} from '@/components/skeletons/BilhetesSkeleton'
import { SorteioSkeleton } from '@/components/skeletons/SorteioSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/services/api'

export default function SorteioClient() {
  const params = useParams()
  const router = useRouter()

  const [sorteioId] = useState(params.id)

  // Estados de carregamento
  const [loadingSorteio, setLoadingSorteio] = useState(true)
  const [loadingSorteioFailure, setLoadingSorteioFailure] = useState(false)
  const [loadingBilhetes, setLoadingBilhetes] = useState(true)
  const [loadingBilhetesFailure, setLoadingBilhetesFailure] = useState(false)

  // Dados reais da API
  const [sorteio, setSorteio] = useState<any>(null)
  const [bilhetes, setBilhetes] = useState<any[]>([])
  const [participantes, setParticipantes] = useState<any[]>([])

  const [selectedParticipante, setSelectedParticipante] = useState<any | null>(
    null
  )
  const [currentPageParticipantes, setCurrentPageParticipantes] = useState(1)
  const [filtroParticipante, setFiltroParticipante] = useState('')
  const [showParticipanteModal, setShowParticipanteModal] = useState(false)

  // UI States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const [sorteioStatus, setSorteioStatus] = useState<boolean | number>(false)
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const itemsPerPage = 100
  const participantesPerPage = 50

  // Carrega os dados do sorteio
  useEffect(() => {
    async function loadSorteio() {
      try {
        const { data } = await api.get(`/sorteio/${sorteioId}`)
        console.log('data', data)

        setSorteio(data)
        setSorteioStatus(data.status)
      } catch {
        toast.error('Erro ao carregar dados do sorteio')
        setLoadingSorteioFailure(true)
      } finally {
        setLoadingSorteio(false)
      }
    }

    loadSorteio()
  }, [sorteioId])

  // Carrega os bilhetes do sorteio
  useEffect(() => {
    async function loadBilhetes() {
      try {
        const { data } = await api.get(`/bilhetes/${sorteioId}`)
        console.log('data', data)

        const normalized = data.bilhetes.map((b: any) => ({
          numero: String(b.numero).padStart(5, '0'),
          resgatado: !!b.resgate_data,
          participante: b.participante,
        }))

        setBilhetes(normalized)

        // ✔️ SALVA participantes agrupados da API
        setParticipantes(data.participantes || [])
      } catch {
        toast.error('Erro ao carregar bilhetes')
        setLoadingBilhetesFailure(true)
      } finally {
        setLoadingBilhetes(false)
      }
    }

    loadBilhetes()
  }, [sorteioId])

  useEffect(() => {
    if (loadingSorteioFailure) {
      router.replace('/sorteios')
    }
  }, [loadingSorteioFailure, router])

  const filteredBilhetes = useMemo(() => {
    return bilhetes.filter((t) => {
      // filtro por busca
      const numMatches = t.numero.includes(searchTerm)
      const partMatches = t.participante
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())

      const matchesSearch = numMatches || partMatches

      // filtro por status
      const status = t.resgatado ? 'resgatado' : 'livre'

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(status)

      return matchesSearch && matchesStatus
    })
  }, [bilhetes, searchTerm, statusFilter])

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) =>
      p.participante?.toLowerCase().includes(filtroParticipante.toLowerCase())
    )
  }, [participantes, filtroParticipante])

  const totalPages = Math.ceil(filteredBilhetes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentBilhetes = filteredBilhetes.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const totalPagesParticipantes = Math.ceil(
    participantesFiltrados.length / participantesPerPage
  )
  const startIndexP = (currentPageParticipantes - 1) * participantesPerPage
  const participantesExibidos = participantesFiltrados.slice(
    startIndexP,
    startIndexP + participantesPerPage
  )

  // Skeleton do sorteio
  if (loadingSorteio || loadingSorteioFailure) {
    return <SorteioSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {sorteio.titulo || 'Titulo não informado'}
            </h2>
            <p className="text-muted-foreground">
              Sorteio #{sorteio.id}
              <Badge
                variant={
                  sorteioStatus === false
                    ? 'outline'
                    : sorteioStatus === 1
                      ? 'default'
                      : sorteioStatus === 2
                        ? 'secondary'
                        : 'destructive'
                }
                className="ml-2"
              >
                {sorteioStatus === false
                  ? '-'
                  : sorteioStatus === 1
                    ? 'Ativo'
                    : sorteioStatus === 2
                      ? 'Concluído'
                      : 'Cancelado'}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Dialog
        open={showParticipanteModal}
        onOpenChange={setShowParticipanteModal}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Bilhetes de {selectedParticipante?.participante}
            </DialogTitle>
            <DialogDescription>
              Lista completa de bilhetes associados ao participante
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {selectedParticipante?.bilhetes?.map((b: any, i: number) => (
              <div
                key={i}
                className="flex justify-between border p-2 rounded-md"
              >
                <span className="font-semibold">#{b.numero}</span>

                <span className="text-sm text-muted-foreground">
                  {b.resgate_data ? (
                    <>
                      Resgatado em {new Date(b.resgate_data).toLocaleString()}
                    </>
                  ) : (
                    <>Não resgatado</>
                  )}
                </span>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowParticipanteModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CARDS RESUMO */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-1 justify-between">
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Data do Sorteio
            </CardTitle>
            <Calendar className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {new Date(sorteio.data).toLocaleDateString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-1 justify-between">
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bilhetes (Resgatados / Total)
            </CardTitle>
            <Ticket className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold mb-4">
              <span className="text-primary">
                {sorteio.bilhetes_resgatados}
              </span>{' '}
              / {sorteio.total_bilhetes}
            </div>

            <span className="text-sm">
              {Number(sorteio.total_bilhetes) -
                Number(sorteio.bilhetes_resgatados)}{' '}
              restante
            </span>
          </CardContent>
        </Card>

        <Card className="gap-1 justify-between">
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Participantes Ativos
            </CardTitle>
            <Users className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold mb-4">
              {sorteio.participantes_ativos}
            </div>
            <span className="text-sm">
              {sorteio.bilhetes_participante} bilhetes / participante
            </span>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs defaultValue="bilhetes">
        <div className="flex justify-center mb-5">
          <TabsList className="grid w-full max-w-sm grid-cols-3">
            <TabsTrigger value="bilhetes">Bilhetes</TabsTrigger>
            <TabsTrigger value="participantes">
              Participantes
              {/* {participantes?.length && (
                <Badge className="px-1.5 text-neutral-800" variant="default">
                  {participantes.length}
                </Badge>
              )} */}
            </TabsTrigger>
            <TabsTrigger value="premiacoes">
              Premiações
              {/* {sorteio.premios?.length && (
                <Badge className="px-1.5 text-neutral-800" variant="default">
                  {sorteio.premios.length}
                </Badge>
              )} */}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB — BILHETES */}
        <TabsContent value="bilhetes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-2 w-full justify-between">
                  <div className="flex gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="pl-9"
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="whitespace-nowrap border-dashed"
                        >
                          <CirclePlus />
                          Status
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>
                          Filtrar por status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes('resgatado')}
                          onCheckedChange={() => {
                            setStatusFilter((prev) =>
                              prev.includes('resgatado')
                                ? prev.filter((p) => p !== 'resgatado')
                                : [...prev, 'resgatado']
                            )
                            setCurrentPage(1)
                          }}
                          onSelect={(e) => e.preventDefault()}
                        >
                          Resgatado
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes('livre')}
                          onCheckedChange={() => {
                            setStatusFilter((prev) =>
                              prev.includes('livre')
                                ? prev.filter((p) => p !== 'livre')
                                : [...prev, 'livre']
                            )
                            setCurrentPage(1)
                          }}
                          onSelect={(e) => e.preventDefault()}
                        >
                          Livre
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex gap-1 border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* SKELETON DOS BILHETES */}
              {loadingBilhetesFailure ? (
                <div className="w-full text-center py-5">
                  Não foi possível carregar os bilhetes!
                </div>
              ) : loadingBilhetes ? (
                viewMode === 'grid' ? (
                  <BilhetesGridSkeleton />
                ) : (
                  <BilhetesListSkeleton />
                )
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {currentBilhetes.map((ticket) => (
                    <div
                      key={ticket.numero}
                      className={`p-4 rounded-lg border-2 ${
                        ticket.resgatado
                          ? 'border-primary bg-primary/10'
                          : 'border-muted bg-muted/30'
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-lg">
                            #{ticket.numero}
                          </span>
                          <Badge
                            className="h-6"
                            variant={ticket.resgatado ? 'default' : 'secondary'}
                          >
                            {ticket.resgatado ? (
                              <Check className="size-3.5!" />
                            ) : (
                              'Livre'
                            )}
                          </Badge>
                        </div>

                        {ticket.participante && (
                          <p className="text-xs text-muted-foreground truncate">
                            {ticket.participante}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Participante</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentBilhetes.map((ticket) => (
                      <TableRow key={ticket.numero}>
                        <TableCell className="font-semibold">
                          #{ticket.numero}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={ticket.resgatado ? 'default' : 'secondary'}
                          >
                            {ticket.resgatado ? 'Resgatado' : 'Livre'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {ticket.participante || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          className={
                            currentPage === 1
                              ? 'opacity-50 pointer-events-none'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page =
                          currentPage <= 3 ? i + 1 : currentPage - 2 + i
                        if (page > totalPages) return null

                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={page === currentPage}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          className={
                            currentPage === totalPages
                              ? 'opacity-50 pointer-events-none'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB — PARTICIPANTES */}
        <TabsContent value="participantes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-2 w-full">
                  <div className="flex gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar participante..."
                        value={filtroParticipante}
                        onChange={(e) => {
                          setFiltroParticipante(e.target.value)
                          setCurrentPageParticipantes(1)
                        }}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participante</TableHead>
                    <TableHead>Bilhetes</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {participantesExibidos.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">
                        {p.participante || '-'}
                      </TableCell>

                      <TableCell>{p.bilhetes.length}</TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedParticipante(p)
                            setShowParticipanteModal(true)
                          }}
                        >
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPagesParticipantes > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPageParticipantes((p) =>
                              Math.max(1, p - 1)
                            )
                          }
                          className={
                            currentPageParticipantes === 1
                              ? 'opacity-50 pointer-events-none'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {[...Array(Math.min(5, totalPagesParticipantes))].map(
                        (_, i) => {
                          const page =
                            currentPageParticipantes <= 3
                              ? i + 1
                              : currentPageParticipantes - 2 + i
                          if (page > totalPagesParticipantes) return null

                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() =>
                                  setCurrentPageParticipantes(page)
                                }
                                isActive={page === currentPageParticipantes}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        }
                      )}

                      {currentPageParticipantes <
                        totalPagesParticipantes - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPageParticipantes((p) =>
                              Math.min(totalPagesParticipantes, p + 1)
                            )
                          }
                          className={
                            currentPageParticipantes === totalPagesParticipantes
                              ? 'opacity-50 pointer-events-none'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB — PREMIAÇÕES */}
        <TabsContent value="premiacoes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {sorteio.premios.map((premio: any, i: any) => (
              <Card key={i} className="p-0">
                <CardHeader className="bg-muted/30 border-b py-5!">
                  <div className="flex justify-between items-center">
                    <CardTitle>{premio.posicao}° Prêmio</CardTitle>
                    <Award className={`size-6`} />
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Prêmio</p>
                    <p className="text-base font-semibold">{premio.titulo}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="text-base font-medium">
                      {premio.descricao || 'Não informado'}
                    </p>
                  </div>

                  {sorteioStatus === 1 && (
                    <div className="pt-5 pb-6 mt-3 border-t text-center">
                      <p className="text-muted-foreground text-sm">
                        Sorteio em andamento...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
