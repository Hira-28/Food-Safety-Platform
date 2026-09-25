type Restaurant = {
  id: string;
  name: string;
  location: string;
  categories: string[];
  rating: number;
  reviewCount: number;
  openNow: boolean;
  hasActiveComplaint: boolean;
  imageUrl: string;
};

export const mockRestaurants = [
  {
    id: "1",
    name: "Green Leaf Bengali Kitchen",
    location: "Near Main Gate, University Road",
    categories: ["Bengali"],
    rating: 4.5,
    reviewCount: 128,
    openNow: true,
    hasActiveComplaint: false,
    imageUrl: "https://picsum.photos/seed/green-leaf/600/400",
  },
  {
    id: "2",
    name: "Campus Fast Bites",
    location: "Behind Academic Building 2",
    categories: ["Fast Food", "Street Food"],
    rating: 3.2,
    reviewCount: 64,
    openNow: true,
    hasActiveComplaint: true,
    imageUrl: "https://picsum.photos/seed/campus-bites/600/400",
  },
  {
    id: "3",
    name: "Dragon Wok",
    location: "Residential Hall Road",
    categories: ["Chinese"],
    rating: 4.1,
    reviewCount: 89,
    openNow: false,
    hasActiveComplaint: false,
    imageUrl: "https://picsum.photos/seed/dragon-wok/600/400",
  },
  {
    id: "4",
    name: "Morning Brew Cafe",
    location: "Library Street",
    categories: ["Cafe", "Bakery"],
    rating: 4.7,
    reviewCount: 203,
    openNow: true,
    hasActiveComplaint: false,
    imageUrl: "https://picsum.photos/seed/morning-brew/600/400",
  },
  {
    id: "5",
    name: "Roadside Delights",
    location: "Hall Junction",
    categories: ["Street Food"],
    rating: 2.8,
    reviewCount: 41,
    openNow: true,
    hasActiveComplaint: true,
    imageUrl: "https://picsum.photos/seed/roadside/600/400",
  },
];