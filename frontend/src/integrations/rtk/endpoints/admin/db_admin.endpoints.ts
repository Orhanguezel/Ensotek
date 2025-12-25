// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/db_admin.endpoints.ts
// Ensotek – Admin DB Endpoints (RTK Query)
// Fix: tags + invalidations + consistent typing
// =============================================================

import { baseApi } from '../../baseApi';

import type {
  DbImportResponse,
  SqlImportTextParams,
  SqlImportUrlParams,
  SqlImportFileParams,
  DbSnapshot,
  CreateDbSnapshotBody,
  DeleteSnapshotResponse,
  SqlImportParams,
} from '@/integrations/types/db.types';

export const dbAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /* ---------------------------------------------------------
     * EXPORT SQL: GET /admin/db/export  -> Blob (.sql)
     * --------------------------------------------------------- */
    exportSql: b.mutation<Blob, void>({
      query: () => ({
        url: '/admin/db/export',
        method: 'GET',
        // credentials: 'include', // baseQuery global ise şart değil
        responseHandler: (resp: Response) => resp.arrayBuffer(),
      }),
      transformResponse: (ab: ArrayBuffer) => new Blob([ab], { type: 'application/sql' }),
    }),

    /* ---------------------------------------------------------
     * EXPORT JSON: GET /admin/db/export?format=json  -> Blob (.json)
     * --------------------------------------------------------- */
    exportJson: b.mutation<Blob, void>({
      query: () => ({
        url: '/admin/db/export',
        method: 'GET',
        params: { format: 'json' },
        // credentials: 'include',
        responseHandler: (resp: Response) => resp.arrayBuffer(),
      }),
      transformResponse: (ab: ArrayBuffer) => new Blob([ab], { type: 'application/json' }),
    }),

    /* ---------------------------------------------------------
     * IMPORT (TEXT): POST /admin/db/import-sql
     * --------------------------------------------------------- */
    importSqlText: b.mutation<DbImportResponse, SqlImportTextParams>({
      query: (body) => ({
        url: '/admin/db/import-sql',
        method: 'POST',
        body,
      }),
    }),

    /* ---------------------------------------------------------
     * IMPORT (URL): POST /admin/db/import-url
     * --------------------------------------------------------- */
    importSqlUrl: b.mutation<DbImportResponse, SqlImportUrlParams>({
      query: (body) => ({
        url: '/admin/db/import-url',
        method: 'POST',
        body,
      }),
    }),

    /* ---------------------------------------------------------
     * IMPORT (FILE): POST /admin/db/import-file (multipart)
     * --------------------------------------------------------- */
    importSqlFile: b.mutation<DbImportResponse, SqlImportFileParams>({
      query: ({ file, truncateBefore }) => {
        const form = new FormData();
        form.append('file', file, file.name);

        if (typeof truncateBefore !== 'undefined') {
          form.append('truncateBefore', String(!!truncateBefore));
          form.append('truncate_before_import', String(!!truncateBefore)); // legacy
        }

        return {
          url: '/admin/db/import-file',
          method: 'POST',
          body: form,
        };
      },
    }),

    /* ---------------------------------------------------------
     * (GERİYE DÖNÜK ALIAS) importSql -> /admin/db/import-file
     * --------------------------------------------------------- */
    importSql: b.mutation<DbImportResponse, { file: File } & Partial<SqlImportParams>>({
      query: ({ file, truncate_before_import }) => {
        const form = new FormData();
        form.append('file', file, file.name);

        if (typeof truncate_before_import !== 'undefined') {
          form.append('truncateBefore', String(!!truncate_before_import));
          form.append('truncate_before_import', String(!!truncate_before_import));
        }

        return {
          url: '/admin/db/import-file',
          method: 'POST',
          body: form,
        };
      },
    }),

    /* ---------------------------------------------------------
     * SNAPSHOT LIST: GET /admin/db/snapshots
     * --------------------------------------------------------- */
    listDbSnapshots: b.query<DbSnapshot[], void>({
      query: () => ({
        url: '/admin/db/snapshots',
        method: 'GET',
      }),
      providesTags: (res) =>
        res && res.length
          ? [
              { type: 'DbSnapshot' as const, id: 'LIST' },
              ...res.map((s) => ({ type: 'DbSnapshot' as const, id: s.id })),
            ]
          : [{ type: 'DbSnapshot' as const, id: 'LIST' }],
    }),

    /* ---------------------------------------------------------
     * SNAPSHOT CREATE: POST /admin/db/snapshots
     * --------------------------------------------------------- */
    createDbSnapshot: b.mutation<DbSnapshot, CreateDbSnapshotBody | void>({
      query: (body) => ({
        url: '/admin/db/snapshots',
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: [{ type: 'DbSnapshot' as const, id: 'LIST' }],
    }),

    /* ---------------------------------------------------------
     * SNAPSHOT RESTORE: POST /admin/db/snapshots/:id/restore
     * --------------------------------------------------------- */
    restoreDbSnapshot: b.mutation<
      DbImportResponse,
      { id: string; dryRun?: boolean; truncateBefore?: boolean }
    >({
      query: ({ id, dryRun, truncateBefore }) => ({
        url: `/admin/db/snapshots/${encodeURIComponent(id)}/restore`,
        method: 'POST',
        body: {
          truncateBefore: truncateBefore ?? true,
          dryRun: dryRun ?? false,
        },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'DbSnapshot' as const, id: 'LIST' },
        { type: 'DbSnapshot' as const, id: arg.id },
      ],
    }),

    /* ---------------------------------------------------------
     * SNAPSHOT DELETE: DELETE /admin/db/snapshots/:id
     * --------------------------------------------------------- */
    deleteDbSnapshot: b.mutation<DeleteSnapshotResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/db/snapshots/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'DbSnapshot' as const, id: 'LIST' },
        { type: 'DbSnapshot' as const, id: arg.id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useExportSqlMutation,
  useExportJsonMutation,
  useImportSqlTextMutation,
  useImportSqlUrlMutation,
  useImportSqlFileMutation,
  useImportSqlMutation,

  useListDbSnapshotsQuery,
  useCreateDbSnapshotMutation,
  useRestoreDbSnapshotMutation,
  useDeleteDbSnapshotMutation,
} = dbAdminApi;
