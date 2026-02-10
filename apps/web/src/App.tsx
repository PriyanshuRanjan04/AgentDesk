import { ChatInterface } from '@/components/chat-interface'

function App() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                    AgentDesk
                </h1>
                <p className="text-lg text-muted-foreground">
                    AI-Powered Customer Support System
                </p>

                <ChatInterface />
            </div>
        </div>
    )
}

export default App
