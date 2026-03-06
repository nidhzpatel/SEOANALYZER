"""Database models for SEO Analyzer."""

import json
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from app.database import Base


class Report(Base):
    """Stores a complete SEO analysis report."""

    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    url = Column(String(2048), nullable=False, index=True)
    overall_score = Column(Float, nullable=False, default=0.0)
    grade = Column(String(2), nullable=False, default="F")

    # Sub-scores
    onpage_seo_score = Column(Float, nullable=False, default=0.0)
    technical_seo_score = Column(Float, nullable=False, default=0.0)
    performance_score = Column(Float, nullable=False, default=0.0)
    ai_score = Column(Float, nullable=False, default=50.0)

    # JSON data stored as text
    crawl_data_json = Column(Text, nullable=True)
    seo_signals_json = Column(Text, nullable=True)
    pagespeed_data_json = Column(Text, nullable=True)
    issues_json = Column(Text, nullable=True)

    # AI-generated data
    ai_content_analysis_json = Column(Text, nullable=True)
    ai_recommendations_json = Column(Text, nullable=True)
    ai_suggested_title = Column(String(256), nullable=True, default="")
    ai_suggested_meta = Column(String(512), nullable=True, default="")
    ai_summary = Column(Text, nullable=True, default="")

    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    # ── JSON property helpers ──────────────────────────

    @property
    def crawl_data(self):
        return json.loads(self.crawl_data_json) if self.crawl_data_json else {}

    @crawl_data.setter
    def crawl_data(self, value):
        self.crawl_data_json = json.dumps(value, default=str)

    @property
    def seo_signals(self):
        return json.loads(self.seo_signals_json) if self.seo_signals_json else {}

    @seo_signals.setter
    def seo_signals(self, value):
        self.seo_signals_json = json.dumps(value, default=str)

    @property
    def pagespeed_data(self):
        return json.loads(self.pagespeed_data_json) if self.pagespeed_data_json else {}

    @pagespeed_data.setter
    def pagespeed_data(self, value):
        self.pagespeed_data_json = json.dumps(value, default=str)

    @property
    def issues(self):
        return json.loads(self.issues_json) if self.issues_json else []

    @issues.setter
    def issues(self, value):
        self.issues_json = json.dumps(value, default=str)

    @property
    def ai_content_analysis(self):
        return json.loads(self.ai_content_analysis_json) if self.ai_content_analysis_json else {}

    @ai_content_analysis.setter
    def ai_content_analysis(self, value):
        self.ai_content_analysis_json = json.dumps(value, default=str)

    @property
    def ai_recommendations(self):
        return json.loads(self.ai_recommendations_json) if self.ai_recommendations_json else []

    @ai_recommendations.setter
    def ai_recommendations(self, value):
        self.ai_recommendations_json = json.dumps(value, default=str)
