/**
 * @file SystemStatusSummary.tsx
 * @description High-level system health overview component
 *
 * Displays health indicators for services including uptime,
 * latency, error rates, and overall system status.
 */

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { systemHealthSchema, type HealthStatus, type SystemHealth } from "./types";

// -----------------------------------------------------------------------------
// Schema Definition
// -----------------------------------------------------------------------------

export const systemStatusSummarySchema = z.object({
  services: z.array(systemHealthSchema).describe("Array of service health data"),
  title: z.string().optional().describe("Optional summary title"),
  showMetrics: z.boolean().optional().describe("Whether to show detailed metrics"),
});

export type SystemStatusSummaryProps = z.infer<typeof systemStatusSummarySchema>;

// -----------------------------------------------------------------------------
// Status Configuration
// -----------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  HealthStatus,
  { label: string; className: string; bgClassName: string; icon: string }
> = {
  healthy: {
    label: "Healthy",
    className: "text-green-600 dark:text-green-400",
    bgClassName: "bg-green-500",
    icon: "●",
  },
  degraded: {
    label: "Degraded",
    className: "text-yellow-600 dark:text-yellow-400",
    bgClassName: "bg-yellow-500",
    icon: "◐",
  },
  down: {
    label: "Down",
    className: "text-red-600 dark:text-red-400",
    bgClassName: "bg-red-500",
    icon: "○",
  },
  unknown: {
    label: "Unknown",
    className: "text-gray-500",
    bgClassName: "bg-gray-400",
    icon: "?",
  },
};

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

function formatUptime(percentage: number): string {
  return `${percentage.toFixed(2)}%`;
}

function formatLatency(ms: number | undefined): string {
  if (ms === undefined) return "-";
  if (ms < 1) return "<1ms";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatErrorRate(rate: number | undefined): string {
  if (rate === undefined) return "-";
  if (rate < 0.01) return "<0.01%";
  return `${rate.toFixed(2)}%`;
}

function formatLastChecked(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoString;
  }
}

function getOverallStatus(services: SystemHealth[]): HealthStatus {
  if (services.length === 0) return "unknown";
  
  const hasDown = services.some((s) => s.status === "down");
  if (hasDown) return "down";
  
  const hasDegraded = services.some((s) => s.status === "degraded");
  if (hasDegraded) return "degraded";
  
  const allHealthy = services.every((s) => s.status === "healthy");
  if (allHealthy) return "healthy";
  
  return "unknown";
}

// -----------------------------------------------------------------------------
// Service Card Component
// -----------------------------------------------------------------------------

interface ServiceCardProps {
  service: SystemHealth;
  showMetrics: boolean;
}

function ServiceCard({ service, showMetrics }: ServiceCardProps) {
  const statusConfig = STATUS_CONFIG[service.status] ?? STATUS_CONFIG.unknown;

  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:bg-muted/20 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-foreground">{service.service}</h4>
        <div className="flex items-center gap-1.5">
          <span className={cn("text-sm", statusConfig.className)}>
            {statusConfig.icon}
          </span>
          <span className={cn("text-xs font-medium", statusConfig.className)}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {showMetrics && (
        <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Uptime</div>
            <div className="font-medium tabular-nums">
              {formatUptime(service.uptime)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Latency</div>
            <div className="font-medium tabular-nums">
              {formatLatency(service.latency)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Error Rate</div>
            <div
              className={cn(
                "font-medium tabular-nums",
                service.errorRate && service.errorRate > 1 && "text-red-600 dark:text-red-400"
              )}
            >
              {formatErrorRate(service.errorRate)}
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-muted-foreground">
        Last checked: {formatLastChecked(service.lastChecked)}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Overall Status Banner Component
// -----------------------------------------------------------------------------

interface OverallStatusBannerProps {
  status: HealthStatus;
  serviceCount: number;
  healthyCount: number;
}

function OverallStatusBanner({
  status,
  serviceCount,
  healthyCount,
}: OverallStatusBannerProps) {
  const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;

  const getMessage = () => {
    switch (status) {
      case "healthy":
        return "All systems operational";
      case "degraded":
        return "Some systems experiencing issues";
      case "down":
        return "Critical systems down";
      default:
        return "System status unknown";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg p-4 flex items-center justify-between",
        status === "healthy" && "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800",
        status === "degraded" && "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800",
        status === "down" && "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800",
        status === "unknown" && "bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-3 w-3 rounded-full",
            statusConfig.bgClassName,
            status === "healthy" && "animate-pulse"
          )}
        />
        <span className={cn("font-medium", statusConfig.className)}>
          {getMessage()}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        {healthyCount}/{serviceCount} healthy
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const SystemStatusSummary = React.forwardRef<
  HTMLDivElement,
  SystemStatusSummaryProps
>(({ services, title, showMetrics = true }, ref) => {
  if (!services || services.length === 0) {
    return (
      <div
        ref={ref}
        className="border border-border rounded-lg p-6 text-center text-muted-foreground"
      >
        No service health data available.
      </div>
    );
  }

  const overallStatus = getOverallStatus(services);
  const healthyCount = services.filter((s) => s.status === "healthy").length;

  return (
    <div ref={ref} className="space-y-4">
      {/* Title */}
      {title && (
        <h3 className="font-semibold text-foreground">{title}</h3>
      )}

      {/* Overall status banner */}
      <OverallStatusBanner
        status={overallStatus}
        serviceCount={services.length}
        healthyCount={healthyCount}
      />

      {/* Service cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service) => (
          <ServiceCard
            key={service.service}
            service={service}
            showMetrics={showMetrics}
          />
        ))}
      </div>
    </div>
  );
});

SystemStatusSummary.displayName = "SystemStatusSummary";
