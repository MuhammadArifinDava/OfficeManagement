<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NilaiController extends Controller
{
    public function nilaiRT()
    {
        // Untuk nilai RT menggunakan materi_uji_id 7, tetapi tidak mengikutkan pelajaran_khusus
        $rawScores = DB::table('nilai')
            ->select('nama', 'nisn', 'nama_pelajaran', 'skor')
            ->where('materi_uji_id', 7)
            ->where('nama_pelajaran', '!=', 'Pelajaran Khusus')
            ->orderBy('nama', 'asc')
            ->get();

        // Penggunaan collection diperbolehkan untuk pengolahan data terakhir (grouping)
        $studentReportCards = $rawScores->groupBy('nisn')->map(function ($items) {
            $studentInfo = $items->first();
            $nilaiRt = $items->mapWithKeys(function ($item) {
                // Map nama_pelajaran to lowercase key (e.g., REALISTIC -> realistic)
                return [strtolower($item->nama_pelajaran) => (int) $item->skor];
            });

            return [
                'nama' => $studentInfo->nama,
                'nisn' => $studentInfo->nisn,
                'nilaiRt' => $nilaiRt
            ];
        })->values();

        return response()->json($studentReportCards);
    }

    public function nilaiST()
    {
        /*
         Untuk nilai ST menggunakan materi_uji_id 4
         - pelajaran_id 44 dikali 41.67 (Verbal)
         - pelajaran_id 45 dikali 29.67 (Kuantitatif)
         - pelajaran_id 46 dikali 100 (Penalaran)
         - pelajaran_id 47 dikali 23.81 (Figural)
         - Hasil akhir diurutkan dari total nilai terbesar
        */

        $sqlQuery = "
            SELECT 
                nama, 
                nisn,
                SUM(CASE 
                    WHEN pelajaran_id = 44 THEN skor * 41.67
                    WHEN pelajaran_id = 45 THEN skor * 29.67
                    WHEN pelajaran_id = 46 THEN skor * 100
                    WHEN pelajaran_id = 47 THEN skor * 23.81
                    ELSE 0 
                END) as total,
                SUM(CASE WHEN pelajaran_id = 44 THEN skor * 41.67 ELSE 0 END) as verbal,
                SUM(CASE WHEN pelajaran_id = 45 THEN skor * 29.67 ELSE 0 END) as kuantitatif,
                SUM(CASE WHEN pelajaran_id = 46 THEN skor * 100 ELSE 0 END) as penalaran,
                SUM(CASE WHEN pelajaran_id = 47 THEN skor * 23.81 ELSE 0 END) as figural
            FROM nilai
            WHERE materi_uji_id = 4
            GROUP BY nama, nisn
            ORDER BY total DESC
        ";

        $rawScores = DB::select($sqlQuery);

        $studentRankings = collect($rawScores)->map(function ($scoreData) {
            return [
                'nama' => $scoreData->nama,
                'nisn' => $scoreData->nisn,
                'total' => (float) $scoreData->total,
                'listNilai' => [
                    'verbal' => (float) $scoreData->verbal,
                    'kuantitatif' => (float) $scoreData->kuantitatif,
                    'penalaran' => (float) $scoreData->penalaran,
                    'figural' => (float) $scoreData->figural,
                ]
            ];
        });

        return response()->json($studentRankings);
    }
}
