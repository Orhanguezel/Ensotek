export type ModuleManifest = {
  tablesInOrder: string[];
  truncateInOrder?: string[];
  allowSchema?: false;
  note?: string;
};

export type ModuleMap<K extends string = string> = Record<K, ModuleManifest>;

export type DbSnapshotMeta = {
  id: string;
  filename: string;
  label?: string | null;
  note?: string | null;
  created_at: string;
  size_bytes?: number | null;
};
