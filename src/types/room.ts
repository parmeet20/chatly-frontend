export interface RoomMember {
  ID: string;
  Username: string;
}

export interface Room {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
}

export interface RoomDetails {
  ID: string;
  Name: string;
  CreatedAt: string;
  CreatedBy: RoomMember;
  Members: RoomMember[];
  Online: number;
}
