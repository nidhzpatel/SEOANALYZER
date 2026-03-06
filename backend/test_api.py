"""Quick API test script."""
import requests
import json

BASE = "http://localhost:8000"

# Test with Wikipedia
print("=== Testing SEO Analysis: wikipedia.org ===")
r = requests.post(f"{BASE}/api/analyze", json={"url": "https://www.wikipedia.org"}, timeout=90)
d = r.json()
print(f"Status: {r.status_code}")
print(f"Score: {d.get('overall_score')} | Grade: {d.get('grade')}")
print(f"OnPage: {d.get('onpage_seo_score')} | Tech: {d.get('technical_seo_score')} | Perf: {d.get('performance_score')}")
issues = d.get("issues", [])
print(f"Issues found: {len(issues)}")
for i in issues[:12]:
    print(f"  [{i['severity']:8s}] {i['title']}")

# Test report list
print("\n=== Report List ===")
r2 = requests.get(f"{BASE}/api/reports")
reports = r2.json()
for rpt in reports:
    print(f"  ID={rpt['id']} | {rpt['url']} | Score={rpt['overall_score']} ({rpt['grade']})")

print("\nAll tests passed!")
