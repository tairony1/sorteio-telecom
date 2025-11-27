'use client'

import { CircleX, Edit, Eye, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { api } from '@/services/api'

interface SorteioListItem {
  id: number
  titulo: string
  data: string
  bilhetesDisponiveis: number
  bilhetesResgatados: number
  participantes: number
  status: number
  statusText: string
}

export default function SorteiosClient() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 20
  const router = useRouter()

  const [sorteios, setSorteios] = useState<SorteioListItem[] | null>(null)

  // ===============================
  // Carregar do backend
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await api.get('/sorteios')
        console.log('data', data)
        if (status === 200 && data.sorteios) {
          setSorteios(data.sorteios)
          return
        }
        setSorteios([])
      } catch (err) {
        console.error('Erro carregando sorteios:', err)
        setSorteios([])
      }
    }
    fetchData()
  }, [])

  const filteredSorteios = useMemo(() => {
    const source = sorteios ?? []
    return source.filter((sorteio) => {
      const idMatch = sorteio.id.toString().includes(searchTerm)
      const titleMatch = sorteio.titulo
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return idMatch || titleMatch
    })
  }, [searchTerm, sorteios])

  const totalPages = Math.ceil(filteredSorteios.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSorteios = filteredSorteios.slice(startIndex, endIndex)

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este sorteio?')) {
      console.log('Excluir:', id)
    }
  }

  if (!sorteios) {
    return (
      <>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Sorteios
            </h2>
            <p className="text-sm text-muted-foreground">
              Carregando sorteios...
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/sorteio/criar">
              <Plus className="h-4 w-4" /> Novo Sorteio
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Sorteios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center text-muted-foreground">
              Carregando...
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Sorteios
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os sorteios cadastrados
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/sorteio/criar">
            <Plus className="h-4 w-4" />
            Novo Sorteio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Lista de Sorteios</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou título..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Data do Sorteio</TableHead>
                <TableHead>Bilhetes</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentSorteios.map((sorteio) => (
                <TableRow key={sorteio.id}>
                  <TableCell className="font-medium">
                    {String(sorteio.id).padStart(6, '0')}
                  </TableCell>
                  <TableCell>{sorteio.titulo}</TableCell>
                  <TableCell>{sorteio.data}</TableCell>
                  <TableCell>
                    <span className="text-primary font-semibold">
                      {sorteio.bilhetesResgatados}
                    </span>
                    {' / '}
                    <span className="text-muted-foreground">
                      {sorteio.bilhetesDisponiveis - sorteio.bilhetesResgatados}
                    </span>
                  </TableCell>
                  <TableCell>{sorteio.participantes}</TableCell>

                  <TableCell>
                    {sorteio.status === 1 ? (
                      <Badge variant="default">{sorteio.statusText}</Badge>
                    ) : sorteio.status === 2 ? (
                      <Badge variant="secondary">{sorteio.statusText}</Badge>
                    ) : (
                      <Badge variant="destructive">{sorteio.statusText}</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/sorteio/${sorteio.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Gerenciar</TooltipContent>
                      </Tooltip> */}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/sorteio/${sorteio.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/sorteio/editar/${sorteio.id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sorteio.id)}
                      >
                        <CircleX className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNumber =
                    currentPage <= 3 ? i + 1 : currentPage - 2 + i
                  if (pageNumber > totalPages) return null
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
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
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
