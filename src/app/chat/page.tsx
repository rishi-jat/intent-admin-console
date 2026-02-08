"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

/**
 * Admin Console - Intent-Driven UI
 *
 * This page provides the main chat interface for the admin console.
 * Users express intent in natural language and the UI responds with
 * appropriate components rather than text explanations.
 *
 * Supported intents:
 * - Deployment monitoring
 * - Deployment failures
 * - Operational approvals
 * - System health overview
 */
export default function AdminConsolePage() {
  // Load MCP server configurations
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      contextKey="admin-console"
    >
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border px-4 py-3 bg-background/95 backdrop-blur">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Admin Console
              </h1>
              <p className="text-sm text-muted-foreground">
                Express your intent to manage deployments, approvals, and system health
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                ● Connected
              </span>
            </div>
          </div>
        </header>

        {/* Main chat interface */}
        <main className="flex-1 overflow-hidden">
          <MessageThreadFull className="max-w-4xl mx-auto" />
        </main>
      </div>
    </TamboProvider>
  );
}
