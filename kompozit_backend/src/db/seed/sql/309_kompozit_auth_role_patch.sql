ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role ENUM('admin','moderator','user') NOT NULL DEFAULT 'user' AFTER phone;

UPDATE users u
LEFT JOIN (
  SELECT
    ur.user_id,
    CASE
      WHEN MAX(CASE WHEN ur.role = 'admin' THEN 1 ELSE 0 END) = 1 THEN 'admin'
      WHEN MAX(CASE WHEN ur.role = 'moderator' THEN 1 ELSE 0 END) = 1 THEN 'moderator'
      ELSE 'user'
    END AS primary_role
  FROM user_roles ur
  GROUP BY ur.user_id
) r ON r.user_id = u.id
SET u.role = COALESCE(r.primary_role, 'user');
