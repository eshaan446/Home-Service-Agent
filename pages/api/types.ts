export interface ConversationMessage {
  role: string;
  content: string;
}

export interface ExtractedData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  unit_number: string;
  residential_or_commercial: string;
  homeowner: string;
  homeowner_number: string;
  service_yes_or_no: string;
  date_of_service_requested: string;
  morning_or_afternoon: string;
  job_type: string;
  age_of_equipment_or_house: string;
  damage_area_or_issue_location: string;
  membership_status: string;
  interested_in_membership: string;
  urgency: string;
  message: string;
  summary: string;
}
