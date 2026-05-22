import type { FastifyInstance } from "fastify";
import {
  adminExportSql,
  adminImportSqlText,
  adminImportSqlFromUrl,
  adminImportSqlFromFile,
  adminListDbSnapshots,
  adminCreateDbSnapshot,
  adminRestoreDbSnapshot,
  adminDeleteDbSnapshot,
} from "./admin.controller";
import { buildModuleExportImport } from "./moduleExportImport.controller";
import { buildModuleValidation } from "./moduleValidation.controller";
import type { ModuleMap } from "./types";

export function createDbAdminRoutes(modules: ModuleMap) {
  const moduleIO = buildModuleExportImport(modules);
  const moduleVal = buildModuleValidation(modules);

  return async function registerDbAdmin(app: FastifyInstance) {
    const B = "/db";

    // Full DB
    app.get(`${B}/export`, adminExportSql);
    app.post(`${B}/import-sql`, adminImportSqlText);
    app.post(`${B}/import-url`, adminImportSqlFromUrl);
    app.post(`${B}/import-file`, adminImportSqlFromFile);

    // Module export/import
    app.get(`${B}/export-module`, moduleIO.adminExportModuleSql);
    app.post(`${B}/import-module`, moduleIO.adminImportModuleSql);

    // Site settings bulk UI ops
    app.get(`${B}/site-settings/ui-export`, moduleIO.adminExportSiteSettingsUiJson);
    app.post(`${B}/site-settings/ui-bootstrap`, moduleIO.adminBootstrapSiteSettingsUiLocale);

    // Manifest validation
    app.get(`${B}/modules/validate`, moduleVal.adminValidateModuleManifest);

    // Snapshots
    app.get(`${B}/snapshots`, adminListDbSnapshots);
    app.post(`${B}/snapshots`, adminCreateDbSnapshot);
    app.post(`${B}/snapshots/:id/restore`, adminRestoreDbSnapshot);
    app.delete(`${B}/snapshots/:id`, adminDeleteDbSnapshot);
  };
}
