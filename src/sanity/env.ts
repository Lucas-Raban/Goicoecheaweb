// El ID del proyecto es público (no es una clave), por eso puede quedar como valor por defecto.
export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "wjn5b9z2";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const sanityApiVersion = "2025-01-01";
