import SorteioClient from './sorteio-client'

export default function SorteioPage({ params }: { params: { id: string } }) {
  const { id } = params
  return <SorteioClient id={id} />
}
