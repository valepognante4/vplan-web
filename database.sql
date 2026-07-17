-- ============================================================
-- VPlan — Schema de Base de Datos
-- ============================================================

-- Tabla de Usuarios (debe crearse ANTES que tareas por la FK)
CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(100)        NOT NULL,
    email         VARCHAR(255)        NOT NULL UNIQUE,
    password_hash VARCHAR(255)        NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Tareas
CREATE TABLE IF NOT EXISTS tareas (
    id                SERIAL PRIMARY KEY,
    titulo            VARCHAR(100)    NOT NULL,
    descripcion       TEXT,
    prioridad         VARCHAR(20),             -- 'ALTA', 'MEDIA', 'BAJA'
    estado            VARCHAR(20)     DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'COMPLETADA'
    fecha_vencimiento DATE,
    usuario_id        INTEGER         REFERENCES usuarios(id) ON DELETE CASCADE
);