import { ResidentInterface } from 'interfaces/resident';
import { GetQueryInterface } from 'interfaces';

export interface AutomatedCallRuleInterface {
  id?: string;
  rule_type: string;
  time: any;
  resident_id: string;
  created_at?: any;
  updated_at?: any;

  resident?: ResidentInterface;
  _count?: {};
}

export interface AutomatedCallRuleGetQueryInterface extends GetQueryInterface {
  id?: string;
  rule_type?: string;
  resident_id?: string;
}
