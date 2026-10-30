import { useState } from 'react';
import {
  Download,
  FileDown,
  FileText,
  ExternalLink,
  Check,
  Search,
  Sparkles,
  FolderDown,
  Layers,
  Code2,
  Cpu,
  BookOpen,
  ArrowDownToLine,
  CheckCircle2,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface SampleFile {
  id: string;
  title: string;
  originalFilename: string;
  url: string;
  size: string;
  pages: number;
  category: 'Supervised' | 'Unsupervised' | 'Probabilistic';
  algorithm: string;
  description: string;
  tags: string[];
  gradient: string;
}

export const SAMPLE_FILES: SampleFile[] = [
  {
    id: 'decision-tree',
    title: 'Decision Tree Classifier Guide',
    originalFilename: 'dt (1).pdf',
    url: '/sample/dt (1).pdf',
    size: '216 KB',
    pages: 4,
    category: 'Supervised',
    algorithm: 'Decision Tree',
    description:
      'End-to-end Python implementation with Scikit-learn: dataset import from UCI repository, LabelEncoder categorical transformation, DecisionTreeClassifier modeling, and confusion matrix evaluation.',
    tags: ['Scikit-Learn', 'Classification', 'LabelEncoder', 'Confusion Matrix'],
    gradient: 'from-emerald-500/20 to-teal-500/10 text-emerald-700 dark:text-emerald-400',
  },
  {
    id: 'kmeans-clustering',
    title: 'K-Means Clustering & Code',
    originalFilename: 'kmeans. code.pdf',
    url: '/sample/kmeans. code.pdf',
    size: '277 KB',
    pages: 3,
    category: 'Unsupervised',
    algorithm: 'K-Means',
    description:
      'Unsupervised customer segmentation workflow using the Bank Marketing dataset. Features StandardScaler normalization, elbow curve optimization, and Seaborn cluster scatter plots.',
    tags: ['K-Means', 'Unsupervised', 'StandardScaler', 'Seaborn & Matplotlib'],
    gradient: 'from-amber-500/20 to-orange-500/10 text-amber-700 dark:text-amber-400',
  },
  {
    id: 'knn-classifier',
    title: 'K-Nearest Neighbors (KNN)',
    originalFilename: 'knn (1).pdf',
    url: '/sample/knn (1).pdf',
    size: '267 KB',
    pages: 3,
    category: 'Supervised',
    algorithm: 'KNN',
    description:
      'Practical KNN classifier notebook. Details train/test splits, feature standardization, hyperparameter k selection, accuracy metrics, and comprehensive classification reports.',
    tags: ['K-NN', 'Supervised', 'Feature Scaling', 'Model Evaluation'],
    gradient: 'from-blue-500/20 to-indigo-500/10 text-blue-700 dark:text-blue-400',
  },
  {
    id: 'naive-bayes',
    title: 'Naive Bayes Classifier',
    originalFilename: 'naviesbayes.pdf',
    url: '/sample/naviesbayes.pdf',
    size: '271 KB',
    pages: 4,
    category: 'Probabilistic',
    algorithm: 'Naive Bayes',
    description:
      'Probabilistic pattern classification notebook using Gaussian Naive Bayes. Covers multi-class prediction probabilities, confusion matrix plotting, and test accuracy benchmarking.',
    tags: ['GaussianNB', 'Probabilistic AI', 'Confusion Matrix', 'Scikit-Learn'],
    gradient: 'from-purple-500/20 to-pink-500/10 text-purple-700 dark:text-purple-400',
  },
  {
    id: 'svm-classifier',
    title: 'Support Vector Machine (SVM)',
    originalFilename: 'svm (1).pdf',
    url: '/sample/svm (1).pdf',
    size: '322 KB',
    pages: 4,
    category: 'Supervised',
    algorithm: 'SVM',
    description:
      'Advanced Support Vector Classifier (SVC) implementation. Demonstrates kernel tricks, margin optimization, and decision boundary visualization using the mlxtend library.',
    tags: ['SVC', 'mlxtend', 'Decision Boundary', 'Kernel Trick'],
    gradient: 'from-rose-500/20 to-red-500/10 text-rose-700 dark:text-rose-400',
  },
];

type DownloadState = 'idle' | 'downloading' | 'done' | 'error';

export function DownloadsSection() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadStates, setDownloadStates] = useState<Record<string, DownloadState>>({});
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [batchProgress, setBatchProgress] = useState<string>('');

  const triggerDownload = async (file: SampleFile): Promise<boolean> => {
    setDownloadStates((prev) => ({ ...prev, [file.id]: 'downloading' }));

    try {
      // Use properly encoded URL to ensure spaces & parentheses resolve
      const encodedUrl = `/sample/${encodeURIComponent(file.originalFilename)}`;
      const response = await fetch(encodedUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = file.originalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);

      setDownloadStates((prev) => ({ ...prev, [file.id]: 'done' }));
      setTimeout(() => {
        setDownloadStates((prev) => ({ ...prev, [file.id]: 'idle' }));
      }, 3000);
      return true;
    } catch (err) {
      console.warn('Fetch blob download fallback to direct anchor:', err);
      // Fallback: direct anchor with download attribute
      const encodedUrl = `/sample/${encodeURIComponent(file.originalFilename)}`;
      const link = document.createElement('a');
      link.href = encodedUrl;
      link.download = file.originalFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadStates((prev) => ({ ...prev, [file.id]: 'done' }));
      setTimeout(() => {
        setDownloadStates((prev) => ({ ...prev, [file.id]: 'idle' }));
      }, 2500);
      return true;
    }
  };

  const handleDownload = async (file: SampleFile, e?: React.MouseEvent) => {
    // If clicked on an interactive child that handled it, stop propagation
    if (e) {
      e.stopPropagation();
    }

    toast({
      title: 'Downloading sample file',
      description: `Saving "${file.originalFilename}" (${file.size}) to your computer...`,
    });

    await triggerDownload(file);
  };

  const handleDownloadAll = async () => {
    if (isDownloadingAll) return;
    setIsDownloadingAll(true);

    toast({
      title: 'Downloading all sample files',
      description: `Starting sequential download for all ${SAMPLE_FILES.length} sample resources...`,
    });

    for (let i = 0; i < SAMPLE_FILES.length; i++) {
      const file = SAMPLE_FILES[i];
      setBatchProgress(`Downloading file ${i + 1} of ${SAMPLE_FILES.length}: ${file.title}`);
      await triggerDownload(file);
      // Brief pause between files to prevent browser download queue throttling
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setIsDownloadingAll(false);
    setBatchProgress('');

    toast({
      title: 'Download complete!',
      description: `All ${SAMPLE_FILES.length} files from the sample repository have been downloaded.`,
    });
  };

  const categories = ['All', 'Supervised', 'Unsupervised', 'Probabilistic'];

  const filteredFiles = SAMPLE_FILES.filter((file) => {
    const matchesCategory =
      selectedCategory === 'All' || file.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesSearch =
      file.title.toLowerCase().includes(query) ||
      file.originalFilename.toLowerCase().includes(query) ||
      file.algorithm.toLowerCase().includes(query) ||
      file.description.toLowerCase().includes(query) ||
      file.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="downloads" className="relative scroll-mt-12 border-t border-border/80 bg-background/60 py-20 sm:py-24">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-72 w-full max-w-4xl bg-primary/5 blur-3xl rounded-full" />

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
              <FolderDown size={14} />
              <span className="font-mono-ui text-[11px] font-semibold uppercase tracking-[.16em]">
                Pre-stored Sample Downloads
              </span>
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="font-mono-ui text-[11px] font-semibold">{SAMPLE_FILES.length} Files Ready</span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Machine Learning &amp; AI <span className="text-primary">Sample Notebooks.</span>
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Pre-stored practical code guides and algorithm implementations directly from our{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono-ui text-xs font-semibold text-foreground">
                sample/
              </code>{' '}
              directory. Click any file or its download button to immediately save it to your machine.
            </p>
          </div>

          {/* Download All CTA */}
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center md:flex-col md:items-end">
            <button
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              data-testid="button-download-all"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-ring disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isDownloadingAll ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Downloading all files...</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine size={16} className="transition-transform group-hover:translate-y-0.5" />
                  <span>Download All ({SAMPLE_FILES.length} Files)</span>
                </>
              )}
            </button>
            {batchProgress && (
              <p className="text-xs font-mono-ui text-primary animate-pulse">{batchProgress}</p>
            )}
            <span className="text-xs text-muted-foreground">Free instant downloads · No signup required</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const count =
                category === 'All'
                  ? SAMPLE_FILES.length
                  : SAMPLE_FILES.filter((f) => f.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-ring ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 font-mono-ui text-[10px] ${
                      isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search algorithm, topic, or file..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* File Cards Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => {
            const state = downloadStates[file.id] || 'idle';
            const isDownloading = state === 'downloading';
            const isDone = state === 'done';

            return (
              <div
                key={file.id}
                role="button"
                tabIndex={0}
                onClick={(e) => handleDownload(file, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDownload(file);
                  }
                }}
                data-testid={`card-download-${file.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg cursor-pointer focus-ring"
              >
                <div>
                  {/* Card Top: Badges & Size */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <span className="font-mono-ui text-[10px] font-bold uppercase tracking-wider text-primary">
                          {file.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="font-medium">{file.size}</span>
                          <span>•</span>
                          <span>{file.pages} pages</span>
                        </div>
                      </div>
                    </div>

                    <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono-ui text-[10px] text-muted-foreground">
                      PDF
                    </span>
                  </div>

                  {/* Title & Filename */}
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {file.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-[11px] font-mono-ui text-muted-foreground">
                    <FolderDown size={11} className="text-primary/70 shrink-0" />
                    <span className="truncate">sample/{file.originalFilename}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-5 text-muted-foreground line-clamp-3">
                    {file.description}
                  </p>

                  {/* Topic Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {file.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted/60 px-2 py-0.5 font-mono-ui text-[10px] text-foreground/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-border/60">
                  <button
                    type="button"
                    onClick={(e) => handleDownload(file, e)}
                    disabled={isDownloading}
                    data-testid={`btn-download-${file.id}`}
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all focus-ring ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isDownloading
                        ? 'bg-primary/80 text-primary-foreground'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : isDone ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <FileDown size={14} className="transition-transform group-hover:translate-y-0.5" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`/sample/${encodeURIComponent(file.originalFilename)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`btn-preview-${file.id}`}
                    title="Open in new tab"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background p-2.5 text-muted-foreground hover:border-primary/40 hover:text-foreground focus-ring transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span className="sr-only">Preview</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredFiles.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center">
            <FileText size={32} className="mx-auto text-muted-foreground/60" />
            <h4 className="mt-3 font-display text-base font-semibold">No sample files found</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              No files matched &quot;{searchQuery}&quot;. Try searching for &quot;tree&quot;, &quot;clustering&quot;, &quot;knn&quot;, or &quot;svm&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Informational Footer Note */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-primary shrink-0" />
            <span>
              All files are stored in the local <code className="font-mono-ui font-semibold text-foreground">sample/</code> folder and served directly.
            </span>
          </div>
          <span className="font-mono-ui text-[11px] text-muted-foreground/80">
            Click any file or button to download immediately
          </span>
        </div>
      </div>
    </section>
  );
}
