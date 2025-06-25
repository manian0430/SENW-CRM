CREATE TABLE automation_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  key TEXT UNIQUE NOT NULL,
  value JSONB
);

-- Set an initial value for the last assigned agent index
INSERT INTO automation_settings (key, value)
VALUES ('last_assigned_agent_index', '{"index": 0}'); 