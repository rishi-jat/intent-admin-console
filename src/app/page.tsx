import { ApiKeyCheck } from "@/components/ApiKeyCheck";

const SupportedIntentsSection = () => (
  <div className="bg-white px-8 py-4 rounded-lg border border-gray-200">
    <h2 className="text-xl font-semibold mb-4">Supported Intents</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">📊 Deployment Monitoring</h3>
        <p className="text-sm text-gray-600">
          "Show recent deployments", "What deployed to production?"
        </p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">❌ Deployment Failures</h3>
        <p className="text-sm text-gray-600">
          "Show failed deployments", "What's broken?"
        </p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">✅ Operational Approvals</h3>
        <p className="text-sm text-gray-600">
          "Show pending approvals", "What needs my authorization?"
        </p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">💚 System Health</h3>
        <p className="text-sm text-gray-600">
          "Show system status", "Any services down?"
        </p>
      </div>
    </div>
  </div>
);

const ArchitectureSection = () => (
  <div className="bg-white px-8 py-4 rounded-lg border border-gray-200">
    <h2 className="text-xl font-semibold mb-4">Architecture</h2>
    <pre className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg overflow-x-auto">
{`User Input
    ↓
Intent Classification
    ↓
Tool Invocation (data fetch)
    ↓
Component Rendering (validated props)
    ↓
Interactive UI`}
    </pre>
    <p className="text-sm text-gray-500 mt-4">
      The chat input is an intent capture mechanism. UI components are the primary response.
    </p>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-2xl w-full space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-3xl">🎛️</span>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Intent-Driven Admin Console
          </h1>
          <p className="text-gray-600 text-center mt-2 max-w-md">
            Express intent in natural language. The UI components themselves are the response.
          </p>
        </div>

        <div className="w-full space-y-6">
          <div className="bg-white px-8 py-4 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
            <ApiKeyCheck>
              <div className="flex gap-4 flex-wrap">
                <a
                  href="/chat"
                  className="px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Open Admin Console →
                </a>
              </div>
            </ApiKeyCheck>
          </div>

          <SupportedIntentsSection />
          <ArchitectureSection />
        </div>
      </main>
    </div>
  );
}
