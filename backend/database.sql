-- HydroPredict — MySQL schema (all Morocco)
-- Charset utf8mb4 for Arabic + French. Engine InnoDB.
-- Fresh install: cmd /c "mysql -u root -p --default-character-set=utf8mb4 < backend\database.sql"
-- (Use cmd redirection, NOT a PowerShell pipe, to preserve Arabic UTF-8.)

CREATE DATABASE IF NOT EXISTS hydropredict CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hydropredict;

-- Agricultural zones (39 cities across the 12 regions of Morocco)
CREATE TABLE IF NOT EXISTS regions (
  id VARCHAR(50) PRIMARY KEY,
  name_fr VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  admin_fr VARCHAR(100) NOT NULL DEFAULT '',
  admin_ar VARCHAR(100) NOT NULL DEFAULT '',
  province VARCHAR(100) NOT NULL,
  latitude DECIMAL(8,5) NOT NULL,
  longitude DECIMAL(8,5) NOT NULL,
  crops_fr VARCHAR(255) DEFAULT NULL,
  crops_ar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO regions (id, name_fr, name_ar, admin_fr, admin_ar, province, latitude, longitude, crops_fr, crops_ar) VALUES
('tanger', 'Tanger', 'طنجة', 'Tanger-Tétouan-Al Hoceïma', 'طنجة تطوان الحسيمة', 'Tanger-Assilah', 35.78, -5.81, 'Maraîchage, fraises', 'خضروات، فراولة'),
('tetouan', 'Tétouan', 'تطوان', 'Tanger-Tétouan-Al Hoceïma', 'طنجة تطوان الحسيمة', 'Tétouan', 35.57, -5.37, 'Oliviers, figuiers', 'زيتون، تين'),
('hoceima', 'Al Hoceïma', 'الحسيمة', 'Tanger-Tétouan-Al Hoceïma', 'طنجة تطوان الحسيمة', 'Al Hoceïma', 35.25, -3.93, 'Amandiers, figuiers', 'لوز، تين'),
('chefchaouen', 'Chefchaouen', 'شفشاون', 'Tanger-Tétouan-Al Hoceïma', 'طنجة تطوان الحسيمة', 'Chefchaouen', 35.17, -5.27, 'Oliviers, miel', 'زيتون، عسل'),
('oujda', 'Oujda', 'وجدة', 'Oriental', 'الشرق', 'Oujda-Angad', 34.68, -1.91, 'Oliviers, vignes', 'زيتون، كروم'),
('nador', 'Nador', 'الناظور', 'Oriental', 'الشرق', 'Nador', 35.17, -2.93, 'Agrumes, maraîchage', 'حوامض، خضروات'),
('berkane', 'Berkane', 'بركان', 'Oriental', 'الشرق', 'Berkane', 34.92, -2.32, 'Clémentines, olives', 'كليمنتين، زيتون'),
('fes', 'Fès', 'فاس', 'Fès-Meknès', 'فاس مكناس', 'Fès', 34.02, -5.00, 'Oliviers, céréales', 'زيتون، حبوب'),
('meknes', 'Meknès', 'مكناس', 'Fès-Meknès', 'فاس مكناس', 'Meknès', 33.89, -5.55, 'Vignes, olives', 'كروم، زيتون'),
('ifrane', 'Ifrane', 'إفران', 'Fès-Meknès', 'فاس مكناس', 'Ifrane', 33.52, -5.11, 'Pommiers, cerisiers', 'تفاح، كرز'),
('taza', 'Taza', 'تازة', 'Fès-Meknès', 'فاس مكناس', 'Taza', 34.21, -4.01, 'Olives, amandes', 'زيتون، لوز'),
('rabat', 'Rabat', 'الرباط', 'Rabat-Salé-Kénitra', 'الرباط سلا القنيطرة', 'Rabat', 34.02, -6.84, 'Maraîchage', 'خضروات'),
('kenitra', 'Kénitra', 'القنيطرة', 'Rabat-Salé-Kénitra', 'الرباط سلا القنيطرة', 'Kénitra', 34.26, -6.58, 'Riz, agrumes', 'أرز، حوامض'),
('beni-mellal', 'Béni Mellal', 'بني ملال', 'Béni Mellal-Khénifra', 'بني ملال خنيفرة', 'Béni Mellal', 32.34, -6.36, 'Betteraves, agrumes', 'شمندر، حوامض'),
('khenifra', 'Khénifra', 'خنيفرة', 'Béni Mellal-Khénifra', 'بني ملال خنيفرة', 'Khénifra', 32.94, -5.67, 'Céréales, pommiers', 'حبوب، تفاح'),
('azilal', 'Azilal', 'أزيلال', 'Béni Mellal-Khénifra', 'بني ملال خنيفرة', 'Azilal', 31.96, -6.57, 'Noyers, pommes', 'جوز، تفاح'),
('casablanca', 'Casablanca', 'الدار البيضاء', 'Casablanca-Settat', 'الدار البيضاء سطات', 'Casablanca', 33.57, -7.59, 'Maraîchage périurbain', 'خضروات حضرية'),
('settat', 'Settat', 'سطات', 'Casablanca-Settat', 'الدار البيضاء سطات', 'Settat', 33.00, -7.62, 'Céréales', 'حبوب'),
('el-jadida', 'El Jadida', 'الجديدة', 'Casablanca-Settat', 'الدار البيضاء سطات', 'El Jadida', 33.23, -8.49, 'Maraîchage, betteraves', 'خضروات، شمندر'),
('mohammedia', 'Mohammedia', 'المحمدية', 'Casablanca-Settat', 'الدار البيضاء سطات', 'Mohammedia', 33.69, -7.39, 'Maraîchage', 'خضروات'),
('marrakech', 'Marrakech', 'مراكش', 'Marrakech-Safi', 'مراكش آسفي', 'Marrakech', 31.63, -7.99, 'Oliviers, agrumes', 'زيتون، حوامض'),
('safi', 'Safi', 'آسفي', 'Marrakech-Safi', 'مراكش آسفي', 'Safi', 32.30, -9.24, 'Céréales, câpres', 'حبوب، كبار'),
('essaouira', 'Essaouira', 'الصويرة', 'Marrakech-Safi', 'مراكش آسفي', 'Essaouira', 31.51, -9.77, 'Argan, maraîchage', 'أركان، خضروات'),
('errachidia', 'Errachidia', 'الرشيدية', 'Drâa-Tafilalet', 'درعة تافيلالت', 'Errachidia', 31.93, -4.42, 'Dattiers', 'نخيل التمر'),
('ouarzazate', 'Ouarzazate', 'ورزازات', 'Drâa-Tafilalet', 'درعة تافيلالت', 'Ouarzazate', 30.93, -6.91, 'Dattiers, henné', 'تمر، حناء'),
('zagora', 'Zagora', 'زاكورة', 'Drâa-Tafilalet', 'درعة تافيلالت', 'Zagora', 30.33, -5.84, 'Dattiers', 'نخيل التمر'),
('midelt', 'Midelt', 'ميدلت', 'Drâa-Tafilalet', 'درعة تافيلالت', 'Midelt', 32.68, -4.74, 'Pommiers', 'تفاح'),
('agadir', 'Agadir', 'أكادير', 'Souss-Massa', 'سوس ماسة', 'Agadir Ida-Outanane', 30.42, -9.59, 'Maraîchage, bananes, agrumes', 'خضروات، موز، حوامض'),
('inezgane', 'Inezgane', 'إنزكان', 'Souss-Massa', 'سوس ماسة', 'Inezgane-Aït Melloul', 30.36, -9.55, 'Maraîchage sous serre, agrumes', 'خضروات تحت البيوت المحمية، حوامض'),
('taroudant', 'Taroudant', 'تارودانت', 'Souss-Massa', 'سوس ماسة', 'Taroudant', 30.47, -8.87, 'Agrumes, oliviers, maraîchage', 'حوامض، زيتون، خضروات'),
('chtouka', 'Chtouka Aït Baha', 'شتوكة آيت باها', 'Souss-Massa', 'سوس ماسة', 'Chtouka-Aït Baha', 30.07, -9.42, 'Tomates, poivrons, fraises', 'طماطم، فلفل، فراولة'),
('tiznit', 'Tiznit', 'تزنيت', 'Souss-Massa', 'سوس ماسة', 'Tiznit', 29.70, -9.73, 'Argan, amandiers, oliviers', 'أركان، لوز، زيتون'),
('guelmim', 'Guelmim', 'كلميم', 'Guelmim-Oued Noun', 'كلميم واد نون', 'Guelmim', 28.99, -10.06, 'Dattiers, élevage', 'تمر، تربية المواشي'),
('sidi-ifni', 'Sidi Ifni', 'سيدي إفني', 'Guelmim-Oued Noun', 'كلميم واد نون', 'Sidi Ifni', 29.38, -10.17, 'Figuier de barbarie, argan', 'الصبار، أركان'),
('tan-tan', 'Tan-Tan', 'طانطان', 'Guelmim-Oued Noun', 'كلميم واد نون', 'Tan-Tan', 28.44, -11.10, 'Élevage', 'تربية المواشي'),
('laayoune', 'Laâyoune', 'العيون', 'Laâyoune-Sakia El Hamra', 'العيون الساقية الحمراء', 'Laâyoune', 27.15, -13.20, 'Maraîchage, élevage', 'خضروات، تربية المواشي'),
('smara', 'Smara', 'السمارة', 'Laâyoune-Sakia El Hamra', 'العيون الساقية الحمراء', 'Smara', 26.74, -11.69, 'Élevage', 'تربية المواشي'),
('dakhla', 'Dakhla', 'الداخلة', 'Dakhla-Oued Ed-Dahab', 'الداخلة وادي الذهب', 'Oued Ed-Dahab', 23.72, -15.95, 'Tomates, pêche', 'طماطم، صيد بحري'),
('boujdour', 'Boujdour', 'بوجدور', 'Dakhla-Oued Ed-Dahab', 'الداخلة وادي الذهب', 'Boujdour', 26.13, -14.48, 'Pêche, élevage', 'صيد بحري، تربية المواشي')
ON DUPLICATE KEY UPDATE
  name_fr = VALUES(name_fr), name_ar = VALUES(name_ar),
  admin_fr = VALUES(admin_fr), admin_ar = VALUES(admin_ar),
  province = VALUES(province), latitude = VALUES(latitude), longitude = VALUES(longitude),
  crops_fr = VALUES(crops_fr), crops_ar = VALUES(crops_ar);

-- App users (demo: single farmer per device; extend with auth as needed)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  preferred_region VARCHAR(50) DEFAULT 'agadir',
  preferred_crop VARCHAR(50) DEFAULT 'wheat',
  field_area_ha DECIMAL(6,2) DEFAULT 1.00,
  lang CHAR(2) DEFAULT 'fr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (preferred_region) REFERENCES regions(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO users (id, name, preferred_region, lang) VALUES (1, 'Agriculteur Démo', 'agadir', 'fr');

-- Every region selection / preference save
CREATE TABLE IF NOT EXISTS user_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  region_id VARCHAR(50) NOT NULL,
  action VARCHAR(50) DEFAULT 'select_zone',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON UPDATE CASCADE,
  INDEX idx_user_time (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Forecast snapshots + AI risk (for history screen)
CREATE TABLE IF NOT EXISTS forecast_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region_id VARCHAR(50) NOT NULL,
  forecast_date DATE NOT NULL,
  tmax_avg DECIMAL(5,2) DEFAULT NULL,
  rain_total DECIMAL(6,2) DEFAULT NULL,
  et0_avg DECIMAL(5,2) DEFAULT NULL,
  risk ENUM('normal','moderate','high') DEFAULT 'normal',
  payload JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON UPDATE CASCADE,
  INDEX idx_region_date (region_id, forecast_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- V2: multi-parcels + tasks + sensor readings
CREATE TABLE IF NOT EXISTS parcels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL DEFAULT 1,
  name VARCHAR(100) NOT NULL,
  region_id VARCHAR(50) DEFAULT 'agadir',
  crop VARCHAR(50) DEFAULT 'tomato',
  soil VARCHAR(50) DEFAULT 'loam',
  area_ha DECIMAL(6,2) DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON UPDATE CASCADE,
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL DEFAULT 1,
  parcel_id INT DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  done TINYINT(1) DEFAULT 0,
  due_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE SET NULL,
  INDEX idx_user_done (user_id, done)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sensor_readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parcel_id INT DEFAULT NULL,
  soil_moisture DECIMAL(5,2) DEFAULT NULL,
  soil_temp DECIMAL(5,2) DEFAULT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE,
  INDEX idx_parcel_time (parcel_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO parcels (id, user_id, name, region_id, crop, soil, area_ha) VALUES
(1, 1, 'Souss Tomate S1', 'chtouka', 'tomato', 'sandy', 2.50),
(2, 1, 'Taroudant Agrumes', 'taroudant', 'citrus', 'loam', 4.00),
(3, 1, 'Tiznit Argan', 'tiznit', 'argan', 'clay', 6.00);
