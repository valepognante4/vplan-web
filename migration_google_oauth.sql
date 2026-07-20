-- ============================================================
-- VPlan — Migración: Soporte para Google OAuth
-- Ejecutar UNA sola vez contra la base de datos vplan_bd
-- ============================================================

-- 1. Agrega google_id: identificador único de Google (sub).
--    Es NULL para usuarios que usan login tradicional.
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- 2. Agrega avatar: URL de la foto de perfil provista por Google.
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);

-- 3. CRÍTICO: Elimina la restricción NOT NULL de password_hash.
--    Los usuarios de Google no tienen contraseña propia en VPlan,
--    por lo que el campo se guarda como string vacío ''.
ALTER TABLE usuarios
    ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE usuarios
    ALTER COLUMN password_hash SET DEFAULT '';

-- ============================================================
-- Verificación (opcional): ejecutá esto para confirmar cambios.
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'usuarios'
-- ORDER BY ordinal_position;
-- ============================================================
