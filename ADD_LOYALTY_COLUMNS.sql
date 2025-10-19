-- Neon SQL Editor'da bu SQL'i çalıştırın
-- Her satırı tek tek seçip çalıştırabilirsiniz

-- 1. loyalty_tier kolonu ekle
ALTER TABLE "users" 
ADD COLUMN "loyalty_tier" TEXT NOT NULL DEFAULT 'STANDARD';

-- 2. total_spent kolonu ekle  
ALTER TABLE "users" 
ADD COLUMN "total_spent" INTEGER NOT NULL DEFAULT 0;

-- 3. Kontrol et (kolonlar eklenmiş mi?)
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('loyalty_tier', 'total_spent');


