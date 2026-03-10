export interface Profile {
  id: string;
  email: string;
  full_name: string;
  school: string;
  verified: boolean;
  items_sold: number;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  image_urls: string[];
  pickup_location: string;
  sold: boolean;
  created_at: string;
  // joined from profiles
  profiles?: Profile;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  // joined
  listings?: Pick<Listing, "id" | "title" | "image_urls">;
  buyer?: Profile;
  seller?: Profile;
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
