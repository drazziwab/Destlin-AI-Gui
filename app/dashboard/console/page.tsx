"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { ArrowLeft, Terminal, X, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function ConsolePage() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<{ type: "input" | "output"; content: string }[]>([
    { type: "output", content: 'NEXUS OS Terminal v1.0.0\nType "help" for available commands.\n' },
  ])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const consoleEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Scroll to the bottom when history changes
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [history])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add the input to history
    setHistory([...history, { type: "input", content: input }])

    // Process the command
    processCommand(input)

    // Clear the input
    setInput("")
  }

  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()
    let output = ""

    switch (command) {
      case "help":
        output = `
Available commands:
  help        - Show this help message
  clear       - Clear the console
  status      - Show system status
  ls          - List files in current directory
  cd          - Change directory
  cat         - View file contents
  exit        - Return to dashboard
  version     - Show system version
  whoami      - Show current user
  date        - Show current date and time
`
        break
      case "clear":
        setHistory([{ type: "output", content: 'NEXUS OS Terminal v1.0.0\nType "help" for available commands.\n' }])
        return
      case "status":
        output = `
System Status:
  CPU: 32% utilized
  Memory: 4.2GB / 16GB
  Disk: 234GB / 512GB
  Network: 12.5 Mbps down / 5.2 Mbps up
  Processes: 42 running
  Uptime: 14d 06:42:18
`
        break
      case "ls":
        output = `
Directory listing:
  documents/
  images/
  tools/
  system/
  config.json
  readme.md
  .env
`
        break
      case "cd":
        output = "Usage: cd <directory>\nMissing directory argument."
        break
      case "cat":
        output = "Usage: cat <filename>\nMissing filename argument."
        break
      case "exit":
        router.push("/dashboard")
        return
      case "version":
        output = "NEXUS OS v1.0.0 (build 20230429)"
        break
      case "whoami":
        output = "admin@nexos.com (Administrator)"
        break
      case "date":
        output = new Date().toString()
        break
      default:
        if (command.startsWith("cd ")) {
          const dir = command.substring(3)
          output = `Changed directory to: ${dir}`
        } else if (command.startsWith("cat ")) {
          const file = command.substring(4)
          if (file === "readme.md") {
            output = `
# NEXUS OS

Welcome to the NEXUS Operating System.
This advanced system provides monitoring, security, and management capabilities.

## Features
- Real-time system monitoring
- Advanced security protocols
- File management
- Communication tools
- AI integration

For more information, contact system administrator.
`
          } else if (file === "config.json") {
            output = `
{
  "system": {
    "name": "NEXUS OS",
    "version": "1.0.0",
    "build": "20230429",
    "theme": "dark"
  },
  "security": {
    "level": "high",
    "firewall": true,
    "encryption": true,
    "autoUpdate": true
  },
  "network": {
    "hostname": "nexus-main",
    "domain": "nexos.local",
    "dhcp": true
  }
}
`
          } else {
            output = `File not found: ${file}`
          }
        } else {
          output = `Command not found: ${command}\nType "help" for available commands.`
        }
    }

    setHistory((prev) => [...prev, { type: "output", content: output }])
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <ProtectedRoute>
      <div className={`container mx-auto p-4 relative z-10 ${isFullscreen ? "fixed inset-0 bg-black" : ""}`}>
        <Card
          className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden ${isFullscreen ? "h-full" : ""}`}
        >
          <CardHeader className="border-b border-slate-700/50 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {!isFullscreen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 text-slate-400 hover:text-slate-100"
                    onClick={() => router.push("/dashboard")}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <CardTitle className="text-slate-100 flex items-center">
                  <Terminal className="mr-2 h-5 w-5 text-cyan-500" />
                  System Console
                </CardTitle>
                <Badge variant="outline" className="ml-2 bg-slate-800/50 text-cyan-400 border-cyan-500/50">
                  v1.0.0
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-100"
                  onClick={() =>
                    setHistory([
                      { type: "output", content: 'NEXUS OS Terminal v1.0.0\nType "help" for available commands.\n' },
                    ])
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-100"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={`p-0 ${isFullscreen ? "h-[calc(100%-4rem)]" : "h-[60vh]"}`}>
            <div className="bg-black h-full flex flex-col">
              <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                {history.map((item, index) => (
                  <div key={index} className="mb-2">
                    {item.type === "input" ? (
                      <div>
                        <span className="text-cyan-500">nexos@admin:~$</span>{" "}
                        <span className="text-slate-100">{item.content}</span>
                      </div>
                    ) : (
                      <pre className="text-slate-300 whitespace-pre-wrap">{item.content}</pre>
                    )}
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="border-t border-slate-800 p-2 flex">
                <span className="text-cyan-500 font-mono text-sm mr-2 pt-2">nexos@admin:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none text-slate-100 font-mono text-sm focus:outline-none focus:ring-0"
                  autoFocus
                />
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
