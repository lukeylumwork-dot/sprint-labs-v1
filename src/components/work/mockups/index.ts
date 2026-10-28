import type { ComponentType } from "react";
import MentorHubMockup from "./MentorHub";
import ScoutingHubMockup from "./ScoutingHub";
import AgencyFinanceMockup from "./AgencyFinance";
import RecruitmentCrmMockup from "./RecruitmentCrm";
import GkIconMockup from "./GkIcon";
import FoundersWayMockup from "./FoundersWay";
import SandalwoodSageMockup from "./SandalwoodSage";

// Interactive previews, keyed by project id in ../data.ts.
export const MOCKUPS: Record<string, ComponentType> = {
  "mentor-hub": MentorHubMockup,
  "scouting-hub": ScoutingHubMockup,
  "agency-finance": AgencyFinanceMockup,
  "recruitment-crm": RecruitmentCrmMockup,
  "gk-icon": GkIconMockup,
  "founders-way": FoundersWayMockup,
  "sandalwood-sage": SandalwoodSageMockup,
};
