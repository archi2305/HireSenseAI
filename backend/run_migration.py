from sqlalchemy import text
from database import engine

def run_migrations():
    print("Starting Profile Upgrade Migrations...")
    
    alter_statements = [
        "ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS user_id INTEGER;",
        "ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS matched_skills JSON DEFAULT '[]'::json;",
        "ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS missing_skills JSON DEFAULT '[]'::json;",
        "ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS suggestions VARCHAR;",
        "ALTER TABLE resume_analysis ADD COLUMN IF NOT EXISTS file_path VARCHAR;"
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
