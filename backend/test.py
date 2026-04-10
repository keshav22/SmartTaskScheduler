from services.scheduler import run_scheduler_midnight
import os

if __name__ == "__main__":
    print("🚀 Manually triggering the scheduler for all users...")

    results = run_scheduler_midnight()

    print(f"✅ Done! Processed {len(results)} users.")
    for res in results:
        print(f"Detail: {res}")
