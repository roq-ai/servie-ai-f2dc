import { ResidentInterface } from 'interfaces/resident';
import { GetQueryInterface } from 'interfaces';

export interface AutomatedCallStatusInterface {
  id?: string;
  status: string;
  call_time: any;
  resident_id: string;
  created_at?: any;
  updated_at?: any;

  resident?: ResidentInterface;
  _count?: {};
}

export interface AutomatedCallStatusGetQueryInterface extends GetQueryInterface {
  id?: string;
  status?: string;
  resident_id?: string;
}
