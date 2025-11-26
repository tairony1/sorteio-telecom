import { Ticket, TrendingUp, Trophy, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/layouts/dashboard-layout'

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

const statsData = [
  {
    title: 'Sorteios Ativos',
    value: '12',
    icon: Trophy,
    color: 'text-emerald-600',
  },
  {
    title: 'Participantes',
    value: '1,234',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Tickets Resgatados',
    value: '5,678',
    icon: Ticket,
    color: 'text-purple-600',
  },
  {
    title: 'Taxa de Conversão',
    value: '78%',
    icon: TrendingUp,
    color: 'text-orange-600',
  },
]

const accessData = [
  { name: 'Desktop', value: 450 },
  { name: 'Mobile', value: 620 },
  { name: 'Tablet', value: 164 },
]

const monthlyData = [
  { mes: 'Jan', sorteios: 8, participantes: 890 },
  { mes: 'Fev', sorteios: 10, participantes: 1020 },
  { mes: 'Mar', sorteios: 12, participantes: 1234 },
  { mes: 'Abr', sorteios: 9, participantes: 980 },
  { mes: 'Mai', sorteios: 11, participantes: 1150 },
  { mes: 'Jun', sorteios: 12, participantes: 1234 },
]

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Visão geral do sistema de sorteios
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sorteios" fill="hsl(var(--chart-1))" name="Sorteios" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="participantes" fill="hsl(var(--chart-2))" name="Participantes" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer> */}
          </CardContent>
        </Card>

        {/* Device Access Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Acesso por Dispositivo</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {/* <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accessData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--chart-1))"
                    dataKey="value"
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {accessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--card))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer> */}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                text: "Novo sorteio 'Prêmio de Verão' criado",
                time: 'Há 2 horas',
              },
              {
                text: 'Cliente João Silva resgatou 5 tickets',
                time: 'Há 3 horas',
              },
              {
                text: "Sorteio 'Natal Especial' finalizado",
                time: 'Há 5 horas',
              },
              {
                text: '50 novos participantes registrados',
                time: 'Há 1 dia',
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0"
              >
                <p className="text-sm text-foreground">{activity.text}</p>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
