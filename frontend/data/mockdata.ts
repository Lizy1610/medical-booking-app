
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  distance: number;
  time: number;
  type: 'Hospital' | 'Clinica';
  imageUrl: string;
}

export const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. David Patel', specialty: 'Cardiólogo', location: 'Centro de Cardiología,', rating: 5, reviews: 1872, imageUrl: 'https://i.pravatar.cc/150?u=davidpatel' },
  { id: '2', name: 'Dr. Jessica Turner', specialty: 'Ginecóloga', location: 'Clínica de Mujeres, ', rating: 4.9, reviews: 127, imageUrl: 'https://i.pravatar.cc/150?u=jessicaturner' },
  { id: '3', name: 'Dr. Michael Johnson', specialty: 'Cirugía Ortopédica', location: 'Asociados de Maple, ', rating: 4.7, reviews: 5223, imageUrl: 'https://i.pravatar.cc/150?u=michaeljohnson' },
];

export const mockHospitals: Hospital[] = [
  { id: '1', name: 'Clínica de salud del amanecer', address: 'Calle Benito Juarez 152, CP 98765', rating: 5.0, reviews: 128, distance: 2.5, time: 40, type: 'Hospital', imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37229d7d3bf?q=80&w=2070' },
  { id: '2', name: 'Centro de Cardiología de Golden', address: 'Calle Reforma 431, CP 75777', rating: 4.9, reviews: 58, distance: 2.5, time: 40, type: 'Clinica', imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1932' },
];