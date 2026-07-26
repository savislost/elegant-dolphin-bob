import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard: React.FC = () => (
  <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md mb-8 overflow-hidden">
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="space-y-3 flex-1">
        <div className="h-3 w-48 rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
        <div className="h-10 w-64 rounded-xl bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
        <div className="h-3 w-72 rounded-full bg-neutral-200/60 dark:bg-neutral-800/70 shimmer" />
      </div>
      <div className="flex gap-3">
        <div className="h-14 w-32 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
        <div className="h-14 w-32 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
      </div>
    </div>
    <div className="pt-6 space-y-3">
      <div className="h-3 w-40 rounded-full bg-neutral-200/60 dark:bg-neutral-800/70 shimmer" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-3xl bg-neutral-200/60 dark:bg-neutral-800/70 shimmer" />
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonProgress: React.FC = () => (
  <div className="glass-card rounded-3xl p-6 shadow-sm border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md mb-8 overflow-hidden">
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-2">
        <div className="h-3 w-24 rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
        <div className="h-8 w-40 rounded-xl bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-28 rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
        <div className="h-8 w-24 rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
      </div>
    </div>
    <div className="h-2 w-full rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer mb-6" />
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-7 w-20 rounded-full bg-neutral-200/60 dark:bg-neutral-800/70 shimmer" />
      ))}
    </div>
  </div>
);

export const SkeletonChecklist: React.FC = () => (
  <div className="space-y-6">
    {[0, 1, 2].map((group) => (
      <div
        key={group}
        className="glass-card rounded-3xl p-6 shadow-sm border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
              <div className="h-2 w-20 rounded-full bg-neutral-200/60 dark:bg-neutral-800/70 shimmer" />
            </div>
          </div>
          <div className="h-6 w-10 rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/70 shimmer" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonLoadingState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-8"
  >
    <SkeletonCard />
    <SkeletonProgress />
    <SkeletonChecklist />
  </motion.div>
);
