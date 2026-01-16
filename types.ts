
export interface Venue {
  id: string;
  name: string;
  rating: number;
  distance: string;
  price: number;
  image: string;
  tags: string[];
  status: 'available' | 'busy' | 'full';
  visitorCount?: number;
  official?: boolean;
  amenities?: string[];
  surfaceType?: 'PVC' | '实木';
}

export interface Booking {
  id: string;
  venueName: string;
  date: string;
  time: string;
  image: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  players: string[];
}

export interface TeamRequest {
  id: string;
  venueName: string;
  level: string;
  missingCount: number;
  time: string;
  location: string;
  image: string;
}

export interface AppNotification {
  id: string;
  type: 'booking' | 'team' | 'system';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  avatar?: string;
}
