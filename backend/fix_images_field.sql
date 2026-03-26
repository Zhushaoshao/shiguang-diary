-- 检查和修复日记表中的 images 字段

-- 1. 查看所有日记的 images 字段
SELECT id, title, images, LENGTH(images) as images_length 
FROM diaries;

-- 2. 查看 images 字段的数据类型
DESCRIBE diaries;

-- 3. 如果 images 字段不是 JSON 类型，需要修改
-- ALTER TABLE diaries MODIFY COLUMN images JSON;

-- 4. 或者使用 TEXT 类型
-- ALTER TABLE diaries MODIFY COLUMN images TEXT;

-- 5. 清理无效的 JSON 数据（如果需要）
-- UPDATE diaries SET images = '[]' WHERE images IS NULL OR images = '';

-- 6. 验证 JSON 格式（MySQL 5.7.8+）
-- SELECT id, title, JSON_VALID(images) as is_valid_json 
-- FROM diaries;

