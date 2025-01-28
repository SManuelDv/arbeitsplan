import { Button } from '@/components/Button'

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="space-y-4">
        <Button
          text="Clique Aqui"
          variant="primary"
          onClick={() => alert('Botão clicado!')}
        />
        <Button text="Secundário" variant="secondary" />
      </div>
    </div>
  )
}

export default App
// teste
