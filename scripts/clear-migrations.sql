-- Clear failed migrations from _prisma_migrations table
DELETE FROM "_prisma_migrations" WHERE migration_name = '20251016_add_addresses_and_statuses';

