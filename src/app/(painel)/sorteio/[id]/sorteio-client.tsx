'use client'

import {
  ArrowLeft,
  Award,
  Calendar,
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

// Mock para premiações (mantemos porque você pediu)
const mockPremiacoes = [
  {
    posicao: '1º Lugar',
    descricao: 'Carro 0km',
    valor: 'R$ 80.000,00',
    icon: Trophy,
    color: 'text-prize-gold',
  },
  {
    posicao: '2º Lugar',
    descricao: 'Motocicleta 0km',
    valor: 'R$ 25.000,00',
    icon: Award,
    color: 'text-prize-silver',
  },
  {
    posicao: '3º Lugar',
    descricao: 'Smart TV 65"',
    valor: 'R$ 5.000,00',
    icon: Medal,
    color: 'text-prize-bronze',
  },
]

export default function SorteioClient() {
  const params = useParams()
  const router = useRouter()

  const [sorteioId] = useState(params.id)

  // Estados de carregamento
  const [loadingSorteio, setLoadingSorteio] = useState(true)
  const [loadingFailure, setLoadingFailure] = useState(false)
  const [loadingBilhetes, setLoadingBilhetes] = useState(true)

  // Dados reais da API
  const [sorteio, setSorteio] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])

  // UI States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const [isCompleted, setIsCompleted] = useState(false)

  const itemsPerPage = 100

  // Carrega os dados do sorteio
  useEffect(() => {
    async function loadSorteio() {
      try {
        // const res = await fetch(`/api/sorteio/${sorteioId}`)
        // const json = await res.json()

        const { data } = await api.get(`/sorteio/${sorteioId}`)
        console.log('data', data)

        setSorteio(data)
        setIsCompleted(data.status !== 1)
      } catch {
        toast.error('Erro ao carregar dados do sorteio')
        // setLoadingFailure(true)
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
        const res = await fetch(`/api/bilhetes/${sorteioId}`)
        const json = await res.json()

        const normalized = json.data.map((b: any) => ({
          numero: String(b.numero).padStart(5, '0'),
          resgatado: !!b.resgate_data,
          participante: b.participante,
        }))

        setTickets(normalized)
      } catch {
        toast.error('Erro ao carregar bilhetes')
        // setLoadingFailure(true)
      } finally {
        setLoadingBilhetes(false)
      }
    }

    loadBilhetes()
  }, [sorteioId])

  useEffect(() => {
    if (loadingFailure) {
      router.replace('/sorteios')
    }
  }, [loadingFailure, router])

  // Paginação + busca
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const num = t.numero.includes(searchTerm)
      const part = t.participante
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
      return num || part
    })
  }, [tickets, searchTerm])

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentTickets = filteredTickets.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Skeleton do sorteio
  if (loadingSorteio || loadingFailure) {
    return <SorteioSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/sorteios')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h2 className="text-2xl font-semibold">
              {sorteio.titulo || 'Titulo não informado'}
            </h2>
            <p className="text-muted-foreground">
              Sorteio #{sorteio.id}
              <Badge
                variant={isCompleted ? 'secondary' : 'default'}
                className="ml-2"
              >
                {isCompleted ? 'Concluído' : 'Ativo'}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      {/* CARDS RESUMO */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-4">
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">Data do Sorteio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {new Date(sorteio.data).toLocaleDateString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">
              Bilhetes (Resgatados / Total)
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {sorteio.bilhetes_resgatados} / {sorteio.total_bilhetes}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">Participantes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">
              {sorteio.participantes_ativos}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs defaultValue="tickets">
        <div className="flex justify-center mb-5">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="premiacoes">Premiações (3)</TabsTrigger>
          </TabsList>
        </div>

        {/* TAB — TICKETS */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <CardTitle>Lista de Tickets</CardTitle>

                <div className="flex gap-2 w-full sm:w-auto">
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
              {loadingBilhetes ? (
                viewMode === 'grid' ? (
                  <BilhetesGridSkeleton />
                ) : (
                  <BilhetesListSkeleton />
                )
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {currentTickets.map((ticket) => (
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
                          <span className="font-bold text-lg">
                            #{ticket.numero}
                          </span>
                          <Badge
                            variant={ticket.resgatado ? 'default' : 'secondary'}
                          >
                            {ticket.resgatado ? 'Resgatado' : 'Livre'}
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
                    {currentTickets.map((ticket) => (
                      <TableRow key={ticket.numero}>
                        <TableCell className="font-bold">
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

        {/* TAB — PREMIAÇÕES */}
        <TabsContent value="premiacoes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {mockPremiacoes.map((premio, i) => (
              <Card key={i}>
                <CardHeader className="bg-muted/30 border-b">
                  <div className="flex justify-between">
                    <CardTitle>{premio.posicao}</CardTitle>
                    <premio.icon className={`h-8 w-8 ${premio.color}`} />
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prêmio</p>
                    <p className="text-lg font-semibold">{premio.descricao}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="text-xl font-bold text-primary">
                      {premio.valor}
                    </p>
                  </div>

                  {!isCompleted && (
                    <div className="pt-4 border-t text-center">
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
