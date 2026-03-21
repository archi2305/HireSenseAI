from sqlalchemy import text
from database import engine

def run_migrations():
    print("Starting Profile Upgrade Migrations...")
    
    alter_statements = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS job_role VARCHAR;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS bio VARCHAR;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_roles JSON DEFAULT '[]'::json;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_skills JSON DEFAULT '[]'::json;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_alerts BOOLEAN DEFAULT TRUE;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_reports BOOLEAN DEFAULT FALSE;"
    ]
    
    try:
        with engine.connect() as conn:
            with conn.begin(): # Transaction block
                for stmt in alter_statements:
                    print(f"Executing: {stmt}")
                    conn.execute(text(stmt))
        print("Migration Completed Successfully!")
    except Exception as e:
        print(f"Migration Failed: {str(e)}")

if __name__ == "__main__":
    run_migrations()
