'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchApi } from '@/helpers/fetchApi';
import AiMessageModal from '@/component/AiMessageModal';

type WhatsAppMessage = {
    id: number;
    content: string;
    sender: string;
    recipient: string;
    status: 'pending' | 'failed' | 'success';
    createdAt: string;
    notes?: string | null;
};

type ApiResponse = {
    code: number;
    data: {
        messages: WhatsAppMessage[];
        total: number;
        totalPages: number;
        page: number;
        limit: number;
    };
    message?: string;
};

const STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'success', label: 'Success' }
];

export default function SendBirthdayMessagesWithAiPage() {
    const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [modal, setModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebouncedValue(search, 300);

    const fetchMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const qs = new URLSearchParams({
                search: debouncedSearch,
                page: String(page),
                limit: String(limit),
                status
            });

            const res: ApiResponse = await fetchApi(`/api/whatsapp/message-list-ai?${qs.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            // kalau API kamu masih res.data[0], ubah ke:
            // const data = res.data[0];
            const data = res.data;
            console.log(data);
            setMessages(data.messages);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch messages');
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, limit, page, status]);

    // fetch saat param berubah
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // reset page ke 1 kalau filter/search/limit berubah
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, limit]);

    // refetch saat modal ditutup (misal habis kirim pesan)
    useEffect(() => {
        if (!modal) {
            fetchMessages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modal]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchMessages();
    };

    const showingFrom = useMemo(() => (total === 0 ? 0 : (page - 1) * limit + 1), [page, limit, total]);
    const showingTo = useMemo(() => Math.min(page * limit, total), [page, limit, total]);

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Send Birthday Messages</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Send New Message
                </button>
            </div>

            {/* Filters */}
            <form onSubmit={handleSearchSubmit} className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                    type="text"
                    placeholder="Search by content / recipient / sender"
                    className="border rounded-lg px-3 py-2 text-sm w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    name="status"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>

                <select
                    name="limit"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                >
                    {[5, 10, 20, 50].map((n) => (
                        <option key={n} value={n}>
                            {n} / page
                        </option>
                    ))}
                </select>
            </form>

            {/* Info / Error */}
            {error && (
                <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-md border">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <Th>Content</Th>
                            <Th>Sender</Th>
                            <Th>Recipient</Th>
                            <Th>Status</Th>
                            <Th>Created At</Th>
                            <Th>Notes</Th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <SkeletonRows rows={limit} cols={6} />
                        ) : messages.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center p-6 text-gray-500">
                                    No messages found.
                                </td>
                            </tr>
                        ) : (
                            messages.map((msg) => (
                                <tr key={msg.id} className="border-t hover:bg-gray-50/50">
                                    <Td className="max-w-[400px]">
                                        <span className="line-clamp-3 break-words">{msg.content}</span>
                                    </Td>
                                    <Td>{msg.sender}</Td>
                                    <Td>{msg.recipient}</Td>
                                    <Td>
                                        <StatusBadge status={msg.status} />
                                    </Td>
                                    <Td>{new Date(msg.createdAt).toLocaleString()}</Td>
                                    <Td>{msg.notes ?? '-'}</Td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-2">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{showingFrom}</span>–<span className="font-medium">{showingTo}</span>{' '}
                    of <span className="font-medium">{total}</span> messages
                </div>

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <AiMessageModal open={modal} onClose={() => setModalOpen(false)} />
        </div>
    );
}

/* ----------------------------- Small Components ---------------------------- */

function StatusBadge({ status }: { status: WhatsAppMessage['status'] }) {
    const map: Record<WhatsAppMessage['status'], string> = {
        success: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[status]}`}>
            {status}
        </span>
    );
}

function Pagination({
    page,
    totalPages,
    onPageChange
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    const canPrev = page > 1;
    const canNext = page < totalPages;

    const pages = useMemo(() => {
        const window = 2;
        const start = Math.max(1, page - window);
        const end = Math.min(totalPages, page + window);
        const arr = [];
        for (let p = start; p <= end; p++) arr.push(p);
        return arr;
    }, [page, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-1">
            <button
                className="px-3 py-1.5 bg-gray-200 rounded disabled:opacity-50"
                disabled={!canPrev}
                onClick={() => canPrev && onPageChange(page - 1)}
            >
                Prev
            </button>

            {pages[0] > 1 && (
                <>
                    <PageButton num={1} active={page === 1} onClick={() => onPageChange(1)} />
                    <span className="px-2 text-gray-400">…</span>
                </>
            )}

            {pages.map((p) => (
                <PageButton key={p} num={p} active={page === p} onClick={() => onPageChange(p)} />
            ))}

            {pages[pages.length - 1] < totalPages && (
                <>
                    <span className="px-2 text-gray-400">…</span>
                    <PageButton
                        num={totalPages}
                        active={page === totalPages}
                        onClick={() => onPageChange(totalPages)}
                    />
                </>
            )}

            <button
                className="px-3 py-1.5 bg-gray-200 rounded disabled:opacity-50"
                disabled={!canNext}
                onClick={() => canNext && onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}

function PageButton({
    num,
    active,
    onClick
}: {
    num: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className={`px-3 py-1.5 rounded ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            onClick={onClick}
        >
            {num}
        </button>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {children}
        </th>
    );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <td className={`p-3 align-top ${className}`}>{children}</td>;
}

function SkeletonRows({ rows, cols }: { rows: number; cols: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, r) => (
                <tr key={r} className="border-t">
                    {Array.from({ length: cols }).map((__, c) => (
                        <td key={c} className="p-3">
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

/* ------------------------------- Small Hooks ------------------------------ */

function useDebouncedValue<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
}