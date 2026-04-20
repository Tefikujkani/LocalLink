import { Business, BusinessStatus } from '../types';

const STORAGE_KEY = 'locallink_businesses';

const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'b1',
    ownerId: '3',
    name: 'Missini Sweets & Cafe',
    category: 'Café',
    description: 'The most famous sweets and coffee spot in the heart of Vushtrri.',
    phone: '+38344111222',
    lat: 42.8231,
    lng: 20.9678,
    status: 'approved',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/missini/800/600',
    rating: 4.8,
  },
  {
    id: 'b2',
    ownerId: '3',
    name: 'City Grill Vushtrri',
    category: 'Restaurant',
    description: 'Authentic grilled specialties and the best traditional food in town.',
    phone: '+38349333444',
    lat: 42.8239,
    lng: 20.9664,
    status: 'approved',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/citygrill/800/600',
    rating: 4.5,
  },
  {
    id: 'b3',
    ownerId: '4',
    name: 'Gentlemen\'s Barber Shop',
    category: 'Barber Shop',
    description: 'Premium grooming and hair styling for the modern man of Vushtrri.',
    phone: '+38345555666',
    lat: 42.8225,
    lng: 20.9690,
    status: 'approved',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/barber/800/600',
    rating: 4.9,
  },
  {
    id: 'b4',
    ownerId: '5',
    name: 'Vushtrri Castle Café',
    category: 'Café',
    description: 'Enjoy your coffee with a view of the historic Vushtrri Castle.',
    phone: '+38344777888',
    lat: 42.8240,
    lng: 20.9670,
    status: 'approved',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/castle/800/600',
    rating: 4.7,
  },
];

export const businessService = {
  getBusinesses: async (): Promise<Business[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(INITIAL_BUSINESSES));
  },

  getMyBusinesses: async (userId: string): Promise<Business[]> => {
    const all = await businessService.getBusinesses();
    return all.filter(b => b.ownerId === userId);
  },

  getPendingBusinesses: async (): Promise<Business[]> => {
    const all = await businessService.getBusinesses();
    return all.filter(b => b.status === 'pending');
  },

  createBusiness: async (data: Omit<Business, 'id' | 'status' | 'createdAt'>): Promise<Business> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const all = await businessService.getBusinesses();
    const newBusiness: Business = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, newBusiness]));
    return newBusiness;
  },

  updateBusinessStatus: async (id: string, status: BusinessStatus): Promise<Business> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const all = await businessService.getBusinesses();
    const index = all.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Business not found');
    
    all[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all[index];
  },

  deleteBusiness: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const all = await businessService.getBusinesses();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter(b => b.id !== id)));
  }
};
