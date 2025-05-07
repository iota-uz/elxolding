-- +migrate Up

-- Change CREATE_TABLE: roles
CREATE TABLE roles (
	id          SERIAL8 PRIMARY KEY,
	type        VARCHAR(50) NOT NULL CHECK (type IN ('system', 'user')),
	name        VARCHAR(255) NOT NULL UNIQUE,
	description TEXT,
	created_at  TIMESTAMPTZ DEFAULT now(),
	updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: warehouse_units
CREATE TABLE warehouse_units (
	id          SERIAL8 PRIMARY KEY,
	title       VARCHAR(255) NOT NULL,
	short_title VARCHAR(255) NOT NULL,
	created_at  TIMESTAMPTZ DEFAULT now(),
	updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: uploads
CREATE TABLE uploads (
	id         SERIAL8 PRIMARY KEY,
	name       VARCHAR(255) NOT NULL,
	hash       VARCHAR(255) NOT NULL UNIQUE,
	path       VARCHAR(1024) DEFAULT '' NOT NULL,
	size       INT8 DEFAULT 0 NOT NULL,
	mimetype   VARCHAR(255) NOT NULL,
	type       VARCHAR(255) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: warehouse_orders
CREATE TABLE warehouse_orders (
	id         SERIAL8 PRIMARY KEY,
	type       VARCHAR(255) NOT NULL,
	status     VARCHAR(255) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: user_groups
CREATE TABLE user_groups (
	id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	type        VARCHAR(50) NOT NULL CHECK (type IN ('system', 'user')),
	name        VARCHAR(255) NOT NULL UNIQUE,
	description TEXT,
	created_at  TIMESTAMP DEFAULT now(),
	updated_at  TIMESTAMP DEFAULT now()
);

-- Change CREATE_TABLE: passports
CREATE TABLE passports (
	id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	first_name            VARCHAR(255),
	last_name             VARCHAR(255),
	middle_name           VARCHAR(255),
	gender                VARCHAR(10),
	birth_date            DATE,
	birth_place           VARCHAR(255),
	nationality           VARCHAR(100),
	passport_type         VARCHAR(20),
	passport_number       VARCHAR(20),
	series                VARCHAR(20),
	issuing_country       VARCHAR(100),
	issued_at             DATE,
	issued_by             VARCHAR(255),
	expires_at            DATE,
	machine_readable_zone VARCHAR(88),
	biometric_data        JSONB,
	signature_image       BYTEA,
	remarks               TEXT,
	created_at            TIMESTAMPTZ DEFAULT now(),
	updated_at            TIMESTAMPTZ DEFAULT now(),
	CONSTRAINT passports_passport_number_series_key UNIQUE (passport_number, series)
);

-- Change CREATE_TABLE: permissions
CREATE TABLE permissions (
	id          UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
	name        VARCHAR(255) NOT NULL UNIQUE,
	resource    VARCHAR(255) NOT NULL,
	action      VARCHAR(255) NOT NULL,
	modifier    VARCHAR(255) NOT NULL,
	description TEXT
);

-- Change CREATE_TABLE: currencies
CREATE TABLE currencies (
	code       VARCHAR(3) NOT NULL PRIMARY KEY,
	name       VARCHAR(255) NOT NULL,
	symbol     VARCHAR(3) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: companies
CREATE TABLE companies (
	id         SERIAL8 PRIMARY KEY,
	name       VARCHAR(255) NOT NULL,
	about      TEXT,
	address    VARCHAR(255),
	phone      VARCHAR(255),
	logo_id    INT8 REFERENCES uploads (id) ON DELETE SET NULL,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: role_permissions
CREATE TABLE role_permissions (
	role_id       INT8 NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
	permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
	PRIMARY KEY (role_id, permission_id)
);

-- Change CREATE_TABLE: uploaded_images
CREATE TABLE uploaded_images (
	id         SERIAL8 PRIMARY KEY,
	upload_id  INT8 NOT NULL REFERENCES uploads (id) ON DELETE CASCADE,
	type       VARCHAR(255) NOT NULL,
	size       FLOAT8 NOT NULL,
	width      INT8 NOT NULL,
	height     INT8 NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: group_roles
CREATE TABLE group_roles (
	group_id   UUID REFERENCES user_groups (id) ON DELETE CASCADE,
	role_id    INT8 REFERENCES roles (id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT now(),
	PRIMARY KEY (group_id, role_id)
);

-- Change CREATE_TABLE: users
CREATE TABLE users (
	id          SERIAL8 PRIMARY KEY,
	type        VARCHAR(50) NOT NULL CHECK (type IN ('system', 'user')),
	first_name  VARCHAR(255) NOT NULL,
	last_name   VARCHAR(255) NOT NULL,
	middle_name VARCHAR(255),
	email       VARCHAR(255) NOT NULL UNIQUE,
	password    VARCHAR(255),
	ui_language VARCHAR(3) NOT NULL,
	phone       VARCHAR(255) UNIQUE,
	avatar_id   INT8 REFERENCES uploads (id) ON DELETE SET NULL,
	last_login  TIMESTAMP NULL,
	last_ip     VARCHAR(255) NULL,
	last_action TIMESTAMPTZ NULL,
	created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
	updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Change CREATE_TABLE: tabs
CREATE TABLE tabs (
	id         SERIAL8 PRIMARY KEY,
	href       VARCHAR(255) NOT NULL,
	user_id    INT8 NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	"position" INT8 DEFAULT 0 NOT NULL,
	UNIQUE (href, user_id)
);

-- Change CREATE_TABLE: warehouse_positions
CREATE TABLE warehouse_positions (
	id          SERIAL8 PRIMARY KEY,
	title       VARCHAR(255) NOT NULL,
	barcode     VARCHAR(255) NOT NULL UNIQUE,
	description TEXT,
	unit_id     INT8 REFERENCES warehouse_units (id) ON DELETE SET NULL,
	created_at  TIMESTAMPTZ DEFAULT now(),
	updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: warehouse_position_images
CREATE TABLE warehouse_position_images (
	warehouse_position_id INT8 NOT NULL REFERENCES warehouse_positions (id) ON DELETE CASCADE,
	upload_id             INT8 NOT NULL REFERENCES uploads (id) ON DELETE CASCADE,
	PRIMARY KEY (upload_id, warehouse_position_id)
);

-- Change CREATE_TABLE: group_users
CREATE TABLE group_users (
	group_id   UUID REFERENCES user_groups (id) ON DELETE CASCADE,
	user_id    INT8 REFERENCES users (id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT now(),
	PRIMARY KEY (group_id, user_id)
);

-- Change CREATE_TABLE: user_roles
CREATE TABLE user_roles (
	user_id    INT8 NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	role_id    INT8 NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT now(),
	PRIMARY KEY (user_id, role_id)
);

-- Change CREATE_TABLE: sessions
CREATE TABLE sessions (
	token      VARCHAR(255) NOT NULL PRIMARY KEY,
	user_id    INT8 NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	expires_at TIMESTAMPTZ NOT NULL,
	ip         VARCHAR(255) NOT NULL,
	user_agent VARCHAR(255) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Change CREATE_TABLE: warehouse_products
CREATE TABLE warehouse_products (
	id          SERIAL8 PRIMARY KEY,
	position_id INT8 NOT NULL REFERENCES warehouse_positions (id) ON DELETE CASCADE,
	rfid        VARCHAR(255) NULL UNIQUE,
	status      VARCHAR(255) NOT NULL,
	created_at  TIMESTAMPTZ DEFAULT now(),
	updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_TABLE: warehouse_order_items
CREATE TABLE warehouse_order_items (
	warehouse_order_id   INT8 NOT NULL REFERENCES warehouse_orders (id) ON DELETE CASCADE,
	warehouse_product_id INT8 NOT NULL REFERENCES warehouse_products (id) ON DELETE CASCADE,
	PRIMARY KEY (warehouse_order_id, warehouse_product_id)
);

-- Change CREATE_TABLE: inventory_checks
CREATE TABLE inventory_checks (
	id             SERIAL8 PRIMARY KEY,
	status         VARCHAR(255) NOT NULL,
	name           VARCHAR(255) NOT NULL,
	type           VARCHAR(255) NOT NULL,
	created_at     TIMESTAMPTZ DEFAULT now(),
	finished_at    TIMESTAMPTZ,
	created_by_id  INT8 NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	finished_by_id INT8 REFERENCES users (id) ON DELETE CASCADE
);

-- Change CREATE_TABLE: user_permissions
CREATE TABLE user_permissions (
	user_id       INT8 NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
	PRIMARY KEY (user_id, permission_id)
);

-- Change CREATE_TABLE: inventory_check_results
CREATE TABLE inventory_check_results (
	id                 SERIAL8 PRIMARY KEY,
	inventory_check_id INT8 NOT NULL REFERENCES inventory_checks (id) ON DELETE CASCADE,
	position_id        INT8 NOT NULL REFERENCES warehouse_positions (id) ON DELETE CASCADE,
	expected_quantity  INT8 NOT NULL,
	actual_quantity    INT8 NOT NULL,
	difference         INT8 NOT NULL,
	created_at         TIMESTAMPTZ DEFAULT now()
);

-- Change CREATE_INDEX: uploaded_images_upload_id_idx
CREATE INDEX uploaded_images_upload_id_idx ON uploaded_images (upload_id);

-- Change CREATE_INDEX: users_first_name_idx
CREATE INDEX users_first_name_idx ON users (first_name);

-- Change CREATE_INDEX: users_last_name_idx
CREATE INDEX users_last_name_idx ON users (last_name);

-- Change CREATE_INDEX: sessions_user_id_idx
CREATE INDEX sessions_user_id_idx ON sessions (user_id);

-- Change CREATE_INDEX: sessions_expires_at_idx
CREATE INDEX sessions_expires_at_idx ON sessions (expires_at);

-- Change CREATE_INDEX: role_permissions_role_id_idx
CREATE INDEX role_permissions_role_id_idx ON role_permissions (role_id);

-- Change CREATE_INDEX: role_permissions_permission_id_idx
CREATE INDEX role_permissions_permission_id_idx ON role_permissions (permission_id);


-- +migrate Down

-- Undo CREATE_INDEX: role_permissions_permission_id_idx
DROP INDEX role_permissions_permission_id_idx;

-- Undo CREATE_INDEX: role_permissions_role_id_idx
DROP INDEX role_permissions_role_id_idx;

-- Undo CREATE_INDEX: sessions_expires_at_idx
DROP INDEX sessions_expires_at_idx;

-- Undo CREATE_INDEX: sessions_user_id_idx
DROP INDEX sessions_user_id_idx;

-- Undo CREATE_INDEX: users_last_name_idx
DROP INDEX users_last_name_idx;

-- Undo CREATE_INDEX: users_first_name_idx
DROP INDEX users_first_name_idx;

-- Undo CREATE_INDEX: uploaded_images_upload_id_idx
DROP INDEX uploaded_images_upload_id_idx;

-- Undo CREATE_TABLE: inventory_check_results
DROP TABLE IF EXISTS inventory_check_results CASCADE;

-- Undo CREATE_TABLE: user_permissions
DROP TABLE IF EXISTS user_permissions CASCADE;

-- Undo CREATE_TABLE: inventory_checks
DROP TABLE IF EXISTS inventory_checks CASCADE;

-- Undo CREATE_TABLE: warehouse_order_items
DROP TABLE IF EXISTS warehouse_order_items CASCADE;

-- Undo CREATE_TABLE: warehouse_products
DROP TABLE IF EXISTS warehouse_products CASCADE;

-- Undo CREATE_TABLE: sessions
DROP TABLE IF EXISTS sessions CASCADE;

-- Undo CREATE_TABLE: user_roles
DROP TABLE IF EXISTS user_roles CASCADE;

-- Undo CREATE_TABLE: group_users
DROP TABLE IF EXISTS group_users CASCADE;

-- Undo CREATE_TABLE: warehouse_position_images
DROP TABLE IF EXISTS warehouse_position_images CASCADE;

-- Undo CREATE_TABLE: warehouse_positions
DROP TABLE IF EXISTS warehouse_positions CASCADE;

-- Undo CREATE_TABLE: tabs
DROP TABLE IF EXISTS tabs CASCADE;

-- Undo CREATE_TABLE: users
DROP TABLE IF EXISTS users CASCADE;

-- Undo CREATE_TABLE: group_roles
DROP TABLE IF EXISTS group_roles CASCADE;

-- Undo CREATE_TABLE: uploaded_images
DROP TABLE IF EXISTS uploaded_images CASCADE;

-- Undo CREATE_TABLE: role_permissions
DROP TABLE IF EXISTS role_permissions CASCADE;

-- Undo CREATE_TABLE: companies
DROP TABLE IF EXISTS companies CASCADE;

-- Undo CREATE_TABLE: currencies
DROP TABLE IF EXISTS currencies CASCADE;

-- Undo CREATE_TABLE: permissions
DROP TABLE IF EXISTS permissions CASCADE;

-- Undo CREATE_TABLE: passports
DROP TABLE IF EXISTS passports CASCADE;

-- Undo CREATE_TABLE: user_groups
DROP TABLE IF EXISTS user_groups CASCADE;

-- Undo CREATE_TABLE: warehouse_orders
DROP TABLE IF EXISTS warehouse_orders CASCADE;

-- Undo CREATE_TABLE: uploads
DROP TABLE IF EXISTS uploads CASCADE;

-- Undo CREATE_TABLE: warehouse_units
DROP TABLE IF EXISTS warehouse_units CASCADE;

-- Undo CREATE_TABLE: roles
DROP TABLE IF EXISTS roles CASCADE;

