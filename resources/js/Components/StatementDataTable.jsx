import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';


export default function StatementDataTable({ columns, data, className = "", showSearch = true }) {
    const [search, setSearch] = useState('');

    // Filter data based on search input
    const filteredData = data.filter((row) =>
        columns.some((column) => {
            if (Array.isArray(column.accessor)) {
                // If accessor is an array, check all fields in the array
                return column.accessor.some((key) =>
                    row[key]?.toString().toLowerCase().includes(search.toLowerCase())
                );
            } else {
                // Otherwise, check the single accessor field
                return row[column.accessor]
                    ?.toString()
                    .toLowerCase()
                    .includes(search.toLowerCase());
            }
        })
    );

    return (
        <div className={className}>
            {/* Search Input */}
            {showSearch && (
                <div className="relative mb-4">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Cari..."
                        className="bg-background pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}

            {/* Table */}
            {/* <div className="mb-2 text-sm text-muted-foreground">
                Menunjukkan {filteredData.length} daripada {data.length} baris.
            </div> */}
            
            <div className="overflow-hidden rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.accessor || column.Header}
                                    className="h-10 bg-muted px-4 font-semibold text-foreground"
                                >
                                    {column.Header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.accessor || column.Header}
                                        className="px-4 py-3"
                                    >
                                         {/* Check if the column has a custom Cell property */}
                                         {column.Cell
                                            ? column.Cell({ row }) // Render custom Cell
                                            : row[column.accessor]} {/* Render default accessor */}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {filteredData.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 px-4 text-center text-muted-foreground"
                                >
                                    Tiada data ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                        {/* total row */}
                        <TableRow>
                            <TableCell
                                colSpan={columns.length - 1}
                                className="px-4 py-2 text-right text-lg uppercase font-bold bg-primary text-primary-foreground"
                            >
                                Jumlah
                            </TableCell>
                            <TableCell className="px-4 py-2 text-lg uppercase font-bold text-right bg-primary text-primary-foreground">
                                RM {parseFloat(filteredData.reduce((acc, row) => {
                                    if (row.transaction_type === 'debit') {
                                        acc += parseFloat(row.transaction_amount || 0);
                                    } else if (row.transaction_type === 'credit') {
                                        acc -= parseFloat(row.transaction_amount || 0);
                                    }
                                    return acc;
                                }, 0)).toLocaleString('ms-MY', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

        </div>
    );
}