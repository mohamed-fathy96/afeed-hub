export interface TimeSlot {
  id: number;
  fromTime: string;
  toTime: string;
  acceptFromTime: string;
  acceptToTime: string;
  title: string;
  capacity: number;
  saturday: boolean;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  isActive: boolean;
}