-- Init script for MySQL 8.0
-- Allow root user to connect from any host
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Ijaj.jaman@29';
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'Ijaj.jaman@29';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
