export interface Member {
  id?: string;
  name: string;
  pob: string;
  dob: string;
  phone: string;
  ig: string;
  quote: string;
  role: string;
  image_url: string;
}

export interface Kitab {
  id?: string;
  title: string;
  author: string;
  category: string;
  file_url: string;
}

export interface Album {
  id?: string;
  title: string;
  drive_link: string;
  image_url: string;
  created_at?: string;
}

export interface GalleryItem {
  id?: string;
  image_url: string;
  title: string;
  created_at?: string;
}

export interface AdminRole {
  id?: string;
  email: string;
  role: string;
}

export interface AdminRequest {
  id: string;
  table_name: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ACCESS_REQUEST';
  data: any;
  target_id: string | null;
  requested_by: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
