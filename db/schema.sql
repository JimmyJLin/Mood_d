

CREATE TABLE profile (
  profile_id SERIAL UNIQUE PRIMARY KEY,
  email VARCHAR(255),
  password_digest TEXT,
  name TEXT,
  emotion_id INTEGER REFERENCES emotion,
  activity_id INTEGER REFERENCES activity
);

CREATE TABLE emotion (
  emotion_id SERIAL UNIQUE PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE activity (
  activity_id SERIAL UNIQUE PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE message_type (
  message_id SERIAL UNIQUE PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE emotion_activity_joint_table (
       emotion_id integer REFERENCES emotion,
       activity_id integer REFERENCES activity,
       PRIMARY KEY (emotion_id, activity_id)
);

CREATE TABLE message_profile_join_table (
       profile_id integer REFERENCES profile,
       message_id integer REFERENCES message_type,
       PRIMARY KEY (profile_id, message_id)
);
