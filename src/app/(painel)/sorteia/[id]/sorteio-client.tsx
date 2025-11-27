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
  const [sorteioId, setSorteioId] = useState(params.id)

  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [mockTickets, setMockTickets] = useState<
    { numero: string; resgatado: boolean; participante: string | null }[]
  >([])

  const [winners, setWinners] = useState({
    primeiro: '',
    segundo: '',
    terceiro: '',
  })
  const [tempWinners, setTempWinners] = useState({
    primeiro: '',
    segundo: '',
    terceiro: '',
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const itemsPerPage = 100

  useEffect(() => {
    setMockTickets(
      Array.from({ length: 250 }, (_, i) => ({
        numero: String(i + 1).padStart(5, '0'),
        resgatado: Math.random() > 0.5,
        participante:
          Math.random() > 0.5
            ? `Participante ${Math.floor(Math.random() * 50)}`
            : null,
      }))
    )
  }, [])

  const sorteio = useMemo(() => {
    const resgatados = mockTickets.filter((t) => t.resgatado).length
    const participantes = new Set(
      mockTickets.filter((t) => t.participante).map((t) => t.participante)
    ).size

    return {
      sorteioId,
      titulo: 'Sorteio de Natal 2024',
      data: '25/12/2024',
      totalTickets: mockTickets.length,
      ticketsResgatados: resgatados,
      participantes,
    }
  }, [mockTickets, sorteioId])

  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      const num = ticket.numero.includes(searchTerm)
      const part = ticket.participante
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
      return num || part
    })
  }, [searchTerm, mockTickets])

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentTickets = filteredTickets.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const handleConcluirSorteio = () => {
    if (
      !tempWinners.primeiro ||
      !tempWinners.segundo ||
      !tempWinners.terceiro
    ) {
      toast('Erro', {
        description: 'Por favor, informe todos os números vencedores.',
      })
      return
    }

    if (
      new Set([tempWinners.primeiro, tempWinners.segundo, tempWinners.terceiro])
        .size !== 3
    ) {
      toast('Erro', {
        description: 'Os números vencedores devem ser diferentes.',
      })
      return
    }

    setWinners(tempWinners)
    setIsCompleted(true)
    setDialogOpen(false)

    toast('Sorteio Concluído', {
      description: 'Os vencedores foram registrados com sucesso!',
    })
  }

  const getWinnerInfo = (ticketNumber: string) => {
    const ticket = mockTickets.find((t) => t.numero === ticketNumber)
    return ticket?.participante || 'Não identificado'
  }

  return (
    <div className="space-y-6">
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
            <h2 className="text-2xl font-semibold">{sorteio.titulo}</h2>
            <p className="text-muted-foreground">
              Sorteio #{sorteio.sorteioId}
              <Badge
                variant={isCompleted ? 'secondary' : 'default'}
                className="ml-2"
              >
                {isCompleted ? 'Concluído' : 'Ativo'}
              </Badge>
            </p>
          </div>
        </div>

        {!isCompleted && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Trophy className="h-4 w-4" />
                Concluir Sorteio
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Concluir Sorteio</DialogTitle>
                <DialogDescription>
                  Informe os números vencedores.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {['primeiro', 'segundo', 'terceiro'].map((pos, i) => (
                  <div className="space-y-2" key={pos}>
                    <Label>{i + 1}º Lugar - Ticket Vencedor</Label>
                    <Input
                      placeholder="Ex: 00123"
                      value={(tempWinners as any)[pos]}
                      maxLength={5}
                      onChange={(e) =>
                        setTempWinners({
                          ...tempWinners,
                          [pos]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConcluirSorteio}>Confirmar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">Data do Sorteio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sorteio.data}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">Tickets Resgatados</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sorteio.ticketsResgatados} / {sorteio.totalTickets}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sorteio.participantes}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets">
        <div className="flex justify-center mb-5">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="premiacoes">Premiações (3)</TabsTrigger>
          </TabsList>
        </div>

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
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {currentTickets.map((ticket) => (
                    <div
                      key={ticket.numero}
                      className={`p-4 rounded-lg border-2 ${ticket.resgatado ? 'border-primary bg-primary/10' : 'border-muted bg-muted/30'}`}
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

        <TabsContent value="premiacoes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {mockPremiacoes.map((premio, index) => {
              const winnerNumber =
                index === 0
                  ? winners.primeiro
                  : index === 1
                    ? winners.segundo
                    : winners.terceiro

              return (
                <Card key={index}>
                  <CardHeader className="bg-muted/30 border-b">
                    <div className="flex justify-between">
                      <CardTitle>{premio.posicao}</CardTitle>
                      <premio.icon className={`h-8 w-8 ${premio.color}`} />
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Prêmio</p>
                      <p className="text-lg font-semibold">
                        {premio.descricao}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="text-xl font-bold text-primary">
                        {premio.valor}
                      </p>
                    </div>

                    {isCompleted && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">
                          Ticket Vencedor
                        </p>

                        <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
                          <p className="text-2xl font-bold text-center text-primary">
                            #{winnerNumber}
                          </p>
                          <p className="text-sm text-center text-muted-foreground mt-2">
                            {getWinnerInfo(winnerNumber)}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {!isCompleted && (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Sorteio em andamento</p>
                <p className="text-sm text-muted-foreground">
                  Os vencedores aparecerão aqui quando o sorteio for concluído.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
