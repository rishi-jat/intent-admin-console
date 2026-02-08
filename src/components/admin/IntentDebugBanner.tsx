/**
 * @file IntentDebugBanner.tsx
 * @description Debug banner showing intent classification for reviewers
 *
 * This component is for REVIEWER VISIBILITY only.
 * It shows which intent was detected and which components are allowed.
 */

"use client";

import { cn } from "@/lib/utils";
import { IntentCategory } from "@/tambo/intentPolicy";
import type { ClassificationResult } from "@/tambo/intentClassifier";
import * as React from "react";

interface IntentDebugBannerProps {
  classification: ClassificationResult | null;
  className?: string;
}

const INTENT_LABELS: Record<IntentCategory, { label: string; color: string }> = {
  [IntentCategory.DEPLOYMENT_MONITORING]: {
    label: "DEPLOYMENT_MONITORING",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  [IntentCategory.DEPLOYMENT_FAILURES]: {
    label: "DEPLOYMENT_FAILURES",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  [IntentCategory.OPERATIONAL_APPROVALS]: {
    label: "OPERATIONAL_APPROVALS",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  [IntentCategory.SYSTEM_HEALTH]: {
    label: "SYSTEM_HEALTH",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  [IntentCategory.UNSUPPORTED]: {
    label: "UNSUPPORTED",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
};

export function IntentDebugBanner({
  classification,
  className,
}: IntentDebugBannerProps) {
  if (!classification) return null;

  const intentConfig = INTENT_LABELS[classification.detectedIntent];

  return (
    <div
      className={cn(
        "text-xs font-mono border-b border-dashed border-gray-300 dark:border-gray-700",
        "px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-gray-500 dark:text-gray-400">Intent:</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold",
            intentConfig.color
          )}
        >
          {intentConfig.label}
        </span>
        <span className="text-gray-400 dark:text-gray-500">→</span>
        <span className="text-gray-600 dark:text-gray-300">
          Components: [{classification.allowedComponents.join(", ")}]
        </span>
        {classification.matchedPattern && (
          <>
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <span className="text-gray-500 dark:text-gray-400 truncate max-w-xs">
              Pattern: /{classification.matchedPattern}/
            </span>
          </>
        )}
      </div>
    </div>
  );
}
