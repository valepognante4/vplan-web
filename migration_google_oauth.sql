-- ============================================================
-- VPlan — Migración: Soporte para Google OAuth
-- Ejecutar UNA sola vez contra la base de datos vplan_bd
-- ============================================================

-- Agrega la columna google_id (valor único, puede ser NULL para
-- usuarios que solo usan login tradicional con contraseña)
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- Agrega la columna avatar para guardar la foto de perfil de Google
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);

-- Permite que password_hash sea vacío ('') para usuarios de Google
-- (ya no tiene la restricción NOT NULL implícita de la inserción original)
-- Si tu columna tiene un CHECK o NOT NULL estricto, ejecutá también:
-- ALTER TABLE usuarios ALTER COLUMN password_hash DROP NOT NULL;
-- (En el schema original no hay CHECK, solo NOT NULL. Lo relajamos:)
ALTER TABLE usuarios
    ALTER COLUMN password_hash SET DEFAULT '';
