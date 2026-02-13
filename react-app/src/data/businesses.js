// Business data with real Unsplash images
export const businesses = {
  'raj-salon': {
    id: 'raj-salon',
    name: "Raj's Salon",
    logo: "💇",
    tagline: "Where Style Meets Excellence",
    description: "Premium hair salon offering expert cuts, styling, and treatments in a luxurious setting.",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    phone: "+91-9876543210",
    email: "contact@rajssalon.com",
    rating: 4.8,
    reviewCount: 87,
    social_media_links: [
      { platform: 'instagram', url: 'https://instagram.com/rajssalon' },
      { platform: 'facebook', url: 'https://facebook.com/rajssalon' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4', // Sample Place ID for smoother mobile experience

    // Hero images - High quality salon photos
    hero: {
      main: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)'
    },

    // Gallery images - Real salon photos
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
        title: 'Modern Salon Interior',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop',
        title: 'Professional Haircut',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800&h=600&fit=crop',
        title: 'Hair Styling',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop',
        title: 'Barber Shop',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=800&h=600&fit=crop',
        title: 'Hair Treatment',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop',
        title: 'Salon Equipment',
        category: 'interior'
      }
    ],

    // Staff members with photos
    staff: [
      {
        name: 'Raj Kumar',
        role: 'Master Stylist',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        experience: '15 years',
        specialty: 'Creative Cuts & Styling'
      },
      {
        name: 'Priya Sharma',
        role: 'Senior Stylist',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        experience: '10 years',
        specialty: 'Color Specialist'
      },
      {
        name: 'Amit Patel',
        role: 'Barber',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        experience: '8 years',
        specialty: 'Classic & Modern Cuts'
      },
      {
        name: 'Neha Singh',
        role: 'Junior Stylist',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        experience: '5 years',
        specialty: 'Bridal Styling'
      }
    ],

    // Services offered
    services: [
      {
        name: 'Haircut & Styling',
        price: '₹500',
        duration: '45 min',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop',
        description: 'Professional haircut with styling'
      },
      {
        name: 'Hair Coloring',
        price: '₹2000',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&h=400&fit=crop',
        description: 'Full color or highlights'
      },
      {
        name: 'Hair Treatment',
        price: '₹1500',
        duration: '1 hour',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
        description: 'Deep conditioning & repair'
      },
      {
        name: 'Beard Grooming',
        price: '₹300',
        duration: '30 min',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop',
        description: 'Trim, shape & style'
      },
      {
        name: 'Bridal Package',
        price: '₹5000',
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop',
        description: 'Complete bridal hair & makeup'
      }
    ],

    // Review form options
    qualities: ['Professional', 'Skilled', 'Friendly', 'Clean', 'Punctual', 'Creative'],
    feelings: ['Happy', 'Satisfied', 'Confident', 'Relaxed', 'Impressed']
  },

  'spa-paradise': {
    id: 'spa-paradise',
    name: "Spa Paradise",
    logo: "🧖",
    tagline: "Your Oasis of Tranquility",
    description: "Luxury spa offering massages, facials, and wellness treatments in a serene environment.",
    address: "45 Koramangala, Bangalore, Karnataka 560034",
    phone: "+91-9876543211",
    email: "info@spaparadise.com",
    rating: 4.9,
    reviewCount: 124,
    social_media_links: [
      { platform: 'instagram', url: 'https://instagram.com/spaparadise' },
      { platform: 'tiktok', url: 'https://tiktok.com/@spaparadise' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
        title: 'Spa Interior',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop',
        title: 'Massage Room',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=600&fit=crop',
        title: 'Relaxation Area',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1596178060810-7d4cf0e0c7b9?w=800&h=600&fit=crop',
        title: 'Spa Treatment',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=600&fit=crop',
        title: 'Wellness Center',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        title: 'Spa Products',
        category: 'products'
      }
    ],

    staff: [
      {
        name: 'Dr. Meera Reddy',
        role: 'Spa Director',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        experience: '20 years',
        specialty: 'Ayurvedic Treatments'
      },
      {
        name: 'Lakshmi Iyer',
        role: 'Senior Therapist',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        experience: '12 years',
        specialty: 'Deep Tissue Massage'
      },
      {
        name: 'Anjali Desai',
        role: 'Aromatherapist',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        experience: '8 years',
        specialty: 'Aromatherapy'
      },
      {
        name: 'Kavya Nair',
        role: 'Wellness Coach',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
        experience: '6 years',
        specialty: 'Holistic Wellness'
      }
    ],

    services: [
      {
        name: 'Swedish Massage',
        price: '₹2500',
        duration: '60 min',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
        description: 'Relaxing full body massage'
      },
      {
        name: 'Deep Tissue Massage',
        price: '₹3000',
        duration: '75 min',
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop',
        description: 'Therapeutic deep pressure'
      },
      {
        name: 'Facial Treatment',
        price: '₹2000',
        duration: '60 min',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
        description: 'Rejuvenating facial'
      },
      {
        name: 'Body Scrub',
        price: '₹1800',
        duration: '45 min',
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400&fit=crop',
        description: 'Exfoliating body treatment'
      },
      {
        name: 'Spa Package',
        price: '₹6000',
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
        description: 'Complete spa experience'
      }
    ],

    qualities: ['Relaxing', 'Professional', 'Clean', 'Peaceful', 'Luxurious', 'Therapeutic'],
    feelings: ['Relaxed', 'Rejuvenated', 'Peaceful', 'Refreshed', 'Pampered']
  },

  'pizza-corner': {
    id: 'pizza-corner',
    name: "Pizza Corner",
    logo: "🍕",
    tagline: "Authentic Italian Flavors",
    description: "Wood-fired pizzas made with fresh ingredients and traditional Italian recipes.",
    address: "78 Indiranagar, Bangalore, Karnataka 560038",
    phone: "+91-9876543212",
    email: "hello@pizzacorner.com",
    rating: 4.5,
    reviewCount: 45,
    social_media_links: [
      { platform: 'instagram', url: 'https://instagram.com/pizzacorner' },
      { platform: 'facebook', url: 'https://facebook.com/pizzacorner' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(255, 87, 34, 0.8) 0%, rgba(244, 67, 54, 0.8) 100%)'
    },


    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
        title: 'Margherita Pizza',
        category: 'food'
      },
      {
        url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
        title: 'Wood Fired Oven',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop',
        title: 'Fresh Ingredients',
        category: 'food'
      },
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
        title: 'Restaurant Interior',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=600&fit=crop',
        title: 'Pepperoni Pizza',
        category: 'food'
      },
      {
        url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&h=600&fit=crop',
        title: 'Pizza Making',
        category: 'service'
      }
    ],

    staff: [
      {
        name: 'Chef Marco Rossi',
        role: 'Head Chef',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&h=400&fit=crop',
        experience: '25 years',
        specialty: 'Neapolitan Pizza'
      },
      {
        name: 'Vikram Khanna',
        role: 'Sous Chef',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        experience: '10 years',
        specialty: 'Italian Cuisine'
      },
      {
        name: 'Sophia D\'Angelo',
        role: 'Pastry Chef',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        experience: '8 years',
        specialty: 'Desserts'
      },
      {
        name: 'Rahul Verma',
        role: 'Pizza Chef',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        experience: '6 years',
        specialty: 'Wood-Fired Pizza'
      }
    ],

    services: [
      {
        name: 'Margherita Pizza',
        price: '₹350',
        duration: '15 min',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop',
        description: 'Classic tomato & mozzarella'
      },
      {
        name: 'Pepperoni Pizza',
        price: '₹450',
        duration: '15 min',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop',
        description: 'Loaded with pepperoni'
      },
      {
        name: 'Vegetarian Special',
        price: '₹400',
        duration: '15 min',
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&h=400&fit=crop',
        description: 'Fresh veggies & herbs'
      },
      {
        name: 'BBQ Chicken',
        price: '₹500',
        duration: '20 min',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
        description: 'Smoky BBQ chicken'
      },
      {
        name: 'Family Combo',
        price: '₹1200',
        duration: '25 min',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
        description: '2 large pizzas + sides'
      }
    ],

    qualities: ['Delicious', 'Fresh', 'Authentic', 'Fast', 'Friendly', 'Value'],
    feelings: ['Satisfied', 'Happy', 'Full', 'Delighted', 'Impressed']
  },

  'fitness-hub': {
    id: 'fitness-hub',
    name: "Fitness Hub",
    logo: "💪",
    tagline: "Transform Your Body & Mind",
    description: "State-of-the-art gym with personal trainers, group classes, and modern equipment.",
    address: "90 HSR Layout, Bangalore, Karnataka 560102",
    phone: "+91-9876543213",
    email: "info@fitnesshub.com",
    rating: 4.7,
    reviewCount: 63,
    social_media_links: [
      { platform: 'instagram', url: 'https://instagram.com/fitnesshub' },
      { platform: 'youtube', url: 'https://youtube.com/fitnesshub' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(244, 67, 54, 0.8) 0%, rgba(233, 30, 99, 0.8) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
        title: 'Gym Equipment',
        category: 'equipment'
      },
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
        title: 'Workout Area',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop',
        title: 'Group Class',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
        title: 'Personal Training',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop',
        title: 'Cardio Zone',
        category: 'equipment'
      },
      {
        url: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800&h=600&fit=crop',
        title: 'Free Weights',
        category: 'equipment'
      }
    ],

    staff: [
      {
        name: 'Arjun Malhotra',
        role: 'Head Trainer',
        image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
        experience: '15 years',
        specialty: 'Strength Training'
      },
      {
        name: 'Priya Kapoor',
        role: 'Yoga Instructor',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop',
        experience: '10 years',
        specialty: 'Yoga & Flexibility'
      },
      {
        name: 'Rohit Sharma',
        role: 'Fitness Coach',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
        experience: '8 years',
        specialty: 'HIIT & Cardio'
      },
      {
        name: 'Sneha Patel',
        role: 'Nutritionist',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
        experience: '7 years',
        specialty: 'Diet Planning'
      }
    ],

    services: [
      {
        name: 'Personal Training',
        price: '₹3000/month',
        duration: '1 hour/session',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        description: 'One-on-one training'
      },
      {
        name: 'Group Classes',
        price: '₹1500/month',
        duration: '45 min/class',
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=400&fit=crop',
        description: 'Yoga, Zumba, HIIT'
      },
      {
        name: 'Gym Membership',
        price: '₹2000/month',
        duration: 'Unlimited',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
        description: 'Full gym access'
      },
      {
        name: 'Nutrition Plan',
        price: '₹2500/month',
        duration: 'Customized',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
        description: 'Personalized diet plan'
      },
      {
        name: 'Premium Package',
        price: '₹6000/month',
        duration: 'All inclusive',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop',
        description: 'Training + nutrition + classes'
      }
    ],

    qualities: ['Motivating', 'Professional', 'Clean', 'Modern', 'Supportive', 'Results-Driven'],
    feelings: ['Energized', 'Motivated', 'Strong', 'Healthy', 'Accomplished']
  },

  'beauty-lounge': {
    id: 'beauty-lounge',
    name: "Beauty Lounge",
    logo: "💄",
    tagline: "Enhance Your Natural Beauty",
    description: "Premium beauty salon offering makeup, skincare, and beauty treatments.",
    address: "12 Whitefield, Bangalore, Karnataka 560066",
    phone: "+91-9876543214",
    email: "contact@beautylounge.com",
    rating: 4.9,
    reviewCount: 168,
    social_media_links: [
      { platform: 'instagram', url: 'https://instagram.com/beautylounge' },
      { platform: 'tiktok', url: 'https://tiktok.com/@beautylounge' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(233, 30, 99, 0.8) 0%, rgba(156, 39, 176, 0.8) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop',
        title: 'Makeup Station',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=600&fit=crop',
        title: 'Beauty Treatment',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
        title: 'Skincare Products',
        category: 'products'
      },
      {
        url: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=800&h=600&fit=crop',
        title: 'Salon Interior',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
        title: 'Facial Treatment',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
        title: 'Makeup Application',
        category: 'service'
      }
    ],

    staff: [
      {
        name: 'Riya Mehta',
        role: 'Lead Makeup Artist',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop',
        experience: '12 years',
        specialty: 'Bridal Makeup'
      },
      {
        name: 'Ananya Gupta',
        role: 'Skincare Specialist',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
        experience: '10 years',
        specialty: 'Anti-Aging Treatments'
      },
      {
        name: 'Divya Nair',
        role: 'Beauty Therapist',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        experience: '8 years',
        specialty: 'Facials & Peels'
      },
      {
        name: 'Pooja Reddy',
        role: 'Nail Artist',
        image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
        experience: '6 years',
        specialty: 'Nail Art & Extensions'
      }
    ],

    services: [
      {
        name: 'Bridal Makeup',
        price: '₹8000',
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=400&fit=crop',
        description: 'Complete bridal look'
      },
      {
        name: 'Party Makeup',
        price: '₹3000',
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
        description: 'Glamorous party makeup'
      },
      {
        name: 'Facial Treatment',
        price: '₹2500',
        duration: '1 hour',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
        description: 'Deep cleansing facial'
      },
      {
        name: 'Manicure & Pedicure',
        price: '₹1500',
        duration: '1 hour',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop',
        description: 'Nail care & polish'
      },
      {
        name: 'Beauty Package',
        price: '₹12000',
        duration: '5 hours',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
        description: 'Complete beauty makeover'
      }
    ],

    qualities: ['Professional', 'Skilled', 'Creative', 'Hygienic', 'Luxurious', 'Attentive'],
    feelings: ['Beautiful', 'Confident', 'Glamorous', 'Pampered', 'Radiant']
  },

  'tech-solutions': {
    id: 'tech-solutions',
    name: "Tech Solutions Pro",
    logo: "💻",
    tagline: "Your Technology Partner",
    description: "Complete IT solutions including software development, web design, and tech support.",
    address: "34 Electronic City, Bangalore, Karnataka 560100",
    phone: "+91-9876543215",
    email: "info@techsolutions.com",
    rating: 4.8,
    reviewCount: 92,
    social_media_links: [
      { platform: 'linkedin', url: 'https://linkedin.com/company/techsolutions' },
      { platform: 'twitter', url: 'https://twitter.com/techsolutions' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
        title: 'Team Collaboration',
        category: 'team'
      },
      {
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
        title: 'Modern Office',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
        title: 'Development Work',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
        title: 'Tech Workspace',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        title: 'Data Analytics',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
        title: 'Team Meeting',
        category: 'team'
      }
    ],

    staff: [
      {
        name: 'Rajesh Kumar',
        role: 'CTO',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
        experience: '18 years',
        specialty: 'Cloud Architecture'
      },
      {
        name: 'Sarah Johnson',
        role: 'Lead Developer',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        experience: '12 years',
        specialty: 'Full Stack Development'
      },
      {
        name: 'Amit Verma',
        role: 'UI/UX Designer',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
        experience: '9 years',
        specialty: 'User Experience'
      },
      {
        name: 'Priya Desai',
        role: 'Project Manager',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        experience: '11 years',
        specialty: 'Agile Management'
      }
    ],

    services: [
      {
        name: 'Web Development',
        price: '₹50,000',
        duration: '4-6 weeks',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
        description: 'Custom website development'
      },
      {
        name: 'Mobile App Development',
        price: '₹80,000',
        duration: '8-12 weeks',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
        description: 'iOS & Android apps'
      },
      {
        name: 'Cloud Solutions',
        price: '₹30,000',
        duration: '2-3 weeks',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
        description: 'Cloud migration & setup'
      },
      {
        name: 'IT Support',
        price: '₹15,000/month',
        duration: 'Ongoing',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
        description: '24/7 technical support'
      },
      {
        name: 'Digital Marketing',
        price: '₹25,000/month',
        duration: 'Ongoing',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        description: 'SEO, SEM & social media'
      }
    ],

    qualities: ['Innovative', 'Reliable', 'Professional', 'Responsive', 'Expert', 'Efficient'],
    feelings: ['Confident', 'Satisfied', 'Impressed', 'Supported', 'Empowered']
  },

  'coffee-house': {
    id: 'coffee-house',
    name: "The Coffee House",
    logo: "☕",
    tagline: "Brewing Happiness Daily",
    description: "Artisan coffee shop serving premium coffee, fresh pastries, and light meals.",
    address: "56 Brigade Road, Bangalore, Karnataka 560025",
    phone: "+91-9876543216",
    email: "hello@thecoffeehouse.com",
    rating: 4.6,
    reviewCount: 156,
    social_media_links: [
      { platform: 'instagram', url: 'https://instagram.com/coffeehouse' },
      { platform: 'facebook', url: 'https://facebook.com/coffeehouse' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(120, 53, 15, 0.8) 0%, rgba(185, 94, 4, 0.8) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
        title: 'Coffee Shop Interior',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
        title: 'Fresh Coffee',
        category: 'food'
      },
      {
        url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
        title: 'Barista at Work',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop',
        title: 'Pastries & Desserts',
        category: 'food'
      },
      {
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
        title: 'Cozy Seating',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
        title: 'Latte Art',
        category: 'food'
      }
    ],

    staff: [
      {
        name: 'David Martinez',
        role: 'Head Barista',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        experience: '14 years',
        specialty: 'Specialty Coffee'
      },
      {
        name: 'Maya Krishnan',
        role: 'Pastry Chef',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        experience: '9 years',
        specialty: 'French Pastries'
      },
      {
        name: 'Karan Singh',
        role: 'Barista',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        experience: '6 years',
        specialty: 'Latte Art'
      },
      {
        name: 'Emma Wilson',
        role: 'Manager',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
        experience: '10 years',
        specialty: 'Customer Service'
      }
    ],

    services: [
      {
        name: 'Espresso',
        price: '₹120',
        duration: '5 min',
        image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=400&fit=crop',
        description: 'Classic espresso shot'
      },
      {
        name: 'Cappuccino',
        price: '₹180',
        duration: '7 min',
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop',
        description: 'Perfect foam cappuccino'
      },
      {
        name: 'Cold Brew',
        price: '₹200',
        duration: '5 min',
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&h=400&fit=crop',
        description: 'Smooth cold brew coffee'
      },
      {
        name: 'Croissant',
        price: '₹150',
        duration: '2 min',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop',
        description: 'Buttery French croissant'
      },
      {
        name: 'Breakfast Combo',
        price: '₹350',
        duration: '15 min',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop',
        description: 'Coffee + sandwich + pastry'
      }
    ],

    qualities: ['Cozy', 'Friendly', 'Fresh', 'Aromatic', 'Welcoming', 'Quality'],
    feelings: ['Relaxed', 'Energized', 'Happy', 'Comfortable', 'Satisfied']
  },

  'urban-dental': {
    id: 'urban-dental',
    name: "Urban Dental Clinic",
    logo: "🦷",
    tagline: "Smile with Confidence",
    description: "Modern dental clinic offering comprehensive oral care with latest technology.",
    address: "88 Jayanagar, Bangalore, Karnataka 560041",
    phone: "+91-9876543217",
    email: "care@urbandental.com",
    rating: 4.9,
    reviewCount: 203,
    social_media_links: [
      { platform: 'linkedin', url: 'https://linkedin.com/company/urbandental' },
      { platform: 'facebook', url: 'https://facebook.com/urbandental' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(14, 165, 233, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop',
        title: 'Modern Dental Clinic',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop',
        title: 'Dental Treatment',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=600&fit=crop',
        title: 'Dental Equipment',
        category: 'equipment'
      },
      {
        url: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&h=600&fit=crop',
        title: 'Waiting Area',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1609840114035-3c981960afb8?w=800&h=600&fit=crop',
        title: 'Dental Checkup',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=600&fit=crop',
        title: 'Consultation Room',
        category: 'interior'
      }
    ],

    staff: [
      {
        name: 'Dr. Anil Reddy',
        role: 'Chief Dentist',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
        experience: '22 years',
        specialty: 'Cosmetic Dentistry'
      },
      {
        name: 'Dr. Kavita Sharma',
        role: 'Orthodontist',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
        experience: '15 years',
        specialty: 'Braces & Aligners'
      },
      {
        name: 'Dr. Rohan Patel',
        role: 'Endodontist',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
        experience: '10 years',
        specialty: 'Root Canal'
      },
      {
        name: 'Dr. Sneha Iyer',
        role: 'Pediatric Dentist',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
        experience: '8 years',
        specialty: 'Children\'s Dentistry'
      }
    ],

    services: [
      {
        name: 'Dental Checkup',
        price: '₹500',
        duration: '30 min',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop',
        description: 'Complete oral examination'
      },
      {
        name: 'Teeth Cleaning',
        price: '₹1500',
        duration: '45 min',
        image: 'https://images.unsplash.com/photo-1609840114035-3c981960afb8?w=600&h=400&fit=crop',
        description: 'Professional cleaning & scaling'
      },
      {
        name: 'Teeth Whitening',
        price: '₹8000',
        duration: '1 hour',
        image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=400&fit=crop',
        description: 'Laser whitening treatment'
      },
      {
        name: 'Root Canal',
        price: '₹5000',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=400&fit=crop',
        description: 'Painless root canal therapy'
      },
      {
        name: 'Dental Implants',
        price: '₹25,000',
        duration: 'Multiple visits',
        image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=600&h=400&fit=crop',
        description: 'Permanent tooth replacement'
      }
    ],

    qualities: ['Professional', 'Gentle', 'Modern', 'Hygienic', 'Painless', 'Caring'],
    feelings: ['Confident', 'Comfortable', 'Relieved', 'Happy', 'Satisfied']
  },

  'pet-paradise': {
    id: 'pet-paradise',
    name: "Pet Paradise",
    logo: "🐾",
    tagline: "Where Pets Are Family",
    description: "Complete pet care services including grooming, boarding, and veterinary care.",
    address: "22 Sarjapur Road, Bangalore, Karnataka 560035",
    phone: "+91-9876543218",
    email: "care@petparadise.com",
    rating: 4.8,
    reviewCount: 134,
    social_media_links: [
      { platform: 'instagram', url: 'https://instagram.com/petparadise' },
      { platform: 'tiktok', url: 'https://tiktok.com/@petparadise' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop',
        title: 'Pet Grooming',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
        title: 'Happy Pets',
        category: 'pets'
      },
      {
        url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
        title: 'Pet Boarding',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
        title: 'Veterinary Care',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&h=600&fit=crop',
        title: 'Play Area',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&h=600&fit=crop',
        title: 'Pet Training',
        category: 'service'
      }
    ],

    staff: [
      {
        name: 'Dr. Vikram Joshi',
        role: 'Chief Veterinarian',
        image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
        experience: '16 years',
        specialty: 'Small Animal Medicine'
      },
      {
        name: 'Anjali Menon',
        role: 'Pet Groomer',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop',
        experience: '11 years',
        specialty: 'Professional Grooming'
      },
      {
        name: 'Rahul Kapoor',
        role: 'Pet Trainer',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        experience: '9 years',
        specialty: 'Behavioral Training'
      },
      {
        name: 'Priya Nambiar',
        role: 'Pet Nutritionist',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        experience: '7 years',
        specialty: 'Pet Nutrition'
      }
    ],

    services: [
      {
        name: 'Pet Grooming',
        price: '₹800',
        duration: '1 hour',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
        description: 'Bath, trim & styling'
      },
      {
        name: 'Veterinary Checkup',
        price: '₹600',
        duration: '30 min',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop',
        description: 'Complete health checkup'
      },
      {
        name: 'Pet Boarding',
        price: '₹1000/day',
        duration: 'Per day',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
        description: 'Comfortable boarding facility'
      },
      {
        name: 'Pet Training',
        price: '₹5000/month',
        duration: '4 weeks',
        image: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=600&h=400&fit=crop',
        description: 'Obedience training'
      },
      {
        name: 'Pet Spa Package',
        price: '₹2500',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
        description: 'Complete spa treatment'
      }
    ],

    qualities: ['Caring', 'Professional', 'Clean', 'Gentle', 'Experienced', 'Loving'],
    feelings: ['Happy', 'Relieved', 'Confident', 'Grateful', 'Satisfied']
  },

  'green-grocers': {
    id: 'green-grocers',
    name: "Green Grocers",
    logo: "🥬",
    tagline: "Fresh & Organic Always",
    description: "Premium organic grocery store offering fresh produce, health foods, and eco-friendly products.",
    address: "15 Malleshwaram, Bangalore, Karnataka 560003",
    phone: "+91-9876543219",
    email: "hello@greengrocers.com",
    rating: 4.7,
    reviewCount: 178,
    social_media_links: [
      { platform: 'instagram', url: 'https://instagram.com/greengrocers' },
      { platform: 'facebook', url: 'https://facebook.com/greengrocers' }
    ],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(22, 163, 74, 0.8) 0%, rgba(21, 128, 61, 0.8) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop',
        title: 'Fresh Vegetables',
        category: 'products'
      },
      {
        url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&h=600&fit=crop',
        title: 'Organic Fruits',
        category: 'products'
      },
      {
        url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=600&fit=crop',
        title: 'Store Interior',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
        title: 'Grocery Shopping',
        category: 'service'
      },
      {
        url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=600&fit=crop',
        title: 'Organic Section',
        category: 'products'
      },
      {
        url: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=800&h=600&fit=crop',
        title: 'Health Foods',
        category: 'products'
      }
    ],

    staff: [
      {
        name: 'Ramesh Iyer',
        role: 'Store Manager',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        experience: '13 years',
        specialty: 'Organic Products'
      },
      {
        name: 'Lakshmi Rao',
        role: 'Nutritionist',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        experience: '10 years',
        specialty: 'Health & Wellness'
      },
      {
        name: 'Suresh Kumar',
        role: 'Produce Manager',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        experience: '8 years',
        specialty: 'Fresh Produce'
      },
      {
        name: 'Deepa Nair',
        role: 'Customer Service',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        experience: '6 years',
        specialty: 'Customer Care'
      }
    ],

    services: [
      {
        name: 'Organic Vegetables',
        price: '₹80/kg',
        duration: 'Fresh daily',
        image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop',
        description: 'Farm-fresh organic veggies'
      },
      {
        name: 'Organic Fruits',
        price: '₹120/kg',
        duration: 'Fresh daily',
        image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&h=400&fit=crop',
        description: 'Seasonal organic fruits'
      },
      {
        name: 'Health Foods',
        price: 'Varies',
        duration: 'In stock',
        image: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=600&h=400&fit=crop',
        description: 'Superfoods & supplements'
      },
      {
        name: 'Home Delivery',
        price: 'Free above ₹500',
        duration: 'Same day',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
        description: 'Convenient home delivery'
      },
      {
        name: 'Monthly Basket',
        price: '₹3000',
        duration: 'Monthly',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop',
        description: 'Curated monthly produce'
      }
    ],

    qualities: ['Fresh', 'Organic', 'Healthy', 'Sustainable', 'Quality', 'Friendly'],
    feelings: ['Healthy', 'Happy', 'Satisfied', 'Confident', 'Energized']
  },

  'pizza-corner': {
    id: 'pizza-corner',
    name: "Pizza Corner",
    logo: "🍕",
    tagline: "Speed. Taste. Love.",
    description: "The best pizza in town, served fresh and hot.",
    address: "Food Street, Koramangala, Bangalore",
    phone: "+91-9876543210",
    email: "love@pizzacorner.com",
    rating: 4.5,
    reviewCount: 156,
    social_media_links: [],
    google_business_url: 'https://search.google.com/local/writereview?placeid=ChIJUewm6BHXCDkRdClN6_t0Be4',
    googlePlaceId: 'ChIJUewm6BHXCDkRdClN6_t0Be4',

    hero: {
      main: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop',
      overlay: 'linear-gradient(135deg, rgba(255, 100, 50, 0.8) 0%, rgba(200, 50, 50, 0.8) 100%)'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
        title: 'Classic Pepperoni',
        category: 'food'
      },
      {
        url: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&h=600&fit=crop',
        title: 'Cozy Ambience',
        category: 'interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop',
        title: 'Fresh Pasta',
        category: 'food'
      },
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
        title: 'Chef at Work',
        category: 'staff'
      },
      {
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
        title: 'Healthy Salads',
        category: 'food'
      },
      {
        url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop',
        title: 'Refreshing Drinks',
        category: 'food'
      }
    ],

    staff: [
      {
        name: 'Marco Rossi',
        role: 'Head Chef',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
        experience: '20 years',
        specialty: 'Authentic Italian Napoletana'
      },
      {
        name: 'Sarah Jen',
        role: 'Restaurant Manager',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        experience: '8 years',
        specialty: 'Customer Experience'
      },
      {
        name: 'Luigi Verdi',
        role: 'Sous Chef',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop',
        experience: '12 years',
        specialty: 'Handmade Pasta'
      }
    ],

    // FULL SERVICE OBJECTS FOR BEAUTIFUL BUSINESS PAGE
    // LeaveReviewPage will be updated to handle these smarty
    services: [
      {
        name: 'Gourmet Pizza',
        price: '₹450',
        duration: '15-20 min',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=400&fit=crop',
        description: 'Wood-fired, authentic Italian pizzas with fresh toppings.'
      },
      {
        name: 'Handmade Pasta',
        price: '₹350',
        duration: '15 min',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop',
        description: 'Freshly made pasta with rich, creamy sauces.'
      },
      {
        name: 'Juicy Burgers',
        price: '₹250',
        duration: '10 min',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
        description: 'Grilled to perfection with premium cheese and veggies.'
      },
      {
        name: 'Signature Drinks',
        price: '₹150',
        duration: 'Instant',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop',
        description: 'Refreshing mojitos, shakes, and soft drinks.'
      },
      {
        name: 'Sweet Desserts',
        price: '₹200',
        duration: 'Ready',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop',
        description: 'Tiramisu, cheesecake, and chocolate lava cake.'
      },
      {
        name: 'Fresh Wraps',
        price: '₹180',
        duration: '10 min',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop',
        description: 'Healthy and filling wraps with zesty sauces.'
      },
      {
        name: 'Green Salads',
        price: '₹220',
        duration: '10 min',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
        description: 'Locally sourced organic greens and dressings.'
      },
      {
        name: 'Crispy Fries',
        price: '₹120',
        duration: '5 min',
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&h=400&fit=crop',
        description: 'Golden fried potatoes with signature seasoning.'
      }
    ],

    qualities: ['Tasty', 'Fast', 'Hot', 'Cheesy', 'Fresh', 'Crispy'],
    feelings: ['Full', 'Happy', 'Satisfied', 'Excited']
  }
};

// Helper function to get business by ID
export const getBusinessById = (id) => {
  return businesses[id] || null; // Return null if not found, so BusinessPage can fetch from Supabase
};

// Get all businesses as array
export const getAllBusinesses = () => {
  return Object.values(businesses);
};
