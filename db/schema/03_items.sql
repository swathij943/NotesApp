DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    category_id INTEGER,
    user_id INTEGER,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    date DATE NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE tasks
   ADD CONSTRAINT fk_category_task_id
   FOREIGN KEY (category_id)
   REFERENCES categories(id);

ALTER TABLE tasks
  ADD CONSTRAINT fk_user_task_id
  FOREIGN KEY (user_id)
  REFERENCES users(id);
