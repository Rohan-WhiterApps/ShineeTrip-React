export interface Amenity {
  id: number;
  name: string;
  img_link: string;
}

export interface Venue {
  id: number;
  name: string;
  cover_img: string;
  images: string[];
  desc: string;
  location: string;
  min_price: number;
  budget_range: string;
  venue_type: string;
  min_guest_capacity: number;
  max_guest_capacity: number;
  luxury: boolean;
  amenities: Amenity[];
}

export interface EventType {
  id: number;
  name: string; // e.g., "Wedding", "Concert"
  img_link: string;
  desc: string;
  venues: Venue[];
}