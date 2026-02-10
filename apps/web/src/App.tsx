import { useState } from 'react'

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

                <div className="rounded-xl border bg-card text-card-foreground shadow w-full h-[600px] flex items-center justify-center">
                    <p className="text-muted-foreground">Chat Interface Coming Soon...</p>
                </div>
            </div>
        </div>
    )
}

export default App
