ALTER TABLE mtc.mtc_admin.pupilAccessArrangements ADD accessArrangements_id int NOT NULL
ALTER TABLE mtc.mtc_admin.pupilAccessArrangements ADD COLUMN accessArrangements_ids
ALTER TABLE mtc.mtc_admin.pupilAccessArrangements DELETE CONSTRAINT FK_pupilAccessArrangements__accessArrangements_id
