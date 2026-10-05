from typing import Dict, Any, Optional
import datetime
from sqlalchemy.orm import Session
from backend.db.models import Contact, ReviewDecision

VALID_DECISIONS = {
    "ACCEPTED",
    "RECLASSIFIED",
    "FALSE_POSITIVE",
    "UNKNOWN",
    "FOLLOW_UP_REQUIRED"
}

class HumanReviewManager:
    """
    Manages operator review audit trail.
    Ensures strict separation between raw AI inference provenance and human confirmation.
    """

    @classmethod
    def submit_review(
        cls,
        db: Session,
        contact_id: int,
        decision: str,
        reviewer_name: str = "Hydrographic Analyst",
        reclassified_class: Optional[str] = None,
        reason: Optional[str] = "",
        notes: Optional[str] = ""
    ) -> Dict[str, Any]:
        contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if not contact:
            raise ValueError(f"Contact {contact_id} not found")

        decision_upper = decision.upper()
        if decision_upper not in VALID_DECISIONS:
            raise ValueError(f"Invalid decision '{decision}'. Must be one of {VALID_DECISIONS}")

        # Update contact review state WITHOUT erasing model detection
        contact.review_status = decision_upper
        if decision_upper == "ACCEPTED":
            contact.operator_confirmed_class = contact.detected_class
        elif decision_upper == "RECLASSIFIED" and reclassified_class:
            contact.operator_confirmed_class = reclassified_class
        elif decision_upper == "FALSE_POSITIVE":
            contact.operator_confirmed_class = "FALSE_POSITIVE"
        elif decision_upper == "UNKNOWN":
            contact.operator_confirmed_class = "UNKNOWN_ANOMALY"

        # Record immutable audit entry
        review_entry = ReviewDecision(
            contact_id=contact.id,
            reviewer=reviewer_name,
            decision=decision_upper,
            reclassified_class=reclassified_class,
            reason=reason or "",
            notes=notes or "",
            timestamp=datetime.datetime.utcnow()
        )
        db.add(review_entry)
        db.commit()
        db.refresh(contact)

        return {
            "contact_id": contact.id,
            "contact_code": contact.contact_code,
            "review_status": contact.review_status,
            "operator_confirmed_class": contact.operator_confirmed_class,
            "original_detected_class": contact.detected_class,
            "original_model_score": contact.model_score,
            "reviewer": reviewer_name,
            "decision": decision_upper,
            "timestamp": review_entry.timestamp.isoformat()
        }
