'use client'

import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
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
import { DashboardLayout } from '@/layouts/DashboardLayout'

export default function Sorteios() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 20
  const router = useRouter()

  // mockSorteios starts null and will be populated on client in useEffect
  const [mockSorteios, setMockSorteios] = useState<
    | {
        id: number
        titulo: string
        data: string
        ticketsDisponiveis: number
        ticketsResgatados: number
        participantes: number
      }[]
    | null
  >(null)

  // --- Hooks (sempre chamados na mesma ordem) ---
  useEffect(() => {
    // somente no cliente
    setMockSorteios(
      Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        titulo: `Sorteio ${i + 1}`,
        // formulei a data de forma determinística para evitar discrepância de locale
        data: `${String(i + 1).padStart(2, '0')}/01/2024`,
        ticketsDisponiveis: 1000,
        ticketsResgatados: Math.floor(Math.random() * 1000),
        participantes: Math.floor(Math.random() * 500),
      }))
    )
  }, [])

  // filteredSorteios — sempre declarado aqui (não condicional)
  const filteredSorteios = useMemo(() => {
    const source = mockSorteios ?? []
    return source.filter((sorteio) => {
      const matchesId = sorteio.id.toString().includes(searchTerm)
      const matchesTitulo = sorteio.titulo
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return matchesId || matchesTitulo
    })
  }, [searchTerm, mockSorteios])

  const totalPages = Math.ceil(filteredSorteios.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSorteios = filteredSorteios.slice(startIndex, endIndex)

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este sorteio?')) {
      console.log('Excluindo sorteio:', id)
    }
  }

  // --- Render ---
  // Podemos mostrar um placeholder enquanto mockSorteios === null,
  // mas **não** colocamos hooks depois desse return.
  if (!mockSorteios) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Sorteios
              </h2>
              <p className="text-muted-foreground">Carregando sorteios...</p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/criar-sorteio">
                <Plus className="h-4 w-4" />
                Novo Sorteio
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
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Sorteios
            </h2>
            <p className="text-muted-foreground">
              Gerencie todos os sorteios cadastrados
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/criar-sorteio">
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
                  <TableHead>Tickets (Disp./Resg.)</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSorteios.map((sorteio) => (
                  <TableRow key={sorteio.id}>
                    <TableCell className="font-medium">#{sorteio.id}</TableCell>
                    <TableCell>{sorteio.titulo}</TableCell>
                    <TableCell>{sorteio.data}</TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {sorteio.ticketsDisponiveis - sorteio.ticketsResgatados}
                      </span>
                      {' / '}
                      <span className="text-primary font-semibold">
                        {sorteio.ticketsResgatados}
                      </span>
                    </TableCell>
                    <TableCell>{sorteio.participantes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/sorteio/${sorteio.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(sorteio.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
      </div>
    </DashboardLayout>
  )
}
