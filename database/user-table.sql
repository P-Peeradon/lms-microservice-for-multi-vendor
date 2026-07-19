DROP TABLE IF EXISTS lms_lumiere_carnet.users;
CREATE TABLE IF NOT EXISTS lms_lumiere_carnet.users (
	shadow_id CHAR(9),
    encrypted_pii BLOB,
    university VARCHAR(100) NOT NULL,
    faculty VARCHAR(80) NOT NULL,
    firstname BINARY(32) NOT NULL,
    uni_id BINARY(32) UNIQUE NOT NULL,
    date_of_birth BINARY(32) NOT NULL,
    PRIMARY KEY (shadow_id)
);

ALTER TABLE lms_lumiere_carnet.users 
ADD INDEX idx_firstname (firstname);
ALTER TABLE lms_lumiere_carnet.users 
ADD INDEX idx_uni_id (uni_id);
ALTER TABLE lms_lumiere_carnet.users 
ADD INDEX idx_birthday (date_of_birth);
ALTER TABLE lms_lumiere_carnet.users 
ADD INDEX study_affiliation (university, faculty);