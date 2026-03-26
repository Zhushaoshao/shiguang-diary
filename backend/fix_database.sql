-- 修复日记表中的 images 字段

USE shiguang_diary;

-- 1. 查看当前数据
SELECT id, title, images, TYPEOF(images) as type 
FROM diaries;

-- 2. 如果 MySQL 版本不支持 JSON 类型，改为 TEXT
ALTER TABLE diaries MODIFY COLUMN images TEXT;

-- 3. 清理所有日记的 images 字段，确保是有效的 JSON
UPDATE diaries SET images = '[]' WHERE images IS NULL;
UPDATE diaries SET images = '[]' WHERE images = '';

-- 4. 验证修复结果
SELECT id, title, images FROM diaries;

