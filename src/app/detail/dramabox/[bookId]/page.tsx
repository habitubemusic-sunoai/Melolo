"use client";

import { UnifiedErrorDisplay } from "@/components/UnifiedErrorDisplay";
import { useDramaDetail } from "@/hooks/useDramaDetail";
import { Play, Calendar, ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { DramaDetailDirect, DramaDetailResponseLegacy } from "@/types/drama";

// Helper to check if response is new format
function isDirectFormat(data: unknown): data is DramaDetailDirect {
  return data !== null && typeof data === 'object' && 'bookId' in data && 'coverWap' in data;
}

// Helper to check if response is legacy format
function isLegacyFormat(data: unknown): data is DramaDetailResponseLegacy {
  return data !== null && typeof data === 'object' && 'data' in data && (data as DramaDetailResponseLegacy).data?.book !== undefined;
}

export default function DramaBoxDetailPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = params.bookId;
  const router = useRouter();
  const { data, isLoading, error } = useDramaDetail(bookId || "");

  if (isLoading) {
    return <DetailSkeleton />;
  }

  // Handle both new and legacy API formats
  let book: {
    bookId: string;
    bookName: string;
    cover: string;
    chapterCount: number;
    introduction: string;
    tags?: string[];
    shelfTime?: string;
  } | null = null;

  if (isDirectFormat(data)) {
    // New flat format
    book = {
      bookId: data.bookId,
      bookName: data.bookName,
      cover: data.coverWap,
      chapterCount: data.chapterCount,
      introduction: data.introduction,
      tags: data.tags || data.tagV3s?.map(t => t.tagName),
      shelfTime: data.shelfTime,
    };
  } else if (isLegacyFormat(data)) {
    // Legacy nested format
    book = {
      bookId: data.data.book.bookId,
      bookName: data.data.book.bookName,
      cover: data.data.book.cover,
      chapterCount: data.data.book.chapterCount,
      introduction: data.data.book.introduction,
      tags: data.data.book.tags,
      shelfTime: data.data.book.shelfTime,
    };
  }

  if (error || !book) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <UnifiedErrorDisplay 
          title="Drama tidak ditemukan"
          message="Tidak dapat memuat detail drama. Silakan coba lagi atau kembali ke beranda."
          onRetry={() => router.push('/')}
          retryLabel="Kembali ke Beranda"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section with Cover */}
      <div className="relative">
        {/* Background Blur */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={book.cover}
            alt=""
            className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          
          {/* === MULAI RACIKAN 3 TOMBOL === */}
          <div className="flex items-center gap-2 mb-6 w-full max-w-2xl">
            {/* Tombol Beranda */}
            <Link href="/" className="flex-1 bg-[#1877F2] hover:bg-[#166fe5] text-white flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-[13px] shadow-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              Beranda
            </Link>
            
            {/* Tombol Nonton Kembali */}
            <button onClick={() => window.location.reload()} className="flex-[1.2] bg-[#E50914] hover:bg-[#d00812] text-white flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-[13px] shadow-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              Nonton Kembali
            </button>

            {/* Tombol CS */}
            <button onClick={() => {
              alert("Untuk menghubungi CS, silakan klik tombol Lonceng (Notifikasi) di pojok kanan atas layar ya Kak! 🙏");
            }} className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-[13px] shadow-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.335.101.155.451.722.955 1.166.65.57 1.205.753 1.364.84.159.087.253.072.347-.029.094-.101.398-.461.506-.62.108-.159.212-.13.356-.076l2.253 1.061c.144.067.24.101.275.159.034.058.034.332-.11.737z"/></svg>
              CS
            </button>
          </div>
          {/* === AKHIR RACIKAN 3 TOMBOL === */}

          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            {/* Cover */}
            <div className="relative group">
              <img
                src={book.cover}
                alt={book.bookName}
                className="w-full max-w-[300px] mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <Link
                  href={`/watch/dramabox/${book.bookId}`}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Tonton Sekarang
                </Link>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-display gradient-text mb-4">
                  {book.bookName}
                </h1>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Play className="w-4 h-4" />
                    <span>{book.chapterCount} Episode</span>
                  </div>
                  {book.shelfTime && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{book.shelfTime?.split(" ")[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {book.tags && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="glass rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2">Sinopsis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {book.introduction}
                </p>
              </div>

              {/* Watch Button */}
              <Link
                href={`/watch/dramabox/${book.bookId}`}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105 shadow-lg"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Play className="w-5 h-5 fill-current" />
                Mulai Menonton
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-[2/3] w-full max-w-[300px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
