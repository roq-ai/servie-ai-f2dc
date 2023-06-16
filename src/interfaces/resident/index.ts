import { AutomatedCallRuleInterface } from 'interfaces/automated-call-rule';
import { AutomatedCallStatusInterface } from 'interfaces/automated-call-status';
import { FacilityInterface } from 'interfaces/facility';
import { GetQueryInterface } from 'interfaces';

export interface ResidentInterface {
  id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  facility_id: string;
  created_at?: any;
  updated_at?: any;
  automated_call_rule?: AutomatedCallRuleInterface[];
  automated_call_status?: AutomatedCallStatusInterface[];
  facility?: FacilityInterface;
  _count?: {
    automated_call_rule?: number;
    automated_call_status?: number;
  };
}

export interface ResidentGetQueryInterface extends GetQueryInterface {
  id?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  facility_id?: string;
}
